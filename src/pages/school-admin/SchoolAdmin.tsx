import { useState } from 'react';
import { Bus, Users, Baby, CreditCard, Route, Radio, History, FileText, AlertTriangle, Settings, BarChart3, UserCheck, TrendingUp, Wallet, MapPin, ChevronLeft, Plus, Phone, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Badge, statusBadge, StatCard, EmptyState } from '@/components/ui';
import { DataTable } from '@/components/ui/table';
import { BarChart, DonutChart, ProgressBar } from '@/components/ui/charts';
import { Drawer } from '@/components/ui/overlays';
import { AddFormModal } from '@/components/ui/FormModal';
import { useToast } from '@/components/ui/toast';
import { buses, drivers, supervisors, students, trips, schools, getBusById, getDriverById, getSupervisorById, transportStats } from '@/data/mockData';
import type { Bus as BusType, Driver as DriverType, Student as StudentType } from '@/types';
import { cn } from '@/lib/utils';

export function SchoolAdminDashboard() {
  return (
    <div>
      <PageHeader title="لوحة النقل" description="إدارة عمليات النقل — مدارس المستقبل الأهلية، فرع النخيل" breadcrumb={[{ label: 'النقل' }, { label: 'لوحة النقل' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="إجمالي الحافلات" value={buses.length} icon={<Bus size={20} />} accent="emerald" trend="up" trendValue="1" />
        <StatCard label="الطلاب المنقولون" value={students.length} icon={<Baby size={20} />} accent="info" />
        <StatCard label="السائقون" value={drivers.length} icon={<Users size={20} />} accent="gold" />
        <StatCard label="المشرفون" value={supervisors.length} icon={<UserCheck size={20} />} accent="warning" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-semibold mb-4">إحصائيات النقل الشهرية</h3>
          <BarChart data={[
            { month: 'يونيو', value: 420 }, { month: 'يوليو', value: 380 }, { month: 'أغسطس', value: 450 },
            { month: 'سبتمبر', value: 480 }, { month: 'أكتوبر', value: 510 }, { month: 'نوفمبر', value: 530 },
          ]} height={180} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">توزيع الاشتراكات</h3>
          <DonutChart segments={[
            { label: 'ذهاب وإياب', value: 15, color: '#16845B' },
            { label: 'ذهاب فقط', value: 7, color: '#4285B8' },
            { label: 'إياب فقط', value: 3, color: '#C9A45C' },
          ]} centerValue="25" centerLabel="طالب" />
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">الحافلات الأكثر نشاطاً</h3>
          <div className="space-y-3">
            {buses.slice(0, 4).map(bus => {
              const count = students.filter(s => s.busId === bus.id).length;
              return (
                <div key={bus.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: bus.color }}>{bus.code.slice(-2)}</div>
                  <span className="text-sm flex-1">{bus.code}</span>
                  <div className="w-32"><ProgressBar value={count} max={bus.capacity} color={bus.color} /></div>
                  <span className="text-xs text-ink-500 num w-12 text-left">{count}/{bus.capacity}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">مؤشرات الأداء</h3>
          <div className="space-y-3">
            {[
              { label: 'نسبة الالتزام بالوقت', value: 94.2, color: '#16845B' },
              { label: 'نسبة الحضور', value: 88.0, color: '#4285B8' },
              { label: 'رضا أولياء الأمور', value: 92.5, color: '#C9A45C' },
              { label: 'كفاءة المسارات', value: 86.0, color: '#D99A32' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1"><span className="text-ink-500">{item.label}</span><span className="font-semibold num">{item.value}%</span></div>
                <ProgressBar value={item.value} color={item.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function FleetManagement() {
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="إدارة الحافلات" description="إدارة أسطول الحافلات والمركبات" breadcrumb={[{ label: 'النقل' }, { label: 'إدارة الحافلات' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة حافلة</button>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map(bus => {
          const driver = getDriverById(bus.driverId);
          const sup = getSupervisorById(bus.supervisorId);
          const sb = statusBadge(bus.status);
          const count = students.filter(s => s.busId === bus.id).length;
          return (
            <Card key={bus.id} className="p-5 cursor-pointer" hover onClick={() => setSelectedBus(bus)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus.color }}><Bus size={20} /></div>
                  <div><p className="font-semibold">{bus.code}</p><p className="text-xs text-ink-500">{bus.model}</p></div>
                </div>
                <Badge variant={sb.variant} dot>{sb.label}</Badge>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between"><span className="text-ink-500">اللوحة</span><span className="font-medium num">{bus.plateNumber}</span></div>
                <div className="flex justify-between"><span className="text-ink-500">السائق</span><span className="font-medium">{driver?.name || '—'}</span></div>
                <div className="flex justify-between"><span className="text-ink-500">المشرفة</span><span className="font-medium">{sup?.name || '—'}</span></div>
              </div>
              <ProgressBar value={count} max={bus.capacity} color={bus.color} />
              <p className="text-xs text-ink-500 mt-2 num">{count}/{bus.capacity} طالب</p>
            </Card>
          );
        })}
      </div>
      <Drawer open={!!selectedBus} onClose={() => setSelectedBus(null)} title={selectedBus?.code || ''} description="تفاصيل الحافلة" width="md">
        {selectedBus && <BusDetails bus={selectedBus} />}
      </Drawer>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة حافلة جديدة"
        description="أدخل بيانات الحافلة الجديدة"
        fields={[
          { key: 'code', label: 'رمز الحافلة', placeholder: 'MST-007', required: true },
          { key: 'plate', label: 'رقم اللوحة', placeholder: 'ر س ط - 7890', required: true },
          { key: 'model', label: 'الموديل', placeholder: 'تويوتا كوستير', required: true },
          { key: 'year', label: 'سنة الصنع', type: 'number', placeholder: '2024', required: true },
          { key: 'capacity', label: 'السعة (عدد الركاب)', type: 'number', placeholder: '30', required: true },
          { key: 'driver', label: 'السائق المعين', type: 'select', placeholder: 'بدون — يمكن التعيين لاحقاً', hint: 'يمكنك تعيين السائق لاحقاً من شاشة إدارة السائقين', options: drivers.map(d => ({ value: d.id, label: d.name })) },
          { key: 'supervisor', label: 'المشرفة المعينة', type: 'select', placeholder: 'بدون — يمكن التعيين لاحقاً', hint: 'يمكنك تعيين المشرفة لاحقاً', options: supervisors.map(s => ({ value: s.id, label: s.name })) },
        ]}
        onSubmit={() => push('success', 'تم إضافة الحافلة بنجاح')}
      />
    </div>
  );
}

function BusDetails({ bus }: { bus: BusType }) {
  const driver = getDriverById(bus.driverId);
  const sup = getSupervisorById(bus.supervisorId);
  const busStudents = students.filter(s => s.busId === bus.id);
  const busTrips = trips.filter(t => t.busId === bus.id);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: bus.color }}><Bus size={32} /></div>
        <div>
          <h3 className="text-lg font-bold">{bus.code}</h3>
          <p className="text-sm text-ink-500">{bus.model} • <span className="num">{bus.year}</span></p>
          <Badge variant={statusBadge(bus.status).variant} dot>{statusBadge(bus.status).label}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">اللوحة</p><p className="font-semibold num">{bus.plateNumber}</p></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">السعة</p><p className="font-semibold num">{bus.capacity} راكب</p></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">العداد</p><p className="font-semibold num">{bus.odometer.toLocaleString()} كم</p></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">آخر صيانة</p><p className="font-semibold">{bus.lastService}</p></div>
      </div>
      {driver && (
        <div>
          <p className="text-xs font-semibold text-ink-500 mb-2">السائق</p>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-line">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: driver.avatarColor }}>{driver.name.charAt(0)}</div>
            <div className="flex-1"><p className="font-medium text-sm">{driver.name}</p><p className="text-xs text-ink-500 num">{driver.phone}</p></div>
            <Badge variant={statusBadge(driver.status).variant} dot>{statusBadge(driver.status).label}</Badge>
          </div>
        </div>
      )}
      {sup && (
        <div>
          <p className="text-xs font-semibold text-ink-500 mb-2">المشرفة</p>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-line">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: sup.avatarColor }}>{sup.name.charAt(0)}</div>
            <div className="flex-1"><p className="font-medium text-sm">{sup.name}</p><p className="text-xs text-ink-500 num">{sup.phone}</p></div>
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-ink-500 mb-2">الطلاب المنقولون (<span className="num">{busStudents.length}</span>)</p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {busStudents.slice(0, 6).map(s => (
            <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
              <span className="text-sm flex-1">{s.name}</span>
              <Badge variant={statusBadge(s.subscriptionType).variant}>{statusBadge(s.subscriptionType).label}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DriverManagement() {
  const [selected, setSelected] = useState<DriverType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="إدارة السائقين" description="إدارة بيانات السائقين والرخص" breadcrumb={[{ label: 'النقل' }, { label: 'إدارة السائقين' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة سائق</button>} />
      <Card className="p-0 overflow-hidden">
        <div className="p-5">
          <DataTable
            data={drivers}
            searchKey={(d) => d.name + d.phone + d.licenseNumber}
            searchPlaceholder="بحث بالاسم أو الهاتف أو رقم الرخصة..."
            columns={[
              { key: 'name', label: 'السائق', sortable: true, render: (d) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: d.avatarColor }}>{d.name.charAt(0)}</div>
                  <span className="font-medium">{d.name}</span>
                </div>
              ) },
              { key: 'phone', label: 'الهاتف', render: (d) => <span className="num text-ink-700">{d.phone}</span> },
              { key: 'license', label: 'رقم الرخصة', render: (d) => <span className="num text-ink-700">{d.licenseNumber}</span> },
              { key: 'bus', label: 'الحافلة', render: (d) => { const b = getBusById(d.busId); return <span className="font-medium">{b?.code || '—'}</span>; } },
              { key: 'rating', label: 'التقييم', sortable: true, render: (d) => <span className="flex items-center gap-1 num"><Star size={14} className="text-gold fill-gold" />{d.rating}</span> },
              { key: 'status', label: 'الحالة', render: (d) => { const sb = statusBadge(d.status); return <Badge variant={sb.variant} dot>{sb.label}</Badge>; } },
            ]}
            onRowClick={(d) => setSelected(d)}
          />
        </div>
      </Card>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة سائق جديد"
        description="أدخل بيانات السائق الجديد"
        fields={[
          { key: 'name', label: 'الاسم الكامل', placeholder: 'محمد القحطاني', required: true },
          { key: 'phone', label: 'رقم الهاتف', type: 'tel', placeholder: '0501234567', required: true },
          { key: 'license', label: 'رقم الرخصة', placeholder: 'D-1029384', required: true },
          { key: 'licenseExpiry', label: 'تاريخ انتهاء الرخصة', type: 'date', required: true },
          { key: 'bus', label: 'الحافلة المعينة', type: 'select', placeholder: 'بدون — يمكن التعيين لاحقاً', hint: 'يمكنك تعيين الحافلة لاحقاً من شاشة إدارة الحافلات', options: buses.map(b => ({ value: b.id, label: b.code })) },
        ]}
        onSubmit={() => push('success', 'تم إضافة السائق بنجاح')}
      />
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} description="تفاصيل السائق">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: selected.avatarColor }}>{selected.name.charAt(0)}</div>
              <div>
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-sm text-ink-500 flex items-center gap-1 num"><Phone size={14} />{selected.phone}</p>
                <Badge variant={statusBadge(selected.status).variant} dot>{statusBadge(selected.status).label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">رقم الرخصة</p><p className="font-semibold num">{selected.licenseNumber}</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">انتهاء الرخصة</p><p className="font-semibold">{selected.licenseExpiry}</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">التقييم</p><p className="font-semibold num">{selected.rating} ★</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">رحلات منجزة</p><p className="font-semibold num">{selected.tripsCount}</p></div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export function StudentTransport() {
  const [selected, setSelected] = useState<StudentType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="نقل الطلاب" description="إدارة الطلاب المشتركين في خدمة النقل" breadcrumb={[{ label: 'النقل' }, { label: 'نقل الطلاب' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة طالب</button>} />
      <Card className="p-0 overflow-hidden">
        <div className="p-5">
          <DataTable
            data={students}
            searchKey={(s) => s.name + s.grade + s.homeAddress}
            searchPlaceholder="بحث بالاسم أو الصف أو العنوان..."
            pageSize={10}
            columns={[
              { key: 'name', label: 'الطالب', sortable: true, render: (s) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                  <span className="font-medium">{s.name}</span>
                </div>
              ) },
              { key: 'grade', label: 'الصف', sortable: true, render: (s) => <span>{s.grade} {s.section}</span> },
              { key: 'bus', label: 'الحافلة', render: (s) => { const b = getBusById(s.busId); return <span className="font-medium">{b?.code}</span>; } },
              { key: 'subscription', label: 'الاشتراك', render: (s) => <Badge variant={statusBadge(s.subscriptionType).variant}>{statusBadge(s.subscriptionType).label}</Badge> },
              { key: 'status', label: 'الحالة', render: (s) => <Badge variant={statusBadge(s.serviceStatus).variant} dot>{statusBadge(s.serviceStatus).label}</Badge> },
            ]}
            onRowClick={(s) => setSelected(s)}
          />
        </div>
      </Card>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة طالب جديد"
        description="أدخل بيانات الطالب المشترك في خدمة النقل"
        fields={[
          { key: 'name', label: 'اسم الطالب', placeholder: 'عبدالله العتيبي', required: true },
          { key: 'grade', label: 'الصف الدراسي', type: 'select', required: true, options: [
            { value: '1', label: 'الصف الأول' }, { value: '2', label: 'الصف الثاني' }, { value: '3', label: 'الصف الثالث' },
            { value: '4', label: 'الصف الرابع' }, { value: '5', label: 'الصف الخامس' }, { value: '6', label: 'الصف الأول المتوسط' },
          ] },
          { key: 'section', label: 'الشعبة', type: 'select', options: [{ value: 'أ', label: 'أ' }, { value: 'ب', label: 'ب' }, { value: 'ج', label: 'ج' }] },
          { key: 'bus', label: 'الحافلة المعينة', type: 'select', required: true, options: buses.map(b => ({ value: b.id, label: b.code })) },
          { key: 'subscription', label: 'نوع الاشتراك', type: 'select', required: true, options: [
            { value: 'round_trip', label: 'ذهاب وإياب' }, { value: 'one_way', label: 'ذهاب فقط' }, { value: 'return_only', label: 'إياب فقط' },
          ] },
          { key: 'address', label: 'عنوان المنزل', placeholder: 'حي النخيل، شارع 15', required: true },
        ]}
        onSubmit={() => push('success', 'تم إضافة الطالب بنجاح')}
      />
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} description="تفاصيل الطالب">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: selected.avatarColor }}>{selected.name.charAt(0)}</div>
              <div>
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <p className="text-sm text-ink-500">{selected.grade} شعبة {selected.section}</p>
                <Badge variant={statusBadge(selected.serviceStatus).variant} dot>{statusBadge(selected.serviceStatus).label}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">العنوان</p><p className="font-medium flex items-center gap-1.5"><MapPin size={14} />{selected.homeAddress}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الحافلة</p><p className="font-semibold">{getBusById(selected.busId)?.code}</p></div>
                <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الاشتراك</p><Badge variant={statusBadge(selected.subscriptionType).variant}>{statusBadge(selected.subscriptionType).label}</Badge></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export function TransportReports() {
  return (
    <div>
      <PageHeader title="تقارير النقل" description="تقارير شاملة عن عمليات النقل" breadcrumb={[{ label: 'النقل' }, { label: 'التقارير' }]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'تقرير الرحلات اليومي', desc: 'تفاصيل جميع رحلات اليوم', icon: History, color: '#16845B' },
          { title: 'تقرير الحضور والغياب', desc: 'إحصائيات حضور الطلاب', icon: Users, color: '#4285B8' },
          { title: 'تقرير أداء السائقين', desc: 'تقييمات ومسارات السائقين', icon: TrendingUp, color: '#C9A45C' },
          { title: 'تقرير صيانة الحافلات', desc: 'حالة الأسطول والصيانة', icon: Bus, color: '#D99A32' },
          { title: 'تقرير الاشتراكات', desc: 'إحصائيات اشتراكات الطلاب', icon: CreditCard, color: '#16845B' },
          { title: 'تقرير الحالات الطارئة', desc: 'سجل الحوادث والإنهاءات', icon: AlertTriangle, color: '#D64B4B' },
        ].map((r, i) => (
          <Card key={i} className="p-5" hover>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: r.color + '20', color: r.color }}>
              <r.icon size={20} />
            </div>
            <p className="font-semibold mb-1">{r.title}</p>
            <p className="text-xs text-ink-500 mb-3">{r.desc}</p>
            <button className="text-sm text-emerald flex items-center gap-1 hover:gap-2 transition-all">تحميل التقرير <ChevronLeft size={14} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}
