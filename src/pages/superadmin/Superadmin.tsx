import { useState } from 'react';
import { Building2, GitBranch, CreditCard, Wallet, BarChart3, Bell, Settings, Users, Bus, TrendingUp, ChevronLeft, Plus, MapPin, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Badge, statusBadge, StatCard } from '@/components/ui';
import { DataTable } from '@/components/ui/table';
import { BarChart, DonutChart, ProgressBar, Sparkline } from '@/components/ui/charts';
import { Drawer } from '@/components/ui/overlays';
import { AddFormModal } from '@/components/ui/FormModal';
import { useToast } from '@/components/ui/toast';
import { schools, branches, subscriptionPlans, platformStats, buses, students } from '@/data/mockData';
import type { School } from '@/types';
import { cn } from '@/lib/utils';

export function SuperadminDashboard() {
  return (
    <div>
      <PageHeader title="نظرة عامة على المنصة" description="إحصائيات شاملة لمنصة مسار — نوفمبر 2026" breadcrumb={[{ label: 'المنصة' }, { label: 'نظرة عامة' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="المدارس المشتركة" value={platformStats.totalSchools} icon={<Building2 size={20} />} accent="emerald" trend="up" trendValue="12.5%" />
        <StatCard label="إجمالي الحافلات" value={platformStats.totalBuses} icon={<Bus size={20} />} accent="info" />
        <StatCard label="إجمالي الطلاب" value={platformStats.totalStudents} icon={<Users size={20} />} accent="gold" />
        <StatCard label="الرحلات النشطة" value={platformStats.activeTrips} icon={<TrendingUp size={20} />} accent="warning" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">الإيرادات الشهرية</h3>
            <Badge variant="success" dot><span className="num">{platformStats.monthlyGrowth}%</span> نمو</Badge>
          </div>
          <BarChart data={platformStats.revenueData} height={200} color="#16845B" formatValue={(v) => `${v.toLocaleString()} ر.س`} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">توزيع الباقات</h3>
          <DonutChart segments={[
            { label: 'باقة المؤسسات', value: 2, color: '#C9A45C' },
            { label: 'الباقة الاحترافية', value: 2, color: '#4285B8' },
            { label: 'الباقة الابتدائية', value: 1, color: '#16845B' },
          ]} centerValue="5" centerLabel="مدارس" />
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">أحدث المدارس المنضمة</h3>
          <div className="space-y-3">
            {schools.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.logoColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{s.name}</p><p className="text-xs text-ink-500">{s.city} • <span className="num">{s.busesCount}</span> حافلة</p></div>
                <Badge variant={statusBadge(s.status).variant} dot>{statusBadge(s.status).label}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">نمو المدارس</h3>
          <BarChart data={platformStats.schoolGrowthData} height={160} color="#4285B8" />
          <div className="mt-4 pt-4 border-t border-line grid grid-cols-3 gap-3">
            <div><p className="text-xs text-ink-500">نشطة</p><p className="text-lg font-bold text-success num">{platformStats.activeSchools}</p></div>
            <div><p className="text-xs text-ink-500">تجريبية</p><p className="text-lg font-bold text-info num">{platformStats.trialSchools}</p></div>
            <div><p className="text-xs text-ink-500">الإيراد</p><p className="text-lg font-bold num">{platformStats.totalRevenue.toLocaleString()}</p></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SchoolsManagement() {
  const [selected, setSelected] = useState<School | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="إدارة المدارس" description="إدارة جميع المدارس المشتركة في المنصة" breadcrumb={[{ label: 'المنصة' }, { label: 'إدارة المدارس' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة مدرسة</button>} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={schools}
          searchKey={(s) => s.name + s.city}
          searchPlaceholder="بحث باسم المدرسة أو المدينة..."
          columns={[
            { key: 'name', label: 'المدرسة', sortable: true, render: (s) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.logoColor }}>{s.name.charAt(0)}</div>
                <div><p className="font-medium">{s.name}</p><p className="text-xs text-ink-500">{s.nameEn}</p></div>
              </div>
            ) },
            { key: 'city', label: 'المدينة', sortable: true },
            { key: 'branches', label: 'الفروع', sortable: true, render: (s) => <span className="num">{s.branchesCount}</span> },
            { key: 'buses', label: 'الحافلات', sortable: true, render: (s) => <span className="num">{s.busesCount}</span> },
            { key: 'students', label: 'الطلاب', sortable: true, render: (s) => <span className="num">{s.studentsCount}</span> },
            { key: 'plan', label: 'الباقة', render: (s) => <Badge variant={s.plan === 'enterprise' ? 'gold' : s.plan === 'professional' ? 'info' : 'emerald'}>{s.plan === 'enterprise' ? 'المؤسسات' : s.plan === 'professional' ? 'احترافية' : 'ابتدائية'}</Badge> },
            { key: 'status', label: 'الحالة', render: (s) => <Badge variant={statusBadge(s.status).variant} dot>{statusBadge(s.status).label}</Badge> },
          ]}
          onRowClick={(s) => setSelected(s)}
        />
      </div></Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} description={selected?.nameEn} width="lg">
        {selected && <SchoolDetails school={selected} />}
      </Drawer>
      <AddFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="إضافة مدرسة جديدة"
        description="سجّل مدرسة جديدة في المنصة"
        fields={[
          { key: 'name', label: 'اسم المدرسة', placeholder: 'مدارس المستقبل الأهلية', required: true },
          { key: 'nameEn', label: 'الاسم الإنجليزي', placeholder: 'Al-Mustaqbal Schools' },
          { key: 'city', label: 'المدينة', type: 'select', required: true, options: [
            { value: 'الرياض', label: 'الرياض' }, { value: 'جدة', label: 'جدة' }, { value: 'الدمام', label: 'الدمام' }, { value: 'مكة المكرمة', label: 'مكة المكرمة' }, { value: 'المدينة المنورة', label: 'المدينة المنورة' },
          ] },
          { key: 'plan', label: 'الباقة', type: 'select', required: true, options: [
            { value: 'starter', label: 'الباقة الابتدائية' }, { value: 'professional', label: 'الباقة الاحترافية' }, { value: 'enterprise', label: 'باقة المؤسسات' },
          ] },
          { key: 'branches', label: 'عدد الفروع', type: 'number', placeholder: '1', required: true },
          { key: 'fee', label: 'الرسوم الشهرية (ر.س)', type: 'number', placeholder: '1200', required: true },
        ]}
        onSubmit={() => push('success', 'تم تسجيل المدرسة بنجاح')}
      />
    </div>
  );
}

function SchoolDetails({ school }: { school: School }) {
  const schoolBranches = branches.filter(b => b.schoolId === school.id);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: school.logoColor }}>{school.name.charAt(0)}</div>
        <div>
          <h3 className="font-bold text-lg">{school.name}</h3>
          <p className="text-sm text-ink-500">{school.nameEn}</p>
          <Badge variant={statusBadge(school.status).variant} dot>{statusBadge(school.status).label}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">المدينة</p><p className="font-semibold">{school.city}</p></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الباقة</p><Badge variant="gold">{school.plan === 'enterprise' ? 'المؤسسات' : school.plan === 'professional' ? 'احترافية' : 'ابتدائية'}</Badge></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الفروع</p><p className="font-semibold num">{school.branchesCount}</p></div>
        <div className="p-3 rounded-xl bg-surface-subtle"><p className="text-xs text-ink-500">الرسوم الشهرية</p><p className="font-semibold num">{school.monthlyFee.toLocaleString()} ر.س</p></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-emerald-soft"><p className="text-xs text-ink-500">الحافلات</p><p className="text-xl font-bold text-emerald num">{school.busesCount}</p></div>
        <div className="p-4 rounded-xl bg-info/10"><p className="text-xs text-ink-500">الطلاب</p><p className="text-xl font-bold text-info num">{school.studentsCount}</p></div>
        <div className="p-4 rounded-xl bg-gold-soft"><p className="text-xs text-ink-500">تاريخ الانضمام</p><p className="text-sm font-bold text-gold">{school.joinedDate}</p></div>
      </div>
      <div>
        <p className="text-xs font-semibold text-ink-500 mb-2">الفروع</p>
        <div className="space-y-2">
          {schoolBranches.length > 0 ? schoolBranches.map(b => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-line">
              <GitBranch size={18} className="text-ink-300" />
              <div className="flex-1"><p className="font-medium text-sm">{b.name}</p><p className="text-xs text-ink-500">{b.address}</p></div>
              <span className="text-xs text-ink-500 num">{b.studentsCount} طالب</span>
            </div>
          )) : <p className="text-sm text-ink-500">لا توجد فروع مسجلة</p>}
        </div>
      </div>
    </div>
  );
}

export function BranchManagement() {
  return (
    <div>
      <PageHeader title="إدارة الفروع" description="إدارة فروع المدارس المشتركة" breadcrumb={[{ label: 'المنصة' }, { label: 'إدارة الفروع' }]} />
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={branches}
          searchKey={(b) => b.name + b.city}
          columns={[
            { key: 'name', label: 'الفرع', sortable: true, render: (b) => {
              const school = schools.find(s => s.id === b.schoolId);
              return <div><p className="font-medium">{b.name}</p><p className="text-xs text-ink-500">{school?.name}</p></div>;
            } },
            { key: 'city', label: 'المدينة', sortable: true },
            { key: 'address', label: 'العنوان', render: (b) => <span className="text-ink-700 text-xs">{b.address}</span> },
            { key: 'students', label: 'الطلاب', sortable: true, render: (b) => <span className="num">{b.studentsCount}</span> },
            { key: 'buses', label: 'الحافلات', sortable: true, render: (b) => <span className="num">{b.busesCount}</span> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function SubscriptionPlans() {
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  return (
    <div>
      <PageHeader title="باقات الاشتراك" description="إدارة باقات اشتراك المدارس في المنصة" breadcrumb={[{ label: 'المنصة' }, { label: 'باقات الاشتراك' }]} actions={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} />إضافة باقة</button>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionPlans.map(plan => (
          <Card key={plan.id} className="p-6 relative overflow-hidden" hover>
            {plan.nameEn === 'Enterprise' && <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />}
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: plan.color + '20', color: plan.color }}>
              <CreditCard size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <p className="text-xs text-ink-500 mb-4">{plan.nameEn}</p>
            <div className="mb-4">
              <span className="text-3xl font-bold num">{plan.priceMonthly.toLocaleString()}</span>
              <span className="text-sm text-ink-500"> ر.س / شهرياً</span>
            </div>
            <div className="space-y-2 mb-4">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-emerald" /><span className="text-ink-700">{f}</span></div>
              ))}
            </div>
            <div className="pt-4 border-t border-line">
              <div className="flex justify-between text-xs text-ink-500 mb-1"><span>الحد الأقصى للحافلات</span><span className="num font-medium">{plan.maxBuses}</span></div>
              <div className="flex justify-between text-xs text-ink-500"><span>الحد الأقصى للطلاب</span><span className="num font-medium">{plan.maxStudents}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PlatformSubscriptions() {
  return (
    <div>
      <PageHeader title="اشتراكات المنصة" description="إدارة اشتراكات المدارس والمدفوعات" breadcrumb={[{ label: 'المنصة' }, { label: 'اشتراكات المنصة' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="إجمالي الإيرادات" value={`${platformStats.totalRevenue.toLocaleString()} ر.س`} icon={<Wallet size={20} />} accent="emerald" />
        <StatCard label="الرصيد المستحق" value={`${platformStats.outstandingBalance.toLocaleString()} ر.س`} icon={<Wallet size={20} />} accent="danger" />
        <StatCard label="اشتراكات نشطة" value={platformStats.activeSchools} icon={<CreditCard size={20} />} accent="info" />
        <StatCard label="اشتراكات تجريبية" value={platformStats.trialSchools} icon={<CreditCard size={20} />} accent="gold" />
      </div>
      <Card className="p-0 overflow-hidden"><div className="p-5">
        <DataTable
          data={schools}
          searchKey={(s) => s.name}
          columns={[
            { key: 'name', label: 'المدرسة', sortable: true, render: (s) => (
              <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.logoColor }}>{s.name.charAt(0)}</div><span className="font-medium">{s.name}</span></div>
            ) },
            { key: 'plan', label: 'الباقة', render: (s) => <Badge variant={s.plan === 'enterprise' ? 'gold' : s.plan === 'professional' ? 'info' : 'emerald'}>{s.plan === 'enterprise' ? 'المؤسسات' : s.plan === 'professional' ? 'احترافية' : 'ابتدائية'}</Badge> },
            { key: 'fee', label: 'الرسوم الشهرية', sortable: true, render: (s) => <span className="num font-medium">{s.monthlyFee.toLocaleString()} ر.س</span> },
            { key: 'status', label: 'الحالة', render: (s) => <Badge variant={statusBadge(s.status).variant} dot>{statusBadge(s.status).label}</Badge> },
            { key: 'joined', label: 'تاريخ الاشتراك', render: (s) => <span className="num text-ink-700">{s.joinedDate}</span> },
          ]}
        />
      </div></Card>
    </div>
  );
}

export function UsageStats() {
  return (
    <div>
      <PageHeader title="إحصائيات الاستخدام" description="تحليلات استخدام المنصة" breadcrumb={[{ label: 'المنصة' }, { label: 'إحصائيات الاستخدام' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="جلسات نشطة" value="1,247" icon={<Users size={20} />} accent="emerald" trend="up" trendValue="8%" />
        <StatCard label="عمليات GPS/دقيقة" value="3,840" icon={<TrendingUp size={20} />} accent="info" />
        <StatCard label="إشعارات مرسلة" value="12,580" icon={<Bell size={20} />} accent="gold" />
        <StatCard label="مساحة التخزين" value="68%" icon={<BarChart3 size={20} />} accent="warning" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">استخدام النظام</h3>
          <BarChart data={[
            { month: 'يونيو', value: 8400 }, { month: 'يوليو', value: 9200 }, { month: 'أغسطس', value: 11800 },
            { month: 'سبتمبر', value: 14200 }, { month: 'أكتوبر', value: 15600 }, { month: 'نوفمبر', value: 16100 },
          ]} height={180} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">توزيع الاستخدام حسب الدور</h3>
          <DonutChart segments={[
            { label: 'أولياء الأمور', value: 580, color: '#16845B' },
            { label: 'السائقون', value: 120, color: '#4285B8' },
            { label: 'إدارات المدارس', value: 85, color: '#C9A45C' },
            { label: 'المشرفون', value: 65, color: '#D99A32' },
          ]} centerValue="850" centerLabel="مستخدم نشط" />
        </Card>
      </div>
    </div>
  );
}

export function GlobalAnalytics() {
  return (
    <div>
      <PageHeader title="تحليلات النقل العالمية" description="إحصائيات النقل عبر جميع المدارس" breadcrumb={[{ label: 'المنصة' }, { label: 'التحليلات' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="إجمالي الرحلات" value="8,420" icon={<TrendingUp size={20} />} accent="emerald" />
        <StatCard label="إجمالي الطلاب المنقولون" value={platformStats.totalStudents} icon={<Users size={20} />} accent="info" />
        <StatCard label="إجمالي الحافلات" value={platformStats.totalBuses} icon={<Bus size={20} />} accent="gold" />
        <StatCard label="نسبة الالتزام" value="93.8%" icon={<BarChart3 size={20} />} accent="warning" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">الرحلات عبر المدارس</h3>
          <div className="space-y-3">
            {schools.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.logoColor }}>{s.name.charAt(0)}</div>
                <span className="text-sm flex-1 truncate">{s.name}</span>
                <div className="w-32"><ProgressBar value={s.busesCount * 20} color={s.logoColor} /></div>
                <span className="text-xs text-ink-500 num w-10 text-left">{s.busesCount * 20}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">توزيع المدارس حسب المدينة</h3>
          <DonutChart segments={[
            { label: 'الرياض', value: 3, color: '#16845B' },
            { label: 'جدة', value: 1, color: '#4285B8' },
            { label: 'الدمام', value: 1, color: '#C9A45C' },
            { label: 'مكة المكرمة', value: 1, color: '#D99A32' },
          ]} centerValue="5" centerLabel="مدارس" />
        </Card>
      </div>
    </div>
  );
}

export function SystemNotifications() {
  const { notifications } = useApp();
  return (
    <div>
      <PageHeader title="إشعارات النظام" description="سجل إشعارات النظام والتنبيهات" breadcrumb={[{ label: 'المنصة' }, { label: 'إشعارات النظام' }]} />
      <Card className="p-5">
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={cn("flex items-start gap-3 p-4 rounded-xl border", n.read ? "border-line" : "border-emerald/20 bg-emerald-soft/30")}>
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", n.read ? "bg-surface-subtle text-ink-500" : "bg-emerald-soft text-emerald")}><Bell size={18} /></div>
              <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{n.title}</p><p className="text-xs text-ink-500 mt-0.5">{n.description}</p><p className="text-[10px] text-ink-300 mt-1">{n.timestamp}</p></div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-emerald shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PlatformSettings() {
  return (
    <div>
      <PageHeader title="إعدادات المنصة" description="إعدادات النظام العامة" breadcrumb={[{ label: 'المنصة' }, { label: 'الإعدادات' }]} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">إعدادات عامة</h3>
          <div className="space-y-4">
            <SettingRow label="اسم المنصة" value="مسار — MASAR Transport" />
            <SettingRow label="العملة" value="ريال سعودي (ر.س)" />
            <SettingRow label="اللغة الافتراضية" value="العربية" />
            <SettingRow label="المنطقة الزمنية" value="الرياض (GMT+3)" />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">إعدادات الخدمة</h3>
          <div className="space-y-4">
            <SettingRow label="تكامل SMS" value="مفعّل" toggle />
            <SettingRow label="الإشعارات الفورية" value="مفعّلة" toggle />
            <SettingRow label="تكامل خرائط Google" value="مفعّل" toggle />
            <SettingRow label="النسخ الاحتياطي اليومي" value="مفعّل" toggle />
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
      {toggle ? <div className="h-6 w-11 rounded-full bg-emerald p-0.5 cursor-pointer"><div className="h-5 w-5 rounded-full bg-white mr-auto" /></div> : <span className="text-sm font-semibold text-ink-900">{value}</span>}
    </div>
  );
}
