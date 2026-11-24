import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/services/authContext';
import { stagesBySchool, gradesByStage } from '@/services/db';
import { Plus, Layers, ListOrdered } from 'lucide-react';

export function StagesPage() {
  const { session, membership } = useAuth();
  if (!session) return null;
  const stages = stagesBySchool(session.activeSchoolId);

  return (
    <div>
      <PageHeader title="المراحل" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: 'المراحل' }]}
        actions={membership && <button className="btn-primary btn-sm"><Plus size={14} /> مرحلة جديدة</button>} />
      <div className="space-y-4">
        {stages.map(stage => (
          <div key={stage.id} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center"><Layers size={18} className="text-brand-600" /></div>
              <div><h3 className="text-sm font-semibold text-sand-800">{stage.name}</h3><p className="text-xs text-sand-400">الترتيب: {stage.sequence}</p></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gradesByStage(stage.id).map(grade => (
                <div key={grade.id} className="flex items-center gap-2 p-3 rounded-lg border border-sand-200">
                  <ListOrdered size={14} className="text-sand-400" />
                  <span className="text-sm text-sand-700">{grade.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
