import { useState } from 'react';
import { Bus, CalendarDays, Users, UserCheck, ListChecks, Home, ClipboardList, MapPin, Clock, ChevronLeft, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Card, Badge, statusBadge, StatCard, EmptyState } from '@/components/ui';
import { ProgressBar } from '@/components/ui/charts';
import { useToast } from '@/components/ui/toast';
import { buses, drivers, supervisors, students, trips, getBusById, getDriverById, getSupervisorById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Student } from '@/types';

export function FleetMonitor() {
  return (
    <div>
      <PageHeader title="مراقبة الأسطول" description="حالة جميع حافلات المدرسة" breadcrumb={[{ label: 'العمليات' }, { label: 'مراقبة الأسطول' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="إجمالي الحافلات" value={buses.length} icon={<Bus size={20} />} />
        <StatCard label="نشطة" value={buses.filter(b => b.status === 'active').length} icon={<Bus size={20} />} accent="emerald" />
        <StatCard label="في صيانة" value={buses.filter(b => b.status === 'maintenance').length} icon={<Bus size={20} />} accent="warning" />
        <StatCard label="متوقفة" value={buses.filter(b => b.status === 'idle').length} icon={<Bus size={20} />} accent="info" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => {
          const driver = getDriverById(bus.driverId);
          const sup = getSupervisorById(bus.supervisorId);
          const sb = statusBadge(bus.status);
          const busStudents = students.filter(s => s.busId === bus.id);
          return (
            <Card key={bus.id} className="p-5" hover>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus.color }}>
                    <Bus size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{bus.code}</p>
                    <p className="text-xs text-ink-500">{bus.model}</p>
                  </div>
                </div>
                <Badge variant={sb.variant} dot>{sb.label}</Badge>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between"><span className="text-ink-500">اللوحة</span><span className="font-medium num">{bus.plateNumber}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">السعة</span><span className="font-medium num">{bus.capacity} راكب</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">السائق</span><span className="font-medium">{driver?.name || 'غير معين'}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">المشرفة</span><span className="font-medium">{sup?.name || 'غير معينة'}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">الطلاب</span><span className="font-medium num">{busStudents.length}/{bus.capacity}</span></div>
              </div>
              <ProgressBar value={busStudents.length} max={bus.capacity} color={bus.color} />
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-ink-500">العداد: <span className="num">{bus.odometer.toLocaleString()}</span> كم</span>
                <span className="text-ink-500">سنة <span className="num">{bus.year}</span></span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function DailySchedule() {
  const morningTrips = trips.filter(t => t.direction === 'going');
  const afternoonTrips = trips.filter(t => t.direction === 'return');

  const TripCard = ({ trip }: { trip: typeof trips[0] }) => {
    const bus = getBusById(trip.busId);
    const driver = getDriverById(trip.driverId);
    const sb = statusBadge(trip.status);
    return (
      <Card className="p-4" hover>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}>
              <Bus size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">{bus?.code}</p>
              <p className="text-xs text-ink-500">{driver?.name}</p>
            </div>
          </div>
          <Badge variant={sb.variant} dot>{sb.label}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-500 mb-3">
          <Clock size={14} />
          <span className="num">{trip.startTime}</span>
          {trip.endTime && <><span>→</span><span className="num">{trip.endTime}</span></>}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-500">الطلاب: <span className="num font-medium text-ink-900">{trip.studentsCount}</span></span>
          <ProgressBar value={trip.progress} className="w-24" />
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader title="جدول الرحلات اليومي" description="جدول الرحلات الصباحية والمسائية ليوم 8 نوفمبر 2026" breadcrumb={[{ label: 'العمليات' }, { label: 'الجدول اليومي' }]} />
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-info" />الرحلات الصباحية (ذهاب)</h3>
          <div className="space-y-3">{morningTrips.map(t => <TripCard key={t.id} trip={t} />)}</div>
        </div>
        <div>
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" />الرحلات المسائية (إياب)</h3>
          <div className="space-y-3">{afternoonTrips.map(t => <TripCard key={t.id} trip={t} />)}</div>
        </div>
      </div>
    </div>
  );
}

export function StudentPickupList() {
  const [direction, setDirection] = useState<'going' | 'return'>('going');
  const [boarded, setBoarded] = useState<Set<string>>(new Set(['st1', 'st2', 'st3']));

  const eligibleStudents = students.filter(s => {
    if (s.serviceStatus === 'suspended') return false;
    if (direction === 'going') return s.subscriptionType === 'one_way' || s.subscriptionType === 'round_trip';
    return s.subscriptionType === 'return_only' || s.subscriptionType === 'round_trip';
  }).slice(0, 12);

  const toggleBoarded = (id: string) => {
    setBoarded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader title="قوائم استلام الطلاب" description="قائمة الطلاب المؤهلين للرحلة حسب الاتجاه والاشتراك" breadcrumb={[{ label: 'العمليات' }, { label: 'قوائم الاستلام' }]} />
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-500">اتجاه الرحلة:</span>
          <div className="flex bg-surface-subtle rounded-lg p-1">
            <button onClick={() => setDirection('going')} className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors', direction === 'going' ? 'bg-white text-emerald shadow-sm' : 'text-ink-500')}>ذهاب</button>
            <button onClick={() => setDirection('return')} className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors', direction === 'return' ? 'bg-white text-emerald shadow-sm' : 'text-ink-500')}>إياب</button>
          </div>
          <div className="flex-1" />
          <Badge variant="info">إجمالي: <span className="num">{eligibleStudents.length}</span></Badge>
          <Badge variant="success">صعد: <span className="num">{boarded.size}</span></Badge>
        </div>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {eligibleStudents.map(s => {
          const bus = getBusById(s.busId);
          const isBoarded = boarded.has(s.id);
          return (
            <Card key={s.id} className={cn('p-4 transition-all', isBoarded ? 'border-success/30 bg-success/5' : '')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: s.avatarColor }}>
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{s.name}</p>
                  <p className="text-xs text-ink-500">{s.grade} {s.section}</p>
                </div>
                {isBoarded && <Badge variant="success" dot>صعد</Badge>}
              </div>
              <div className="text-xs text-ink-500 mb-3 space-y-1">
                <p className="flex items-center gap-1.5"><Home size={12} /> {s.homeAddress}</p>
                <p className="flex items-center gap-1.5"><Bus size={12} /> {bus?.code}</p>
              </div>
              <button
                onClick={() => toggleBoarded(s.id)}
                className={cn('w-full text-xs py-2 rounded-lg font-medium transition-colors', isBoarded ? 'bg-success/10 text-success hover:bg-success/20' : 'btn-primary')}
              >
                {isBoarded ? '✓ تم الصعود' : 'تسجيل صعود'}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function AbsenceMonitor() {
  const absentStudents = students.slice(8, 11);
  return (
    <div>
      <PageHeader title="مراقبة الغياب" description="الطلاب الغائبون عن النقل اليوم" breadcrumb={[{ label: 'العمليات' }, { label: 'مراقبة الغياب' }]} />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="غائبون اليوم" value={3} icon={<ClipboardList size={20} />} accent="warning" />
        <StatCard label="بلاغات أولياء الأمور" value={2} icon={<ClipboardList size={20} />} accent="info" />
        <StatCard label="نسبة الحضور" value="94%" icon={<UserCheck size={20} />} accent="emerald" />
      </div>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">قائمة الطلاب الغائبين</h3>
        <div className="space-y-3">
          {absentStudents.map((s, i) => {
            const bus = getBusById(s.busId);
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/15">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-ink-500">{s.grade} • {bus?.code}</p>
                </div>
                <Badge variant="warning">غائب</Badge>
                <span className="text-xs text-ink-300">{i === 0 ? 'بلاغ ولي الأمر' : 'لم يصعد'}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function DriverAssignments() {
  return (
    <div>
      <PageHeader title="تعيينات السائقين" description="توزيع السائقين على الحافلات والرحلات" breadcrumb={[{ label: 'العمليات' }, { label: 'تعيينات السائقين' }]} />
      <div className="grid sm:grid-cols-2 gap-4">
        {drivers.map(d => {
          const bus = getBusById(d.busId);
          const sb = statusBadge(d.status);
          return (
            <Card key={d.id} className="p-5" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: d.avatarColor }}>{d.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-ink-500 num">{d.phone}</p>
                </div>
                <Badge variant={sb.variant} dot>{sb.label}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-500">الحافلة المعينة</span><span className="font-medium">{bus?.code || 'غير معين'}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">رقم الرخصة</span><span className="font-medium num">{d.licenseNumber}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">تقييم</span><span className="font-medium num">{d.rating} ★</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">رحلات منجزة</span><span className="font-medium num">{d.tripsCount}</span></div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function SupervisorAssignments() {
  return (
    <div>
      <PageHeader title="تعيينات المشرفين" description="توزيع المشرفين على الحافلات" breadcrumb={[{ label: 'العمليات' }, { label: 'تعيينات المشرفين' }]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supervisors.map(s => {
          const bus = getBusById(s.busId);
          const sb = statusBadge(s.status);
          return (
            <Card key={s.id} className="p-5" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-ink-500 num">{s.phone}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-500">المرحلة</span><span className="font-medium">{s.grade}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">الحافلة</span><span className="font-medium">{bus?.code || 'غير معينة'}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">الحالة</span><Badge variant={sb.variant} dot>{sb.label}</Badge></div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function GpsHistory() {
  return (
    <div>
      <PageHeader title="سجل مسارات GPS" description="سجل حركة الحافلات خلال الـ 48 ساعة الماضية" breadcrumb={[{ label: 'العمليات' }, { label: 'سجل GPS' }]} />
      <Card className="p-4 mb-4 bg-info/5 border-info/20">
        <div className="flex items-center gap-2 text-sm text-info">
          <Clock size={16} />
          <span>يتم الاحتفاظ بسجلات GPS لمدة 48 ساعة فقط. البيانات الأقدم تُحذف تلقائياً.</span>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">رحلات اليوم — سجل المسار</h3>
        <div className="space-y-4">
          {trips.map(trip => {
            const bus = getBusById(trip.busId);
            return (
              <div key={trip.id} className="flex items-start gap-4 pb-4 border-b border-line last:border-0">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: bus?.color }}>
                  <Bus size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{bus?.code} — {trip.direction === 'going' ? 'ذهاب' : 'إياب'}</p>
                    <Badge variant={statusBadge(trip.status).variant} dot>{statusBadge(trip.status).label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> <span className="num">{trip.startTime}</span> → {trip.endTime ? <span className="num">{trip.endTime}</span> : 'جارٍ'}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> آخر تحديث: {trip.lastGpsUpdate}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={trip.progress} color={bus?.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function EmergencyOps() {
  const { push } = useToast();
  const terminatedTrip = trips.find(t => t.status === 'terminated');
  return (
    <div>
      <PageHeader title="العمليات الطارئة" description="إدارة الحالات الطارئة وإنهاء الرحلات قسرياً" breadcrumb={[{ label: 'العمليات' }, { label: 'العمليات الطارئة' }]} />
      <Card className="p-5 mb-4 border-danger/20 bg-danger/5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
            <span className="text-lg">⚠</span>
          </div>
          <div>
            <h3 className="font-semibold text-danger">إجراءات طارئة</h3>
            <p className="text-sm text-ink-700 mt-1">الإنهاء الطارئ يوقف الرحلة فوراً ويوقف بث GPS. يتم إشعار جميع الأطراف وتسجيل الحادث في سجل التدقيق.</p>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">الحالات الطارئة الأخيرة</h3>
        {terminatedTrip ? (
          <div className="p-4 rounded-xl bg-danger/5 border border-danger/15">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm text-danger">إنهاء طارئ — {getBusById(terminatedTrip.busId)?.code}</p>
              <Badge variant="danger" dot>منتهية قسرياً</Badge>
            </div>
            <p className="text-sm text-ink-700 mb-2">{terminatedTrip.terminateReason}</p>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              <span>التاريخ: <span className="num">{terminatedTrip.date}</span></span>
              <span>الوقت: <span className="num">{terminatedTrip.startTime}</span></span>
              <span>السائق: {getDriverById(terminatedTrip.driverId)?.name}</span>
            </div>
          </div>
        ) : (
          <EmptyState icon={<ClipboardList size={28} />} title="لا توجد حالات طارئة" description="لم تسجل أي حالات طارئة اليوم" />
        )}
      </Card>
    </div>
  );
}
