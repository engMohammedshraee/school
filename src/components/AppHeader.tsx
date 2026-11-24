import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, Building2, GitBranch, Calendar, LogOut, UserCog, Check, X } from 'lucide-react';
import { useAuth } from '@/services/authContext';
import { getSchool, getBranch, getAcademicYear, branchesBySchool, academicYearsBySchool, membershipsByUser, getMembership } from '@/services/db';
import { demoAccounts } from '@/data/users';
import { getUserById } from '@/services/userService';
import { UserAvatar } from '@/components/ui';
import { cn } from '@/utils/cn';

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const { user, membership, session, logout, switchUser, setActiveSchool, setActiveBranch, setActiveAcademicYear } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [switchUserOpen, setSwitchUserOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const schoolRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
      if (schoolRef.current && !schoolRef.current.contains(target)) setSchoolOpen(false);
      if (branchRef.current && !branchRef.current.contains(target)) setBranchOpen(false);
      if (yearRef.current && !yearRef.current.contains(target)) setYearOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || !membership || !session) return null;

  const isPlatform = membership.roleKey === 'platform_super_admin';
  const school = getSchool(session.activeSchoolId);
  const branch = session.activeBranchId ? getBranch(session.activeBranchId) : null;
  const academicYear = getAcademicYear(session.activeAcademicYearId);

  const userMemberships = membershipsByUser(user.id);
  const availableSchools = userMemberships
    .filter(m => m.status === 'active')
    .map(m => getSchool(m.schoolId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const availableBranches = school ? branchesBySchool(school.id).filter(b => {
    if (membership.branchIds.length === 0) return true;
    return membership.branchIds.includes(b.id);
  }) : [];

  const availableYears = school ? academicYearsBySchool(school.id) : [];

  const notifications = [
    { id: 1, title: 'تسجيل طالب جديد', message: 'تم تسجيل الطالب محمد سعد الحربي', time: 'منذ 10 دقائق', unread: true },
    { id: 2, title: 'وثيقة بحاجة مراجعة', message: 'شهادة ميلاد الطالب سارة القحطاني', time: 'منذ ساعة', unread: true },
    { id: 3, title: 'تحديث الجدول الدراسي', message: 'تم تحديث جدول شعبة الصف الخامس أ', time: 'منذ 3 ساعات', unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-sand-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Right side — sidebar toggle + context selectors */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="btn-ghost btn-icon lg:hidden">
          <Menu size={20} />
        </button>

        {/* School selector — only for non-platform users with multiple schools */}
        {!isPlatform && availableSchools.length > 0 && (
          <div className="relative" ref={schoolRef}>
            <button
              onClick={() => setSchoolOpen(!schoolOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand-50 text-sm transition-colors"
            >
              <Building2 size={16} className="text-brand-600" />
              <span className="font-medium text-sand-800 hidden sm:inline">{school?.name}</span>
              <ChevronDown size={14} className="text-sand-400" />
            </button>
            {schoolOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 card p-2 animate-scale-in z-50">
                <p className="px-2 py-1 text-[11px] text-sand-400 font-semibold">تبديل المدرسة</p>
                {availableSchools.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSchool(s.id); setSchoolOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors',
                      s.id === session.activeSchoolId ? 'bg-brand-50 text-brand-700' : 'hover:bg-sand-50 text-sand-700'
                    )}
                  >
                    <span>{s.name}</span>
                    {s.id === session.activeSchoolId && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Branch selector */}
        {!isPlatform && availableBranches.length > 0 && (
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand-50 text-sm transition-colors"
            >
              <GitBranch size={16} className="text-brand-600" />
              <span className="font-medium text-sand-800 hidden md:inline">{branch?.name ?? 'كل الفروع'}</span>
              <ChevronDown size={14} className="text-sand-400" />
            </button>
            {branchOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 card p-2 animate-scale-in z-50">
                <p className="px-2 py-1 text-[11px] text-sand-400 font-semibold">تبديل الفرع</p>
                {membership.branchIds.length === 0 && (
                  <button
                    onClick={() => { setActiveBranch(null); setBranchOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors',
                      !session.activeBranchId ? 'bg-brand-50 text-brand-700' : 'hover:bg-sand-50 text-sand-700'
                    )}
                  >
                    <span>كل الفروع</span>
                    {!session.activeBranchId && <Check size={14} />}
                  </button>
                )}
                {availableBranches.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setActiveBranch(b.id); setBranchOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors',
                      b.id === session.activeBranchId ? 'bg-brand-50 text-brand-700' : 'hover:bg-sand-50 text-sand-700'
                    )}
                  >
                    <span>{b.name}</span>
                    {b.id === session.activeBranchId && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Academic Year selector */}
        {!isPlatform && availableYears.length > 0 && (
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setYearOpen(!yearOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand-50 text-sm transition-colors"
            >
              <Calendar size={16} className="text-brand-600" />
              <span className="font-medium text-sand-800 hidden lg:inline ltr-numbers">{academicYear?.label}</span>
              <ChevronDown size={14} className="text-sand-400" />
            </button>
            {yearOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 card p-2 animate-scale-in z-50">
                <p className="px-2 py-1 text-[11px] text-sand-400 font-semibold">السنة الدراسية</p>
                {availableYears.map(y => (
                  <button
                    key={y.id}
                    onClick={() => { setActiveAcademicYear(y.id); setYearOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ltr-numbers',
                      y.id === session.activeAcademicYearId ? 'bg-brand-50 text-brand-700' : 'hover:bg-sand-50 text-sand-700'
                    )}
                  >
                    <span>{y.label}</span>
                    {y.id === session.activeAcademicYearId && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Left side — notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="btn-ghost btn-icon relative">
            <Bell size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
          {notifOpen && (
            <div className="absolute left-0 top-full mt-1 w-80 card p-0 overflow-hidden animate-scale-in z-50">
              <div className="px-4 py-3 border-b border-sand-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-sand-800">الإشعارات</h3>
                <span className="badge-info">3 جديدة</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={cn('px-4 py-3 border-b border-sand-100 hover:bg-sand-50 cursor-pointer', n.unread && 'bg-brand-50/30')}>
                    <div className="flex items-start gap-2">
                      {!n.unread && <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />}
                      {n.unread && <div className="w-2 h-2 rounded-full bg-sand-300 mt-1.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sand-800">{n.title}</p>
                        <p className="text-xs text-sand-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-sand-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-sand-50 transition-colors"
          >
            <UserAvatar name={user.name} color={user.avatarColor} size={32} />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-sand-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-sand-400 leading-tight">{getRoleLabel(membership.roleKey)}</p>
            </div>
            <ChevronDown size={14} className="text-sand-400" />
          </button>
          {profileOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 card p-2 animate-scale-in z-50">
              <div className="px-3 py-2 border-b border-sand-100">
                <p className="text-sm font-semibold text-sand-800">{user.name}</p>
                <p className="text-xs text-sand-400">{user.email ?? '—'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setSwitchUserOpen(true); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sand-700 hover:bg-sand-50 transition-colors"
                >
                  <UserCog size={16} />
                  تبديل المستخدم التجريبي
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Switch User Modal */}
      {switchUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-sand-900/40 backdrop-blur-sm" onClick={() => setSwitchUserOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-elevated w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-sand-900">تبديل المستخدم التجريبي</h3>
              <button onClick={() => setSwitchUserOpen(false)} className="btn-ghost btn-icon"><X size={18} /></button>
            </div>
            <p className="text-xs text-sand-400 mb-4">اختر مستخدمًا تجريبيًا لتجربة النظام بدور مختلف</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {demoAccounts.map(acc => {
                const demoUser = getUserById(acc.userId);
                if (!demoUser) return null;
                return (
                  <button
                    key={acc.userId}
                    onClick={() => { switchUser(acc.userId); setSwitchUserOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-right',
                      user.id === acc.userId ? 'border-brand-300 bg-brand-50' : 'border-sand-200 hover:bg-sand-50'
                    )}
                  >
                    <UserAvatar name={demoUser.name} color={demoUser.avatarColor} size={36} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{demoUser.name}</p>
                      <p className="text-xs text-sand-400">{acc.label}</p>
                    </div>
                    {user.id === acc.userId && <Check size={16} className="text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function getRoleLabel(roleKey: string): string {
  const labels: Record<string, string> = {
    platform_super_admin: 'مدير المنصة',
    school_manager: 'مدير المدرسة',
    student_affairs: 'مسؤول شؤون الطلاب',
    teacher: 'معلم',
    guardian: 'ولي أمر',
    student: 'طالب',
    accountant: 'محاسب',
    admin_staff: 'موظف إداري',
  };
  return labels[roleKey] ?? roleKey;
}
