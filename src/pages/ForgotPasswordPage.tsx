import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { showToast } from '@/components/ui';

export function ForgotPasswordPage() {
  const [nationalId, setNationalId] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    showToast('تم إرسال رابط استعادة كلمة المرور (محاكاة)', 'success');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-sm text-sand-500 hover:text-sand-700 mb-6">
          <ArrowRight size={16} /> العودة لتسجيل الدخول
        </Link>
        <div className="card p-8">
          <h2 className="text-xl font-bold text-sand-900 mb-1">نسيت كلمة المرور</h2>
          <p className="text-sm text-sand-500 mb-6">أدخل رقم الهوية الوطنية لإرسال رابط الاستعادة</p>
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Mail size={28} className="text-emerald-600" />
              </div>
              <p className="text-sm text-sand-600">تم إرسال رابط استعادة كلمة المرور إلى بريدك المسجل (محاكاة تجريبية)</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">رقم الهوية الوطنية</label>
                <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="input ltr-numbers" dir="ltr" placeholder="1000000001" />
              </div>
              <button type="submit" className="btn-primary w-full">إرسال رابط الاستعادة</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
