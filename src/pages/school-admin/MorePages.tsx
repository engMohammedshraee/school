import { useState } from 'react';
import { UserCheck, CreditCard, Route, History, AlertTriangle, Settings, BarChart3, Phone, Star, Plus, MapPin, ChevronLeft, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Badge, statusBadge, StatCard, EmptyState } from '@/components/ui';
import { DataTable } from '@/components/ui/table';
import { BarChart, DonutChart, ProgressBar } from '@/components/ui/charts';
import { Drawer, ConfirmDialog } from '@/components/ui/overlays';
import { AddFormModal } from '@/components/ui/FormModal';
import { useToast } from '@/components/ui/toast';
import { supervisors, students, buses, trips, schools, drivers, getBusById, transportStats } from '@/data/mockData';
import type { Supervisor as SupervisorType } from '@/types';

export function SupervisorManagement() {
  const [selected, setSelected] = useState<SupervisorType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="إدارة المشرفين" description="إدارة بيانات المشرفين والمعلمين المرافقين" breadcrumb={[{ label: 'النقل' }, { label: 'إدارة المشرفين' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة مشرفة</button>} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={supervisors}
          searchKey={(s) => s.name + s.phone + s.grade}
          searchPlaceholder="بحث بالاسم أو الهاتف..."
          columns={[
            { key: 'name', label: 'المشرفة', sortable: true, render: (s) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <span className="font-medium">{s.name}</span>
              </div>
            ) },
            { key: 'phone', label: 'الهاتف', render: (s) => <span className="num text-ink-700">{s.phone}</span> },
            { key: 'grade', label: 'المرحلة', sortable: true, render: (s) => <span>{s.grade}</span> },
            { key: 'bus', label: 'الحافلة', render: (s) => { const b = getBusById(s.busId); return <span className="font-medium">{b?.code || '—'}</span>; } },
            { key: 'status', label: 'الحالة', render: (s) => { const sb = statusBadge(s.status); return <Badge variant={sb.variant} dot>{sb.label}</Badge>; } },
          ]}
          onRowClick={(s) => setSelected(s)}
        />
      </div></Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} description="تفاصيل المشرفة">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: selected.avatarColor }}>{selected.name.charAt(0)}</div>
              <div>
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-sm text-ink-500">{selected.grade}</p>
                <Badge variant={statusBadge(selected.status).variant} dot>{statusBadge(selected.status).label}</Badge>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الهاتف</p><p className="font-semibold flex items-center gap-1.5 num"><Phone size={14} />{selected.phone}</p></div>
            <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الحافلة المعينة</p><p className="font-semibold">{getBusById(selected.busId)?.code || 'غير معينة'}</p></div>
          </div>
        )}
      </Drawer>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة مشرفة جديدة"
        description="أدخل بيانات المشرفة الجديدة"
        fields={[
          { key: 'name', label: 'الاسم الكامل', placeholder: 'نورة الدوسري', required: true },
          { key: 'phone', label: 'رقم الهاتف', type: 'tel', placeholder: '0561234567', required: true },
          { key: 'grade', label: 'المرحلة', type: 'select', required: true, options: [
            { value: 'ابتدائية', label: 'المرحلة الابتدائية' }, { value: 'متوسطة', label: 'المرحلة المتوسطة' }, { value: 'ثانوية', label: 'المرحلة الثانوية' },
          ] },
          { key: 'bus', label: 'الحافلة المعينة', type: 'select', options: buses.map(b => ({ value: b.id, label: b.code })) },
        ]}
        onSubmit={() => push('success', 'تم إضافة المشرفة بنجاح')}
      />
    </div>
  );
}

export function TransportSubscriptions() {
  return (
    <div>
      <PageHeader title="اشتراكات النقل" description="إدارة اشتراكات الطلاب في خدمة النقل" breadcrumb={[{ label: 'النقل' }, { label: 'اشتراكات النقل' }]} />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="ذهاب وإياب" value={students.filter(s => s.subscriptionType === 'round_trip').length} icon={<CreditCard size={20} />} accent="emerald" />
        <StatCard label="ذهاب فقط" value={students.filter(s => s.subscriptionType === 'one_way').length} icon={<CreditCard size={20} />} accent="info" />
        <StatCard label="إياب فقط" value={students.filter(s => s.subscriptionType === 'return_only').length} icon={<CreditCard size={20} />} accent="gold" />
      </div>
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={students}
          searchKey={(s) => s.name}
          pageSize={10}
          columns={[
            { key: 'name', label: 'الطالب', sortable: true, render: (s) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <span className="font-medium">{s.name}</span>
              </div>
            ) },
            { key: 'grade', label: 'الصف', render: (s) => <span className="text-ink-700">{s.grade}</span> },
            { key: 'type', label: 'نوع الاشتراك', render: (s) => <Badge variant={statusBadge(s.subscriptionType).variant}>{statusBadge(s.subscriptionType).label}</Badge> },
            { key: 'bus', label: 'الحافلة', render: (s) => <span className="font-medium">{getBusById(s.busId)?.code}</span> },
            { key: 'status', label: 'حالة الخدمة', render: (s) => <Badge variant={statusBadge(s.serviceStatus).variant} dot>{statusBadge(s.serviceStatus).label}</Badge> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function RoutesManagement() {
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="المسارات وتعيينات الرحلات" description="إدارة مسارات الحافلات وتعيينات الرحلات" breadcrumb={[{ label: 'النقل' }, { label: 'المسارات' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة مسار</button>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map(bus => {
          const busStudents = students.filter(s => s.busId === bus.id);
          return (
            <Card key={bus.id} className="p-5" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus.color }}><Route size={20} /></div>
                <div><p className="font-semibold">{bus.code}</p><p className="text-xs text-ink-500 num">{busStudents.length} محطة</p></div>
              </div>
              <div className="space-y-1.5">
                {busStudents.slice(0, 4).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs">
                    <span className="h-5 w-5 rounded-full bg-surface-subtle flex items-center justify-center text-ink-500 num">{i + 1}</span>
                    <MapPin size={12} className="text-ink-300" />
                    <span className="flex-1 truncate text-ink-700">{s.name}</span>
                  </div>
                ))}
                {busStudents.length > 4 && <p className="text-xs text-ink-500 mr-7 num">+{busStudents.length - 4} محطات أخرى</p>}
              </div>
              <div className="mt-4 pt-3 border-t border-line">
                <ProgressBar value={busStudents.length} max={bus.capacity} color={bus.color} />
              </div>
            </Card>
          );
        })}
      </div>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة مسار جديد"
        description="أنشئ مسار رحلة جديد للحافلة"
        fields={[
          { key: 'bus', label: 'الحافلة', type: 'select', required: true, options: buses.map(b => ({ value: b.id, label: b.code })) },
          { key: 'direction', label: 'اتجاه الرحلة', type: 'select', required: true, options: [
            { value: 'going', label: 'ذهاب (صباحاً)' }, { value: 'return', label: 'إياب (مساءً)' },
          ] },
          { key: 'startTime', label: 'وقت البدء', required: true, placeholder: '06:30' },
          { key: 'driver', label: 'السائق', type: 'select', options: drivers.map(d => ({ value: d.id, label: d.name })) },
          { key: 'supervisor', label: 'المشرفة', type: 'select', options: supervisors.map(s => ({ value: s.id, label: s.name })) },
        ]}
        onSubmit={() => push('success', 'تم إنشاء المسار بنجاح')}
      />
    </div>
  );
}

export function TripHistory() {
  return (
    <div>
      <PageHeader title="سجل الرحلات" description="سجل جميع رحلات النقل السابقة" breadcrumb={[{ label: 'النقل' }, { label: 'سجل الرحلات' }]} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={trips}
          searchKey={(t) => t.id + getBusById(t.busId)?.code || ''}
          columns={[
            { key: 'date', label: 'التاريخ', sortable: true, render: (t) => <span className="num">{t.date}</span> },
            { key: 'bus', label: 'الحافلة', render: (t) => <span className="font-medium">{getBusById(t.busId)?.code}</span> },
            { key: 'direction', label: 'الاتجاه', render: (t) => <Badge variant={t.direction === 'going' ? 'info' : 'gold'}>{t.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge> },
            { key: 'time', label: 'الوقت', render: (t) => <span className="num text-ink-700">{t.startTime} → {t.endTime || '—'}</span> },
            { key: 'students', label: 'الطلاب', render: (t) => <span className="num">{t.boardedCount}/{t.studentsCount}</span> },
            { key: 'status', label: 'الحالة', render: (t) => <Badge variant={statusBadge(t.status).variant} dot>{statusBadge(t.status).label}</Badge> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function EmergencyManagement() {
  const { push } = useToast();
  const [showTerminate, setShowTerminate] = useState(false);
  const terminatedTrip = trips.find(t => t.status === 'terminated');
  const activeTrips = trips.filter(t => t.status === 'active');

  return (
    <div>
      <PageHeader title="الإدارة الطارئة" description="إدارة الحالات الطارئة وإنهاء الرحلات" breadcrumb={[{ label: 'النقل' }, { label: 'الإدارة الطارئة' }]} />
      <Card className="p-5 mb-4 border-danger/20 bg-danger/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={24} className="text-danger shrink-0" />
          <div>
            <h3 className="font-semibold text-danger">إجراءات طارئة متاحة</h3>
            <p className="text-sm text-ink-700 mt-1">يمكنك إنهاء أي رحلة نشطة قسرياً في الحالات الطارئة. سيتم إيقاف بث GPS وإشعار السائق والمشرفة وأولياء الأمور.</p>
          </div>
        </div>
      </Card>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">الرحلات النشطة</h3>
          <div className="space-y-2">
            {activeTrips.map(t => {
              const bus = getBusById(t.busId);
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-line">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Route size={18} /></div>
                  <div className="flex-1"><p className="font-medium text-sm">{bus?.code}</p><p className="text-xs text-ink-500">{t.direction === 'going' ? 'ذهاب' : 'إياب'} • <span className="num">{t.startTime}</span></p></div>
                  <Badge variant={statusBadge(t.status).variant} dot>{statusBadge(t.status).label}</Badge>
                  <button onClick={() => setShowTerminate(true)} className="btn-danger text-xs py-1.5 px-3"><AlertTriangle size={14} />إنهاء</button>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3">سجل الحالات الطارئة</h3>
          {terminatedTrip ? (
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/15">
              <div className="flex items-center justify-between mb-2"><p className="font-semibold text-sm text-danger">إنهاء طارئ</p><Badge variant="danger" dot>منتهية قسرياً</Badge></div>
              <p className="text-sm text-ink-700 mb-2">{terminatedTrip.terminateReason}</p>
              <div className="flex items-center gap-3 text-xs text-ink-500"><span className="num">{terminatedTrip.date}</span><span className="num">{terminatedTrip.startTime}</span></div>
            </div>
          ) : <EmptyState icon={<History size={28} />} title="لا توجد حالات طارئة" />}
        </Card>
      </div>
      <ConfirmDialog open={showTerminate} onClose={() => setShowTerminate(false)} onConfirm={(r) => { if (r) { push('warning', 'تم إنهاء الرحلة قسرياً'); setShowTerminate(false); } }} title="إنهاء طارئ للرحلة" description="هذا إجراء خطير سيؤدي إلى إيقاف الرحلة فوراً. يرجى إدخال سبب الإنهاء." confirmLabel="تأكيد الإنهاء" danger requireText placeholder="أدخل سبب الإنهاء..." />
    </div>
  );
}

export function TransportSettings() {
  return (
    <div>
      <PageHeader title="إعدادات النقل" description="إعدادات خدمة النقل للمدرسة" breadcrumb={[{ label: 'النقل' }, { label: 'الإعدادات' }]} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">إعدادات الرحلات</h3>
          <div className="space-y-4">
            <SettingRow label="وقت بداية الرحلة الصباحية" value="06:30" />
            <SettingRow label="وقت بداية الرحلة المسائية" value="14:00" />
            <SettingRow label="نصف قطر الجيوفيensing" value="500 متر" />
            <SettingRow label="مدة احتفاظ GPS" value="48 ساعة" />
            <SettingRow label="إشعارات أولياء الأمور" value="مفعّلة" toggle />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">إعدادات الرسوم</h3>
          <div className="space-y-4">
            <SettingRow label="رسوم الاشتراك السنوية" value="1,800 ر.س" />
            <SettingRow label="عدد الأقساط" value="3 أقساط" />
            <SettingRow label="مدة السماح بعد الاستحقاق" value="15 يوم" />
            <SettingRow label="الإيقاف التلقائي عند التأخر" value="مفعّل" toggle />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingRow({ label, value, toggle }: { label: string; value: string; toggle?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-700">{label}</span>
      {toggle ? (
        <div className="h-6 w-11 rounded-full bg-emerald p-0.5 cursor-pointer">
          <div className="h-5 w-5 rounded-full bg-white mr-auto transition-transform" />
        </div>
      ) : <span className="text-sm font-semibold text-ink-900">{value}</span>}
    </div>
  );
}

export function TransportOverview() {
  return (
    <div>
      <PageHeader title="نظرة عامة على النقل" description="تحليل شامل لعمليات النقل" breadcrumb={[{ label: 'النقل' }, { label: 'نظرة عامة' }]} />
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">حركة الرحلات الشهرية</h3>
          <BarChart data={[
            { month: 'يونيو', value: 420 }, { month: 'يوليو', value: 380 }, { month: 'أغسطس', value: 450 },
            { month: 'سبتمبر', value: 480 }, { month: 'أكتوبر', value: 510 }, { month: 'نوفمبر', value: 530 },
          ]} height={200} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">توزيع الحالات</h3>
          <DonutChart segments={[
            { label: 'طلاب نشطون', value: 24, color: '#16845B' },
            { label: 'موقوفون مالياً', value: 1, color: '#D64B4B' },
            { label: 'غائبون اليوم', value: 3, color: '#D99A32' },
          ]} centerValue="25" centerLabel="طالب" />
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">ملخص أداء الأسطول</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">نسبة الالتزام بالوقت</p><p className="text-2xl font-bold text-success num">94.2%</p></div>
          <div className="p-4 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">متوسط مدة الرحلة</p><p className="text-2xl font-bold num">42 د</p></div>
          <div className="p-4 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">إجمالي الكيلومترات</p><p className="text-2xl font-bold num">12,450</p></div>
          <div className="p-4 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">استهلاك الوقود</p><p className="text-2xl font-bold num">3,200 ل</p></div>
        </div>
      </Card>
    </div>
  );
}
