import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthSession, SchoolMembership, User } from '@/types';
import { membershipsByUser, getMembership, getSchool, academicYearsBySchool } from './db';
import { getUserByNationalId, getUserById } from './userService';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'masar_session';

interface AuthContextValue {
  user: User | null;
  membership: SchoolMembership | null;
  session: AuthSession | null;
  login: (nationalId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAs: (userId: string) => void;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
  setActiveSchool: (schoolId: string) => void;
  setActiveBranch: (branchId: string | null) => void;
  setActiveAcademicYear: (yearId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [membership, setMembership] = useState<SchoolMembership | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const s = JSON.parse(stored) as AuthSession;
        const mem = getMembership(s.activeMembershipId);
        const fullUser = getUserById(s.userId);
        if (fullUser && mem) {
          setUser(fullUser);
          setMembership(mem);
          setSession(s);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persistSession = useCallback((s: AuthSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, []);

  const establishSession = useCallback((userId: string, membershipId?: string) => {
    const mems = membershipsByUser(userId);
    if (mems.length === 0) return false;

    let mem = membershipId ? getMembership(membershipId) : null;
    if (!mem) {
      mem = mems.find(m => m.status === 'active') ?? mems[0];
    }
    if (!mem) return false;

    const fullUser = getUserById(userId);
    if (!fullUser) return false;

    const school = getSchool(mem.schoolId);
    if (!school) return false;

    const years = academicYearsBySchool(mem.schoolId);
    const activeYear = years.find(y => y.status === 'active') ?? years[0];

    const newSession: AuthSession = {
      userId,
      activeMembershipId: mem.id,
      activeSchoolId: mem.schoolId,
      activeBranchId: mem.branchIds.length > 0 ? mem.branchIds[0] : null,
      activeAcademicYearId: activeYear?.id ?? '',
    };

    setUser(fullUser);
    setMembership(mem);
    setSession(newSession);
    persistSession(newSession);
    return true;
  }, [persistSession]);

  const login = useCallback(async (nationalId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = getUserByNationalId(nationalId);
    if (!foundUser) return { success: false, error: 'رقم الهوية غير مسجل في النظام' };
    if (!foundUser.loginEnabled) return { success: false, error: 'حساب هذا المستخدم غير مفعل للدخول' };

    const mems = membershipsByUser(foundUser.id);
    if (mems.length === 0) return { success: false, error: 'لا يوجد عضوية مرتبطة بهذا المستخدم' };

    // Authenticate with Supabase using the user's email
    const email = foundUser.email ?? `${foundUser.nationalId}@masar.demo`;
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return { success: false, error: 'بيانات الدخول غير صحيحة' };

    const success = establishSession(foundUser.id);
    if (!success) return { success: false, error: 'تعذر إنشاء الجلسة' };
    return { success: true };
  }, [establishSession]);

  const loginAs = useCallback((userId: string) => {
    establishSession(userId);
  }, [establishSession]);

  const switchUser = useCallback((userId: string) => {
    establishSession(userId);
  }, [establishSession]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setMembership(null);
    setSession(null);
  }, []);

  const setActiveSchool = useCallback((schoolId: string) => {
    if (!user) return;
    const mems = membershipsByUser(user.id);
    const mem = mems.find(m => m.schoolId === schoolId && m.status === 'active');
    if (!mem) return;

    const years = academicYearsBySchool(schoolId);
    const activeYear = years.find(y => y.status === 'active') ?? years[0];

    setMembership(mem);
    const newSession: AuthSession = {
      userId: user.id,
      activeMembershipId: mem.id,
      activeSchoolId: schoolId,
      activeBranchId: mem.branchIds.length > 0 ? mem.branchIds[0] : null,
      activeAcademicYearId: activeYear?.id ?? '',
    };
    setSession(newSession);
    persistSession(newSession);
  }, [user, persistSession]);

  const setActiveBranch = useCallback((branchId: string | null) => {
    if (!session) return;
    const newSession = { ...session, activeBranchId: branchId };
    setSession(newSession);
    persistSession(newSession);
  }, [session, persistSession]);

  const setActiveAcademicYear = useCallback((yearId: string) => {
    if (!session) return;
    const newSession = { ...session, activeAcademicYearId: yearId };
    setSession(newSession);
    persistSession(newSession);
  }, [session, persistSession]);

  return (
    <AuthContext.Provider value={{
      user, membership, session,
      login, loginAs, logout, switchUser,
      setActiveSchool, setActiveBranch, setActiveAcademicYear,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
