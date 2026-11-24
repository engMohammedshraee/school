import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs } from '@/components/ui';
import { useState } from 'react';
import { db, getAcademicYear, termsByYear, periodsByTerm } from '@/services/db';
import { ArrowRight, Plus } from 'lucide-react';

export function AcademicYearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('terms');

  const year = id ? getAcademicYear(id) : undefined;
  if (!year) return <div>السنة الدراسية غير موجودة</div>;

  const terms = termsByYear(year.id);

  return (
    <div>
      <PageHeader title={`السنة الدراسية ${year.label}`} breadcrumbs={[{ label: 'الرئيسية' }, { label: 'السنوات الدراسية' }, { label: year.label }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate('/academic-years')}><ArrowRight size={14} /> رجوع</button>} />

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-sand-900 ltr-numbers">{year.label}</h2>
            <p className="text-sm text-sand-500 ltr-numbers">{year.startDate} → {year.endDate}</p>
          </div>
          {year.status === 'active' ? <StatusBadge variant="success">نشطة</StatusBadge> : year.status === 'closed' ? <StatusBadge variant="neutral">مغلقة</StatusBadge> : <StatusBadge variant="warning">قيد الإعداد</StatusBadge>}
        </div>
      </div>

      <Tabs tabs={[{ key: 'terms', label: 'الفصول الدراسية' }, { key: 'periods', label: 'الفترات' }]} active={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'terms' && (
          <div className="space-y-4">
            {terms.map(term => (
              <div key={term.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div><h3 className="text-sm font-semibold text-sand-800">{term.name}</h3><p className="text-xs text-sand-400 ltr-numbers">{term.startDate} → {term.endDate}</p></div>
                  {term.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : term.status === 'closed' ? <StatusBadge variant="neutral">مغلق</StatusBadge> : <StatusBadge variant="warning">قيد الإعداد</StatusBadge>}
                </div>
                <div className="mt-4">
                  <p className="text-xs text-sand-400 mb-2">الفترات</p>
                  <div className="space-y-2">
                    {periodsByTerm(term.id).map(per => (
                      <div key={per.id} className="flex items-center justify-between p-2 rounded-lg bg-sand-50">
                        <span className="text-sm text-sand-700">{per.name}</span>
                        <div className="flex items-center gap-2"><span className="text-xs text-sand-400 ltr-numbers">{per.startDate} → {per.endDate}</span>{per.status === 'active' ? <StatusBadge variant="success">نشطة</StatusBadge> : <StatusBadge variant="neutral">مغلقة</StatusBadge>}</div>
                      </div>
                    ))}
                    {periodsByTerm(term.id).length === 0 && <p className="text-xs text-sand-400">لا توجد فترات</p>}
                  </div>
                </div>
              </div>
            ))}
            {terms.length === 0 && <div className="card p-8 text-center text-sand-400 text-sm">لا توجد فصول دراسية</div>}
          </div>
        )}

        {activeTab === 'periods' && (
          <div className="card p-5">
            <p className="text-sm text-sand-600 mb-4">الفترات تُعرض ضمن كل فصل دراسي. البنية تدعم عددًا متغيرًا من الفترات لكل فصل.</p>
            <div className="space-y-3">
              {terms.flatMap(term => periodsByTerm(term.id).map(per => ({ per, term }))).map(({ per, term }) => (
                <div key={per.id} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                  <div><p className="text-sm font-medium text-sand-800">{per.name}</p><p className="text-xs text-sand-400">{term.name}</p></div>
                  <span className="text-xs text-sand-400 ltr-numbers">{per.startDate} → {per.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
