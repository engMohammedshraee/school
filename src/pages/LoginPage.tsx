import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, KeyRound, UserCircle } from 'lucide-react';
import { useAuth } from '@/services/authContext';
import { demoAccounts } from '@/data/users';
import { getUserById } from '@/services/userService';
import { UserAvatar } from '@/components/ui';
import { cn } from '@/utils/cn';

export function LoginPage() {
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(nationalId, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error ?? 'حدث خطأ غير متوقع');
      }
    } catch {
      setLoading(false);
      setError('حدث خطأ غير متوقع');
    }
  }

  function handleDemoLogin(userId: string) {
    setError('');
    setLoading(true);
    setTimeout(() => {
      loginAs(userId);
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  }

  return (
    <div className="min-h-screen flex">
      {/* Right panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">مسار</h1>
              <p className="text-brand-200 text-sm">نظام إدارة المدارس</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 leading-relaxed">
            نظام متكامل لإدارة المدارس متعددة الفروع والسنوات الدراسية
          </h2>
          <p className="text-brand-200 leading-relaxed mb-8">
            منصة موحدة لإدارة الطلاب والمعلمين والشؤون الأكاديمية، مصممة لتكون بديلاً مؤسسيًا احترافيًا للمدارس الحديثة.
          </p>
          <div className="space-y-3">
            {[
              'إدارة متعددة المدارس والفروع',
              'هوية موحدة للمستخدمين عبر المدارس',
              'تتبع تاريخ التسجيل والتوظيف',
              'صلاحيات مرنة قائمة على الأدوار',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-brand-100">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-sand-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-2xl">م</div>
            <div>
              <h1 className="text-xl font-bold text-sand-900">مسار</h1>
              <p className="text-xs text-sand-400">نظام إدارة المدارس</p>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-sand-900 mb-1">تسجيل الدخول</h2>
            <p className="text-sm text-sand-500 mb-6">أدخل رقم الهوية الوطنية وكلمة المرور للمتابعة</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">رقم الهوية الوطنية</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400" />
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="1000000001"
                    className="input pr-10 ltr-numbers"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="label">كلمة المرور</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pr-10"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fade-in">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'جارٍ التحقق...' : 'تسجيل الدخول'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-brand-600 hover:text-brand-700 font-medium">
                  نسيت كلمة المرور؟
                </Link>
                <Link to="/change-password" className="text-sand-500 hover:text-sand-700">
                  تغيير كلمة المرور المؤقتة
                </Link>
              </div>
            </form>
          </div>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-sand-200" />
              <p className="text-xs text-sand-400 font-medium">تجربة النظام كـ</p>
              <div className="flex-1 h-px bg-sand-200" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => {
                const demoUser = getUserById(acc.userId);
                if (!demoUser) return null;
                return (
                  <button
                    key={acc.userId}
                    onClick={() => handleDemoLogin(acc.userId)}
                    disabled={loading}
                    className={cn(
                      'flex items-center gap-2 p-2.5 rounded-lg border border-sand-200 bg-white hover:border-brand-300 hover:bg-brand-50/30 transition-colors text-right disabled:opacity-50'
                    )}
                  >
                    <UserAvatar name={demoUser.name} color={demoUser.avatarColor} size={28} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-sand-700 truncate">{acc.label}</p>
                      <p className="text-[10px] text-sand-400 truncate">{demoUser.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[10px] text-sand-400 mt-3">
              كلمة المرور التجريبية: password123 · هذا نموذج تجريبي للتحقق من تجربة المستخدم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
