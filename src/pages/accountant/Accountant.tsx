import { useState } from 'react';
import {
  Wallet, Receipt, CreditCard, FileText, PauseCircle, BarChart3, Users,
  TrendingUp, AlertTriangle, ChevronLeft, Check, Clock, DollarSign,
  Download, Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Badge, statusBadge, StatCard, EmptyState } from '@/components/ui';
import { DataTable } from '@/components/ui/table';
import { BarChart, DonutChart, ProgressBar } from '@/components/ui/charts';
import { Drawer, ConfirmDialog } from '@/components/ui/overlays';
import { useToast } from '@/components/ui/toast';
import { invoices, students, getBusById } from '@/data/mockData';
import type { Invoice, Student } from '@/types';
import { cn } from '@/lib/utils';

export function AccountantDashboard() {
  const totalRevenue = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const outstanding = invoices.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div>
      <PageHeader title="اللوحة المالية" description="إدارة الرسوم والفواتير لنقل الطلاب" breadcrumb={[{ label: 'المالية' }, { label: 'اللوحة المالية' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="إجمالي الإيرادات" value={`${totalRevenue.toLocaleString()} ر.س`} icon={<Wallet size={20} />} accent="emerald" trend="up" trendValue="8%" />
        <StatCard label="الرصيد المستحق" value={`${outstanding.toLocaleString()} ر.س`} icon={<AlertTriangle size={20} />} accent="danger" />
        <StatCard label="فواتير مدفوعة" value={paidCount} icon={<Check size={20} />} accent="info" />
        <StatCard label="فواتير متأخرة" value={overdueCount} icon={<Clock size={20} />} accent="warning" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-semibold mb-4">الأداء المالي الشهري</h3>
          <BarChart data={[
            { month: 'يونيو', value: 14200 }, { month: 'يوليو', value: 15800 }, { month: 'أغسطس', value: 18500 },
            { month: 'سبتمبر', value: 22300 }, { month: 'أكتوبر', value: 24800 }, { month: 'نوفمبر', value: 26100 },
          ]} height={200} color="#16845B" formatValue={(v) => `${v.toLocaleString()} ر.س`} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">حالة الفواتير</h3>
          <DonutChart segments={[
            { label: 'مدفوعة', value: paidCount, color: '#16845B' },
            { label: 'قيد الانتظار', value: invoices.filter(i => i.status === 'pending').length, color: '#D99A32' },
            { label: 'متأخرة', value: overdueCount, color: '#D64B4B' },
            { label: 'جزئية', value: invoices.filter(i => i.status === 'partial').length, color: '#4285B8' },
          ]} centerValue={invoices.length} centerLabel="فاتورة" />
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">الفواتير المتأخرة</h3>
          <div className="space-y-3">
            {invoices.filter(i => i.status === 'overdue').slice(0, 4).map(inv => (
              <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-danger/5 border border-danger/15">
                <div className="h-9 w-9 rounded-lg bg-danger/10 flex items-center justify-center text-danger"><AlertTriangle size={18} /></div>
                <div className="flex-1"><p className="font-medium text-sm">{inv.studentName}</p><p className="text-xs text-ink-500">تاريخ الاستحقاق: <span className="num">{inv.dueDate}</span></p></div>
                <span className="font-bold text-danger num text-sm">{(inv.amount - inv.paidAmount).toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">مؤشرات مالية</h3>
          <div className="space-y-3">
            <div><div className="flex justify-between text-sm mb-1"><span className="text-ink-500">نسبة التحصيل</span><span className="font-semibold num">{Math.round((totalRevenue / (totalRevenue + outstanding)) * 100)}%</span></div><ProgressBar value={(totalRevenue / (totalRevenue + outstanding)) * 100} /></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-ink-500">نسبة المتأخرات</span><span className="font-semibold num">{Math.round((overdueCount / invoices.length) * 100)}%</span></div><ProgressBar value={(overdueCount / invoices.length) * 100} color="#D64B4B" /></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-ink-500">رضا أولياء الأمور</span><span className="font-semibold num">92%</span></div><ProgressBar value={92} color="#C9A45C" /></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function TransportFees() {
  return (
    <div>
      <PageHeader title="رسوم النقل" description="إدارة رسوم نقل الطلاب" breadcrumb={[{ label: 'المالية' }, { label: 'رسوم النقل' }]} />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="رسوم سنوية" value="1,800 ر.س" icon={<Wallet size={20} />} accent="emerald" />
        <StatCard label="عدد الأقساط" value="3" icon={<CreditCard size={20} />} accent="info" />
        <StatCard label="القسط الواحد" value="600 ر.س" icon={<DollarSign size={20} />} accent="gold" />
      </div>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">هيكل الرسوم</h3>
        <DataTable
          data={[
            { id: 'f1', type: 'ذهاب وإياب', amount: 1800, studentsCount: students.filter(s => s.subscriptionType === 'round_trip').length },
            { id: 'f2', type: 'ذهاب فقط', amount: 1200, studentsCount: students.filter(s => s.subscriptionType === 'one_way').length },
            { id: 'f3', type: 'إياب فقط', amount: 1200, studentsCount: students.filter(s => s.subscriptionType === 'return_only').length },
          ]}
          columns={[
            { key: 'type', label: 'نوع الاشتراك', render: (r) => <span className="font-medium">{r.type}</span> },
            { key: 'amount', label: 'الرسوم السنوية', sortable: true, render: (r) => <span className="num font-semibold">{r.amount.toLocaleString()} ر.س</span> },
            { key: 'students', label: 'عدد الطلاب', sortable: true, render: (r) => <span className="num">{r.studentsCount}</span> },
            { key: 'total', label: 'الإجمالي', render: (r) => <span className="num font-bold text-emerald">{(r.amount * r.studentsCount).toLocaleString()} ر.س</span> },
          ]}
        />
      </Card>
    </div>
  );
}

export function StudentAccounts() {
  const [selected, setSelected] = useState<Student | null>(null);
  const { push } = useToast();
  const [showSuspend, setShowSuspend] = useState(false);
  const [suspended, setSuspended] = useState<Set<string>>(new Set(students.filter(s => s.serviceStatus === 'suspended').map(s => s.id)));

  const handleSuspend = () => {
    if (selected) {
      setSuspended(prev => new Set([...prev, selected.id]));
      push('warning', `تم إيقاف خدمة النقل للطالب ${selected.name}`);
      setShowSuspend(false);
    }
  };

  const studentsWithStatus = students.map(s => ({ ...s, serviceStatus: suspended.has(s.id) ? 'suspended' as const : s.serviceStatus }));

  return (
    <div>
      <PageHeader title="حسابات نقل الطلاب" description="حسابات الطلاب المالية وحالة الخدمة" breadcrumb={[{ label: 'المالية' }, { label: 'حسابات الطلاب' }]} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={studentsWithStatus}
          searchKey={(s) => s.name}
          pageSize={10}
          columns={[
            { key: 'name', label: 'الطالب', sortable: true, render: (s) => (
              <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div><span className="font-medium">{s.name}</span></div>
            ) },
            { key: 'grade', label: 'الصف', render: (s) => <span className="text-ink-700">{s.grade}</span> },
            { key: 'bus', label: 'الحافلة', render: (s) => <span className="font-medium">{getBusById(s.busId)?.code}</span> },
            { key: 'status', label: 'حالة الخدمة', render: (s) => <Badge variant={statusBadge(s.serviceStatus).variant} dot>{statusBadge(s.serviceStatus).label}</Badge> },
            { key: 'action', label: '', render: (s) => s.serviceStatus === 'suspended' ? <Badge variant="neutral">موقوف</Badge> : <button onClick={(e) => { e.stopPropagation(); setSelected(s); setShowSuspend(true); }} className="text-danger text-xs font-medium hover:bg-danger/10 px-2 py-1 rounded-lg">إيقاف</button> },
          ]}
          onRowClick={(s) => setSelected(s)}
        />
      </div></Card>
      <Drawer open={!!selected && !showSuspend} onClose={() => setSelected(null)} title={selected?.name || ''} description="الحساب المالي">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الرسوم السنوية</p><p className="font-semibold num">1,800 ر.س</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">المدفوع</p><p className="font-semibold num text-success">{invoices.find(i => i.studentId === selected.id)?.paidAmount.toLocaleString() || 0} ر.س</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">المتبقي</p><p className="font-semibold num text-warning">{(1800 - (invoices.find(i => i.studentId === selected.id)?.paidAmount || 0)).toLocaleString()} ر.س</p></div>
              <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الحالة</p><Badge variant={statusBadge(selected.serviceStatus).variant} dot>{statusBadge(selected.serviceStatus).label}</Badge></div>
            </div>
            {selected.serviceStatus !== 'suspended' && (
              <button onClick={() => setShowSuspend(true)} className="w-full btn-danger"><PauseCircle size={18} />إيقاف خدمة النقل</button>
            )}
          </div>
        )}
      </Drawer>
      <ConfirmDialog open={showSuspend} onClose={() => setShowSuspend(false)} onConfirm={handleSuspend} title="إيقاف خدمة النقل" description={`سيتم إيقاف خدمة النقل للطالب ${selected?.name} بسبب عدم سداد الرسوم. سيختفي الطالب من قوائم الرحلات وسيظهر إشعار الإيقاف لولي الأمر.`} confirmLabel="تأكيد الإيقاف" danger requireText placeholder="أدخل سبب الإيقاف..." />
    </div>
  );
}

export function Invoices() {
  return (
    <div>
      <PageHeader title="الفواتير" description="إدارة فواتير نقل الطلاب" breadcrumb={[{ label: 'المالية' }, { label: 'الفواتير' }]} actions={<button className="btn-primary"><Receipt size={16} />إنشاء فاتورة</button>} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={invoices}
          searchKey={(i) => i.studentName}
          pageSize={10}
          columns={[
            { key: 'student', label: 'الطالب', sortable: true, render: (i) => <span className="font-medium">{i.studentName}</span> },
            { key: 'amount', label: 'المبلغ', sortable: true, render: (i) => <span className="num">{i.amount.toLocaleString()} ر.س</span> },
            { key: 'paid', label: 'المدفوع', render: (i) => <span className="num text-success">{i.paidAmount.toLocaleString()} ر.س</span> },
            { key: 'due', label: 'تاريخ الاستحقاق', sortable: true, render: (i) => <span className="num text-ink-700">{i.dueDate}</span> },
            { key: 'installment', label: 'القسط', render: (i) => <span className="num text-ink-500">{i.installmentNo}/{i.totalInstallments}</span> },
            { key: 'status', label: 'الحالة', render: (i) => <Badge variant={statusBadge(i.status).variant} dot>{statusBadge(i.status).label}</Badge> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function Installments() {
  return (
    <div>
      <PageHeader title="خطط الأقساط" description="إدارة خطط تقسيط رسوم النقل" breadcrumb={[{ label: 'المالية' }, { label: 'خطط الأقساط' }]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.slice(0, 9).map(s => {
          const inv = invoices.find(i => i.studentId === s.id);
          if (!inv) return null;
          const pct = (inv.paidAmount / inv.amount) * 100;
          return (
            <Card key={s.id} className="p-5" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{s.name}</p><p className="text-xs text-ink-500">{s.grade}</p></div>
                <Badge variant={statusBadge(inv.status).variant} dot>{statusBadge(inv.status).label}</Badge>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between"><span className="text-ink-500">المدفوع</span><span className="num font-semibold text-success">{inv.paidAmount.toLocaleString()} ر.س</span></div>
                <div className="flex justify-between"><span className="text-ink-500">المتبقي</span><span className="num font-semibold text-warning">{(inv.amount - inv.paidAmount).toLocaleString()} ر.س</span></div>
              </div>
              <ProgressBar value={pct} color={pct === 100 ? '#16845B' : pct > 50 ? '#4285B8' : '#D99A32'} className="mb-2" />
              <p className="text-xs text-ink-500 num">قسط {inv.installmentNo} من {inv.totalInstallments}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function PaymentStatus() {
  return (
    <div>
      <PageHeader title="حالة السداد" description="متابعة حالة سداد رسوم النقل" breadcrumb={[{ label: 'المالية' }, { label: 'حالة السداد' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="مدفوع بالكامل" value={invoices.filter(i => i.status === 'paid').length} icon={<Check size={20} />} accent="emerald" />
        <StatCard label="سداد جزئي" value={invoices.filter(i => i.status === 'partial').length} icon={<CreditCard size={20} />} accent="info" />
        <StatCard label="قيد الانتظار" value={invoices.filter(i => i.status === 'pending').length} icon={<Clock size={20} />} accent="warning" />
        <StatCard label="متأخر" value={invoices.filter(i => i.status === 'overdue').length} icon={<AlertTriangle size={20} />} accent="danger" />
      </div>
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={invoices}
          searchKey={(i) => i.studentName}
          columns={[
            { key: 'student', label: 'الطالب', sortable: true, render: (i) => <span className="font-medium">{i.studentName}</span> },
            { key: 'paid', label: 'المدفوع', render: (i) => <span className="num text-success">{i.paidAmount.toLocaleString()} ر.س</span> },
            { key: 'remaining', label: 'المتبقي', sortable: true, sortValue: (i) => i.amount - i.paidAmount, render: (i) => <span className="num">{(i.amount - i.paidAmount).toLocaleString()} ر.س</span> },
            { key: 'due', label: 'تاريخ الاستحقاق', sortable: true, render: (i) => <span className="num">{i.dueDate}</span> },
            { key: 'status', label: 'الحالة', render: (i) => <Badge variant={statusBadge(i.status).variant} dot>{statusBadge(i.status).label}</Badge> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function SuspendedStudents() {
  const suspended = students.filter(s => s.serviceStatus === 'suspended');
  return (
    <div>
      <PageHeader title="الطلاب الموقوفون" description="الطلاب الموقوفة خدمتهم مالياً" breadcrumb={[{ label: 'المالية' }, { label: 'الطلاب الموقوفون' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="موقوفون" value={suspended.length} icon={<PauseCircle size={20} />} accent="danger" />
        <StatCard label="متأخراتهم" value={`${suspended.length * 1800} ر.س`} icon={<Wallet size={20} />} accent="warning" />
      </div>
      {suspended.length > 0 ? (
        <div className="space-y-3">
          {suspended.map(s => {
            const bus = getBusById(s.busId);
            return (
              <Card key={s.id} className="p-4 border-danger/20">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-ink-500">{s.grade} • {bus?.code}</p>
                  </div>
                  <div className="text-left">
                    <Badge variant="danger" dot>موقوف</Badge>
                    <p className="text-xs text-ink-500 mt-1">متأخر: <span className="num font-bold text-danger">1,800 ر.س</span></p>
                  </div>
                  <button className="btn-outline text-xs py-2">رفع الإيقاف</button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : <Card className="p-5"><EmptyState icon={<Check size={28} />} title="لا يوجد طلاب موقوفون" description="جميع الطلاب في حالة نشطة" /></Card>}
    </div>
  );
}

export function FinancialReports() {
  return (
    <div>
      <PageHeader title="التقارير المالية" description="تقارير شاملة عن الأداء المالي" breadcrumb={[{ label: 'المالية' }, { label: 'التقارير' }]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'تقرير الإيرادات', desc: 'تقرير شامل بالإيرادات', icon: TrendingUp, color: '#16845B' },
          { title: 'تقرير المتأخرات', desc: 'المدفوعات المتأخرة', icon: AlertTriangle, color: '#D64B4B' },
          { title: 'تقرير الفواتير', desc: 'تفاصيل جميع الفواتير', icon: Receipt, color: '#4285B8' },
          { title: 'تقرير الإيقافات', desc: 'الطلاب الموقوفون', icon: PauseCircle, color: '#D99A32' },
          { title: 'تقرير التحصيل', desc: 'معدلات تحصيل الرسوم', icon: BarChart3, color: '#C9A45C' },
          { title: 'تقرير سنوي', desc: 'ملخص السنة المالية', icon: FileText, color: '#16845B' },
        ].map((r, i) => (
          <Card key={i} className="p-5" hover>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: r.color + '20', color: r.color }}><r.icon size={20} /></div>
            <p className="font-semibold mb-1">{r.title}</p><p className="text-xs text-ink-500 mb-3">{r.desc}</p>
            <button className="text-sm text-emerald flex items-center gap-1 hover:gap-2 transition-all"><Download size={14} />تحميل التقرير <ChevronLeft size={14} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SettlementRecords() {
  return (
    <div>
      <PageHeader title="سجلات التسوية المالية" description="سجل التسويات المالية لرسوم النقل" breadcrumb={[{ label: 'المالية' }, { label: 'سجلات التسوية' }]} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={invoices.filter(i => i.paidAmount > 0).map((i, idx) => ({ ...i, id: i.id, settlementDate: `2026-10-${(idx % 28) + 1}`, method: ['تحويل بنكي', 'بطاقة ائتمان', 'نقداً'][idx % 3] }))}
          searchKey={(i) => i.studentName}
          columns={[
            { key: 'student', label: 'الطالب', sortable: true, render: (i) => <span className="font-medium">{i.studentName}</span> },
            { key: 'amount', label: 'المبلغ', sortable: true, render: (i) => <span className="num">{i.paidAmount.toLocaleString()} ر.س</span> },
            { key: 'date', label: 'تاريخ التسوية', sortable: true, render: (i) => <span className="num text-ink-700">{i.settlementDate}</span> },
            { key: 'method', label: 'طريقة الدفع', render: (i) => <Badge variant="neutral">{i.method}</Badge> },
            { key: 'status', label: 'الحالة', render: () => <Badge variant="success" dot>مسدد</Badge> },
          ]}
        />
      </div></Card>
    </div>
  );
}
