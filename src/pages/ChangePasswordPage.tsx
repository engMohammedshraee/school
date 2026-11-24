import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { showToast } from '@/components/ui';

export function ChangePasswordPage() {
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    showToast('تم تغيير كلمة المرور بنجاح (محاكاة)', 'success');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-sm text-sand-500 hover:text-sand-700 mb-6">
          <ArrowRight size={16} /> العودة لتسجيل الدخول
        </Link>
        <div className="card p-8">
          <h2 className="text-xl font-bold text-sand-900 mb-1">تغيير كلمة المرور المؤقتة</h2>
          <p className="text-sm text-sand-500 mb-6">أدخل كلمة المرور المؤقتة ثم كلمة المرور الجديدة</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">كلمة المرور المؤقتة</label>
              <input type="password" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">كلمة المرور الجديدة</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" className="btn-primary w-full">تغيير كلمة المرور</button>
          </form>
        </div>
      </div>
    </div>
  );
}
