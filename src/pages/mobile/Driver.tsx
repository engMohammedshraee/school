import { useState } from 'react';
import {
  Bus, Navigation, Home, UserCheck, WifiOff, Bell, User, MapPin, Clock,
  Play, Square, AlertTriangle, Check, ChevronLeft, Phone, Star, Calendar,
  RefreshCw, CloudOff, Cloud, Wifi, Car,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Badge, statusBadge, EmptyState } from '@/components/ui';
import { MapView } from '@/components/ui/map';
import { ConnectionIndicator, useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/overlays';
import { ProgressBar } from '@/components/ui/charts';
import { trips, drivers, buses, students, supervisors, getBusById, getSupervisorById } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function DriverDashboard() {
  const { userName, navigate } = useApp();
  const driver = drivers[0];
  const bus = getBusById(driver.busId);
  const sup = getSupervisorById(bus?.supervisorId || '');
  const activeTrip = trips.find(t => t.busId === driver.busId && t.status === 'active');
  const [offline, setOffline] = useState(false);

  return (
    <div className="p-4 space-y-4">
      {/* Offline banner */}
      {offline && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 flex items-center gap-2 animate-slide-up">
          <WifiOff size={18} className="text-warning" />
          <p className="text-sm text-warning font-medium">وضع عدم الاتصال — البيانات ستُزامن عند عودة الاتصال</p>
        </div>
      )}

      {/* Welcome header */}
      <div className="bg-gradient-to-br from-emerald-royal to-emerald rounded-2xl p-5 text-white">
        <p className="text-sm text-white/70">مرحباً</p>
        <h2 className="text-xl font-bold">{userName.split('—')[1]?.trim() || userName}</h2>
        <div className="flex items-center gap-2 mt-3">
          <ConnectionIndicator status={offline ? 'offline' : 'online'} />
          <span className="text-xs text-white/50">•</span>
          <span className="text-xs text-white/70">{driver.rating} ★</span>
        </div>
      </div>

      {/* Assigned bus */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}>
            <Bus size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold">{bus?.code}</p>
            <p className="text-xs text-ink-500">{bus?.model} • <span className="num">{bus?.plateNumber}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2.5 rounded-lg bg-surface-subtle">
            <p className="text-xs text-ink-500">السعة</p>
            <p className="font-semibold num">{bus?.capacity} راكب</p>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-subtle">
            <p className="text-xs text-ink-500">المشرفة</p>
            <p className="font-semibold">{sup?.name}</p>
          </div>
        </div>
      </Card>

      {/* Current trip */}
      {activeTrip ? (
        <Card className="p-4 border-emerald/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">الرحلة الحالية</h3>
            <Badge variant="success" dot>نشطة</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm mb-3">
            <Badge variant={activeTrip.direction === 'going' ? 'info' : 'gold'}>{activeTrip.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge>
            <span className="text-ink-500">بدأت: <span className="num font-medium text-ink-900">{activeTrip.startTime}</span></span>
          </div>
          <ProgressBar value={activeTrip.progress} color={bus?.color} className="mb-2" />
          <div className="flex justify-between text-xs text-ink-500 mb-3">
            <span>الطلاب: <span className="num font-medium text-ink-900">{activeTrip.boardedCount}/{activeTrip.studentsCount}</span></span>
            <span className="num">{activeTrip.progress}%</span>
          </div>
          <button className="w-full btn-danger py-3 text-base" onClick={() => navigate('trip')}>
            <Square size={20} />
            إنهاء الرحلة
          </button>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-soft flex items-center justify-center text-emerald mx-auto mb-3">
              <Navigation size={28} />
            </div>
            <p className="font-semibold mb-1">لا توجد رحلة نشطة</p>
            <p className="text-xs text-ink-500 mb-4">الرحلة القادمة: <span className="num font-medium">06:30</span> صباحاً</p>
            <button className="w-full btn-primary py-3 text-base" onClick={() => navigate('trip')}>
              <Play size={20} />
              بدء الرحلة
            </button>
          </div>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <UserCheck size={20} className="text-info mb-2" />
          <p className="text-2xl font-bold num">{students.filter(s => s.busId === driver.busId).length}</p>
          <p className="text-xs text-ink-500">طالب معين</p>
        </Card>
        <Card className="p-4">
          <Calendar size={20} className="text-gold mb-2" />
          <p className="text-2xl font-bold num">{driver.tripsCount}</p>
          <p className="text-xs text-ink-500">رحلة منجزة</p>
        </Card>
      </div>

      {/* Sync status */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">حالة المزامنة</h3>
          <button onClick={() => setOffline(!offline)} className="text-xs text-emerald flex items-center gap-1">
            <RefreshCw size={12} />
            محاكاة
          </button>
        </div>
        <div className="space-y-2">
          <SyncRow label="سجلات GPS" count={offline ? 12 : 0} synced={!offline} />
          <SyncRow label="سجلات الحضور" count={offline ? 3 : 0} synced={!offline} />
        </div>
        <p className="text-xs text-ink-500 mt-3">آخر مزامنة: <span className="font-medium text-ink-900">قبل 5 دقائق</span></p>
      </Card>
    </div>
  );
}

function SyncRow({ label, count, synced }: { label: string; count: number; synced: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-700">{label}</span>
      {synced ? (
        <Badge variant="success" dot><Check size={12} />متزامن</Badge>
      ) : (
        <Badge variant="warning" dot><span className="num">{count}</span> بانتظار المزامنة</Badge>
      )}
    </div>
  );
}

export function DriverTrip() {
  const { push } = useToast();
  const driver = drivers[0];
  const bus = getBusById(driver.busId);
  const sup = getSupervisorById(bus?.supervisorId || '');
  const trip = trips.find(t => t.busId === driver.busId && t.status === 'active');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [tripActive, setTripActive] = useState(!!trip);

  const busStudents = students.filter(s => s.busId === driver.busId && s.serviceStatus === 'active');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => history.back()} className="text-ink-500"><ChevronLeft size={20} /></button>
        <h1 className="text-lg font-bold">تفاصيل الرحلة</h1>
      </div>

      <Card className="p-4">
        <MapView markers={[
          { id: 'school', lat: 24.7136, lng: 46.6753, type: 'school', label: 'المدرسة' },
          { id: 'bus', lat: 24.7150, lng: 46.6720, type: 'bus', label: bus?.code, color: bus?.color, isMoving: tripActive },
        ]} height={200} showControls={false} showLegend={false} />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Bus size={20} /></div>
            <div><p className="font-bold">{bus?.code}</p><p className="text-xs text-ink-500 num">{bus?.plateNumber}</p></div>
          </div>
          <Badge variant={tripActive ? 'success' : 'warning'} dot>{tripActive ? 'نشطة' : 'لم تبدأ'}</Badge>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-ink-500">الاتجاه</span><Badge variant="info">ذهاب</Badge></div>
          <div className="flex items-center justify-between"><span className="text-ink-500">المشرفة</span><span className="font-medium">{sup?.name}</span></div>
          <div className="flex items-center justify-between"><span className="text-ink-500">عدد الطلاب</span><span className="font-medium num">{busStudents.length}</span></div>
          <div className="flex items-center justify-between"><span className="text-ink-500">وقت البدء</span><span className="font-medium num">06:30</span></div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3"><div className="flex items-center gap-2"><MapPin size={16} className="text-emerald" /><div><p className="text-xs text-ink-500">GPS</p><p className="text-sm font-semibold">نشط</p></div></div></Card>
        <Card className="p-3"><div className="flex items-center gap-2"><Wifi size={16} className="text-success" /><div><p className="text-xs text-ink-500">الاتصال</p><p className="text-sm font-semibold">متصل</p></div></div></Card>
      </div>

      {tripActive ? (
        <button onClick={() => setShowEnd(true)} className="w-full btn-danger py-3.5 text-base">
          <Square size={22} />
          إنهاء الرحلة
        </button>
      ) : (
        <button onClick={() => setShowStart(true)} className="w-full btn-primary py-3.5 text-base">
          <Play size={22} />
          بدء الرحلة
        </button>
      )}

      <ConfirmDialog open={showStart} onClose={() => setShowStart(false)} onConfirm={() => { setTripActive(true); push('success', 'تم بدء الرحلة — GPS نشط'); setShowStart(false); }} title="بدء الرحلة" description="سيتم تفعيل بث GPS وإشعار أولياء الأمور ببدء الرحلة." confirmLabel="تأكيد البدء" />
      <ConfirmDialog open={showEnd} onClose={() => setShowEnd(false)} onConfirm={() => { setTripActive(false); push('success', 'تم إنهاء الرحلة بنجاح'); setShowEnd(false); }} title="إنهاء الرحلة" description="هل أنت متأكد من إنهاء الرحلة؟ سيتم تسجيل وصول جميع الطلاب." confirmLabel="تأكيد الإنهاء" />
    </div>
  );
}

export function DriverPickup() {
  const driver = drivers[0];
  const busStudents = students.filter(s => s.busId === driver.busId && s.serviceStatus === 'active' && (s.subscriptionType === 'one_way' || s.subscriptionType === 'round_trip'));
  const [boarded, setBoarded] = useState<Set<string>>(new Set(['st1', 'st2', 'st3']));
  const { push } = useToast();

  const toggle = (id: string) => {
    setBoarded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else { n.add(id); push('success', 'تم تسجيل صعود الطالب'); } return n; });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2"><h1 className="text-lg font-bold">قائمة الاستلام</h1></div>
      <Card className="p-3 flex items-center justify-between">
        <Badge variant="info">ذهاب</Badge>
        <div className="flex gap-3 text-sm"><span className="text-ink-500">صعد: <span className="num font-bold text-success">{boarded.size}</span></span><span className="text-ink-500">المتبقي: <span className="num font-bold">{busStudents.length - boarded.size}</span></span></div>
      </Card>
      <div className="space-y-2">
        {busStudents.map(s => {
          const isBoarded = boarded.has(s.id);
          return (
            <Card key={s.id} className={cn("p-3", isBoarded && "border-success/30 bg-success/5")}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.grade} • {s.homeAddress}</p></div>
                <button onClick={() => toggle(s.id)} className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all", isBoarded ? "bg-success text-white" : "bg-emerald-soft text-emerald")}>
                  {isBoarded ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function DriverDropoff() {
  const driver = drivers[0];
  const busStudents = students.filter(s => s.busId === driver.busId && s.serviceStatus === 'active' && (s.subscriptionType === 'return_only' || s.subscriptionType === 'round_trip'));
  const [delivered, setDelivered] = useState<Set<string>>(new Set());
  const { push } = useToast();

  const toggle = (id: string) => {
    setDelivered(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else { n.add(id); push('success', 'تم تسجيل توصيل الطالب'); } return n; });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2"><h1 className="text-lg font-bold">قائمة التوصيل</h1></div>
      <Card className="p-3 flex items-center justify-between"><Badge variant="gold">إياب</Badge><div className="flex gap-3 text-sm"><span className="text-ink-500">تم التوصيل: <span className="num font-bold text-success">{delivered.size}</span></span></div></Card>
      <div className="space-y-2">
        {busStudents.map(s => {
          const isDelivered = delivered.has(s.id);
          return (
            <Card key={s.id} className={cn("p-3", isDelivered && "border-success/30 bg-success/5")}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
                <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.homeAddress}</p></div>
                <button onClick={() => toggle(s.id)} className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all", isDelivered ? "bg-success text-white" : "bg-emerald-soft text-emerald")}>{isDelivered ? <Check size={20} /> : <Home size={20} />}</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function DriverAttendance() {
  const driver = drivers[0];
  const busStudents = students.filter(s => s.busId === driver.busId && s.serviceStatus === 'active');
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">حضور الطلاب</h1>
      <div className="space-y-2">
        {busStudents.map(s => (
          <Card key={s.id} className="p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
              <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.grade}</p></div>
              <Badge variant={s.serviceStatus === 'suspended' ? 'danger' : 'success'} dot>{s.serviceStatus === 'suspended' ? 'موقوف' : 'حاضر'}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DriverBus() {
  const driver = drivers[0];
  const bus = getBusById(driver.busId);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">الحافلة المعينة</h1>
      <Card className="p-5 text-center">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-4" style={{ backgroundColor: bus?.color }}><Bus size={40} /></div>
        <h2 className="text-xl font-bold">{bus?.code}</h2>
        <p className="text-sm text-ink-500">{bus?.model}</p>
        <p className="text-sm text-ink-500 num mt-1">{bus?.plateNumber}</p>
      </Card>
      <Card className="p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-ink-500">السعة</span><span className="font-medium num">{bus?.capacity} راكب</span></div>
          <div className="flex justify-between"><span className="text-ink-500">سنة الصنع</span><span className="font-medium num">{bus?.year}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">العداد</span><span className="font-medium num">{bus?.odometer.toLocaleString()} كم</span></div>
          <div className="flex justify-between"><span className="text-ink-500">آخر صيانة</span><span className="font-medium">{bus?.lastService}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">الحالة</span><Badge variant={statusBadge(bus?.status || '').variant} dot>{statusBadge(bus?.status || '').label}</Badge></div>
        </div>
      </Card>
    </div>
  );
}

export function DriverSchedule() {
  const driver = drivers[0];
  const driverTrips = trips.filter(t => t.busId === driver.busId);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">جدول الرحلات</h1>
      <div className="space-y-3">
        {driverTrips.map(t => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Clock size={16} className="text-ink-500" /><span className="font-semibold num">{t.startTime}</span>{t.endTime && <span className="text-ink-500">→ <span className="num">{t.endTime}</span></span>}</div>
              <Badge variant={statusBadge(t.status).variant} dot>{statusBadge(t.status).label}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm"><Badge variant={t.direction === 'going' ? 'info' : 'gold'}>{t.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge><span className="text-ink-500 num">{t.studentsCount} طالب</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DriverSync() {
  const [pendingGps, setPendingGps] = useState(12);
  const [pendingAttendance, setPendingAttendance] = useState(3);
  const [syncing, setSyncing] = useState(false);
  const { push } = useToast();

  const sync = () => {
    setSyncing(true);
    setTimeout(() => { setPendingGps(0); setPendingAttendance(0); setSyncing(false); push('success', 'تمت المزامنة بنجاح'); }, 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">مركز المزامنة</h1>
      <Card className="p-5 text-center">
        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-3", syncing ? "bg-info/10 text-info animate-pulse" : pendingGps > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success")}>
          {syncing ? <RefreshCw size={32} className="animate-spin" /> : pendingGps > 0 ? <CloudOff size={32} /> : <Cloud size={32} />}
        </div>
        <p className="font-bold">{syncing ? 'جارٍ المزامنة...' : pendingGps > 0 ? 'بانتظار المزامنة' : 'متزامن'}</p>
        <p className="text-xs text-ink-500 mt-1">آخر مزامنة: قبل 5 دقائق</p>
      </Card>
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MapPin size={18} className="text-ink-500" /><span className="text-sm">سجلات GPS</span></div><Badge variant={pendingGps > 0 ? 'warning' : 'success'} dot><span className="num">{pendingGps}</span></Badge></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><UserCheck size={18} className="text-ink-500" /><span className="text-sm">سجلات الحضور</span></div><Badge variant={pendingAttendance > 0 ? 'warning' : 'success'} dot><span className="num">{pendingAttendance}</span></Badge></div>
        </div>
      </Card>
      <button onClick={sync} disabled={syncing || (pendingGps === 0 && pendingAttendance === 0)} className="w-full btn-primary py-3.5 text-base">
        <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
        {syncing ? 'جارٍ المزامنة...' : 'مزامنة الآن'}
      </button>
    </div>
  );
}

export function DriverNotifications() {
  const { notifications } = useApp();
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">الإشعارات</h1>
      {notifications.slice(0, 6).map(n => (
        <Card key={n.id} className={cn("p-3", !n.read && "border-emerald/20")}>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald shrink-0"><Bell size={18} /></div>
            <div className="flex-1"><p className="font-semibold text-sm">{n.title}</p><p className="text-xs text-ink-500 mt-0.5">{n.description}</p><p className="text-[10px] text-ink-300 mt-1">{n.timestamp}</p></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DriverProfile() {
  const { userName } = useApp();
  const driver = drivers[0];
  return (
    <div className="p-4 space-y-4">
      <Card className="p-5 text-center">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3" style={{ backgroundColor: driver.avatarColor }}>{driver.name.charAt(0)}</div>
        <h2 className="font-bold text-lg">{driver.name}</h2>
        <p className="text-sm text-ink-500">سائق حافلة {getBusById(driver.busId)?.code}</p>
        <div className="flex items-center justify-center gap-1 mt-2"><Star size={16} className="text-gold fill-gold" /><span className="num font-semibold">{driver.rating}</span></div>
      </Card>
      <Card className="p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-ink-500">الهاتف</span><span className="font-medium num">{driver.phone}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">رقم الرخصة</span><span className="font-medium num">{driver.licenseNumber}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">انتهاء الرخصة</span><span className="font-medium">{driver.licenseExpiry}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">رحلات منجزة</span><span className="font-medium num">{driver.tripsCount}</span></div>
        </div>
      </Card>
    </div>
  );
}

// Supervisor pages
export function SupervisorDashboard() {
  const { userName } = useApp();
  const sup = supervisors[0];
  const bus = getBusById(sup.busId);
  const trip = trips.find(t => t.busId === sup.busId && t.status === 'active');
  const busStudents = students.filter(s => s.busId === sup.busId && s.serviceStatus === 'active');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-emerald-royal to-emerald rounded-2xl p-5 text-white">
        <p className="text-sm text-white/70">مرحباً</p>
        <h2 className="text-xl font-bold">{userName}</h2>
        <p className="text-xs text-white/70 mt-1">{sup.grade}</p>
      </div>
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Bus size={20} /></div><div className="flex-1"><p className="font-bold">{bus?.code}</p><p className="text-xs text-ink-500">الحافلة المعينة</p></div></div>
        {trip ? <Badge variant="success" dot>رحلة نشطة</Badge> : <Badge variant="warning" dot>لا توجد رحلة</Badge>}
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center"><UserCheck size={20} className="text-info mx-auto mb-2" /><p className="text-2xl font-bold num">{busStudents.length}</p><p className="text-xs text-ink-500">طالب</p></Card>
        <Card className="p-4 text-center"><Navigation size={20} className="text-emerald mx-auto mb-2" /><p className="text-2xl font-bold num">{trip?.progress || 0}%</p><p className="text-xs text-ink-500">تقدم الرحلة</p></Card>
      </div>
    </div>
  );
}

export function SupervisorStudents() {
  const sup = supervisors[0];
  const busStudents = students.filter(s => s.busId === sup.busId && s.serviceStatus === 'active');
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">قوائم الطلاب</h1>
      {busStudents.map(s => (
        <Card key={s.id} className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
            <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.grade} {s.section}</p></div>
            <Badge variant={statusBadge(s.subscriptionType).variant}>{statusBadge(s.subscriptionType).label}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SupervisorPickup() {
  const sup = supervisors[0];
  const busStudents = students.filter(s => s.busId === sup.busId && s.serviceStatus === 'active' && (s.subscriptionType === 'one_way' || s.subscriptionType === 'round_trip'));
  const [boarded, setBoarded] = useState<Set<string>>(new Set(['st1', 'st2']));
  const { push } = useToast();
  const toggle = (id: string) => { setBoarded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else { n.add(id); push('success', 'تم تسجيل الصعود'); } return n; }); };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">حضور الاستلام</h1>
      <Card className="p-3 flex items-center justify-between"><Badge variant="info">ذهاب</Badge><span className="text-sm text-ink-500">صعد: <span className="num font-bold text-success">{boarded.size}</span>/{busStudents.length}</span></Card>
      {busStudents.map(s => {
        const isBoarded = boarded.has(s.id);
        return (
          <Card key={s.id} className={cn("p-3", isBoarded && "border-success/30 bg-success/5")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
              <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.homeAddress}</p></div>
              <button onClick={() => toggle(s.id)} className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-all", isBoarded ? "bg-success text-white" : "btn-primary")}>{isBoarded ? '✓ صعد' : 'تسجيل'}</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function SupervisorDropoff() {
  const sup = supervisors[0];
  const busStudents = students.filter(s => s.busId === sup.busId && s.serviceStatus === 'active' && (s.subscriptionType === 'return_only' || s.subscriptionType === 'round_trip'));
  const [delivered, setDelivered] = useState<Set<string>>(new Set());
  const { push } = useToast();
  const toggle = (id: string) => { setDelivered(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else { n.add(id); push('success', 'تم تسجيل التوصيل'); } return n; }); };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">حضور التوصيل</h1>
      <Card className="p-3 flex items-center justify-between"><Badge variant="gold">إياب</Badge><span className="text-sm text-ink-500">تم التوصيل: <span className="num font-bold text-success">{delivered.size}</span>/{busStudents.length}</span></Card>
      {busStudents.map(s => {
        const isDelivered = delivered.has(s.id);
        return (
          <Card key={s.id} className={cn("p-3", isDelivered && "border-success/30 bg-success/5")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div>
              <div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.homeAddress}</p></div>
              <button onClick={() => toggle(s.id)} className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-all", isDelivered ? "bg-success text-white" : "btn-primary")}>{isDelivered ? '✓ وصل' : 'تسجيل'}</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function SupervisorAbsence() {
  const sup = supervisors[0];
  const busStudents = students.filter(s => s.busId === sup.busId);
  const absent = busStudents.slice(8, 11);
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">قائمة الغياب</h1>
      {absent.length > 0 ? absent.map(s => (
        <Card key={s.id} className="p-3 border-warning/20 bg-warning/5">
          <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>{s.name.charAt(0)}</div><div className="flex-1"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-ink-500">{s.grade}</p></div><Badge variant="warning" dot>غائب</Badge></div>
        </Card>
      )) : <EmptyState icon={<UserCheck size={28} />} title="لا يوجد غياب" />}
    </div>
  );
}

export function SupervisorTrip() {
  const sup = supervisors[0];
  const bus = getBusById(sup.busId);
  const trip = trips.find(t => t.busId === sup.busId);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">الرحلة المعينة</h1>
      <Card className="p-4">
        <MapView markers={[{ id: 'school', lat: 24.7136, lng: 46.6753, type: 'school' }, { id: 'bus', lat: 24.7150, lng: 46.6720, type: 'bus', label: bus?.code, color: bus?.color, isMoving: true }]} height={200} showControls={false} showLegend={false} />
      </Card>
      {trip && (
        <Card className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">الاتجاه</span><Badge variant={trip.direction === 'going' ? 'info' : 'gold'}>{trip.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge></div>
            <div className="flex justify-between"><span className="text-ink-500">الحالة</span><Badge variant={statusBadge(trip.status).variant} dot>{statusBadge(trip.status).label}</Badge></div>
            <div className="flex justify-between"><span className="text-ink-500">الطلاب</span><span className="font-medium num">{trip.boardedCount}/{trip.studentsCount}</span></div>
          </div>
          <ProgressBar value={trip.progress} color={bus?.color} className="mt-3" />
        </Card>
      )}
    </div>
  );
}

export function SupervisorProgress() {
  const sup = supervisors[0];
  const trip = trips.find(t => t.busId === sup.busId);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">تقدم الرحلة</h1>
      {trip && (
        <Card className="p-4">
          <div className="space-y-4">
            {['بدء الرحلة', 'استلام الطلاب', 'الوصول للمدرسة', 'تسليم الطلاب'].map((step, i) => {
              const done = trip.progress > (i + 1) * 25;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", done ? "bg-success text-white" : "bg-surface-subtle text-ink-300")}>
                    {done ? <Check size={16} /> : <span className="num text-xs">{i + 1}</span>}
                  </div>
                  <span className={cn("text-sm", done ? "text-ink-900 font-medium" : "text-ink-500")}>{step}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export function MobileProfile() {
  const { role, userName } = useApp();
  const driver = drivers[0];
  const sup = supervisors[0];
  const person = role === 'driver' ? driver : sup;
  return (
    <div className="p-4 space-y-4">
      <Card className="p-5 text-center">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3" style={{ backgroundColor: person.avatarColor }}>{person.name.charAt(0)}</div>
        <h2 className="font-bold text-lg">{userName}</h2>
        <p className="text-sm text-ink-500">{role === 'driver' ? 'سائق' : 'مشرفة'}</p>
      </Card>
      <Card className="p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-ink-500">الهاتف</span><span className="font-medium num">{person.phone}</span></div>
          {role === 'driver' && <div className="flex justify-between"><span className="text-ink-500">رقم الرخصة</span><span className="font-medium num">{driver.licenseNumber}</span></div>}
          {role === 'supervisor' && <div className="flex justify-between"><span className="text-ink-500">المرحلة</span><span className="font-medium">{sup.grade}</span></div>}
        </div>
      </Card>
    </div>
  );
}

export function MobileNotifications() {
  const { notifications, markNotificationRead } = useApp();
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">الإشعارات</h1>
      {notifications.slice(0, 8).map(n => (
        <Card key={n.id} className={cn("p-3", !n.read && "border-emerald/20")} onClick={() => markNotificationRead(n.id)}>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald shrink-0"><Bell size={18} /></div>
            <div className="flex-1"><p className="font-semibold text-sm">{n.title}</p><p className="text-xs text-ink-500 mt-0.5">{n.description}</p><p className="text-[10px] text-ink-300 mt-1">{n.timestamp}</p></div>
            {!n.read && <span className="h-2 w-2 rounded-full bg-emerald shrink-0 mt-2" />}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Plus({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
}
