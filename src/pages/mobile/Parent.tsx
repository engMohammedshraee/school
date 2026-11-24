import { useState } from 'react';
import {
  Baby, Radio, MapPin, ClipboardList, History, CreditCard, Bell, User,
  Bus, Home, Navigation, Clock, Check, ChevronLeft, Phone, AlertTriangle,
  Crosshair, MapPinned, Star, Calendar, X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Badge, statusBadge, EmptyState } from '@/components/ui';
import { MapView } from '@/components/ui/map';
import { ConnectionIndicator, useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/overlays';
import { ProgressBar } from '@/components/ui/charts';
import { parents, students, trips, getBusById, getDriverById, getSupervisorById, getStudentsByParent } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function ParentDashboard() {
  const { userName, navigate } = useApp();
  const parent = parents[0];
  const children = getStudentsByParent(parent.id);
  const activeTrip = trips.find(t => t.status === 'active' && children.some(c => c.busId === t.busId));
  const bus = getBusById(children[0]?.busId || '');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-emerald-royal to-emerald rounded-2xl p-5 text-white">
        <p className="text-sm text-white/70">مساء الخير</p>
        <h2 className="text-xl font-bold">{userName}</h2>
        <p className="text-xs text-white/70 mt-1">{children.length} أبناء في خدمة النقل</p>
      </div>

      {/* Active trip banner */}
      {activeTrip && (
        <Card className="p-4 border-emerald/30 bg-emerald-soft/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald flex items-center justify-center text-white animate-pulse"><Navigation size={20} /></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">رحلة نشطة الآن</p>
              <p className="text-xs text-ink-500">الحافلة {bus?.code} في الطريق</p>
            </div>
            <button onClick={() => navigate('tracking')} className="btn-primary text-xs py-2 px-3">تتبع</button>
          </div>
        </Card>
      )}

      {/* Children cards */}
      <div>
        <h3 className="font-semibold text-sm mb-2 text-ink-700">أبنائي</h3>
        <div className="space-y-2">
          {children.map(child => {
            const childBus = getBusById(child.busId);
            return (
              <Card key={child.id} className="p-4" hover onClick={() => navigate('children')}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: child.avatarColor }}>{child.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{child.name}</p>
                    <p className="text-xs text-ink-500">{child.grade} • {childBus?.code}</p>
                  </div>
                  <Badge variant={statusBadge(child.subscriptionType).variant}>{statusBadge(child.subscriptionType).label}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bus info */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Bus size={20} /></div><div><p className="font-bold">{bus?.code}</p><p className="text-xs text-ink-500">حافلة النقل</p></div></div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2.5 rounded-lg bg-surface-subtle"><p className="text-xs text-ink-500">السائق</p><p className="font-medium text-sm">{getDriverById(bus?.driverId || '')?.name}</p></div>
          <div className="p-2.5 rounded-lg bg-surface-subtle"><p className="text-xs text-ink-500">المشرفة</p><p className="font-medium text-sm">{getSupervisorById(bus?.supervisorId || '')?.name}</p></div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('tracking')} className="card p-4 text-center hover:shadow-card-hover transition-all">
          <Radio size={24} className="text-emerald mx-auto mb-2" /><p className="text-sm font-semibold">تتبع مباشر</p>
        </button>
        <button onClick={() => navigate('absence')} className="card p-4 text-center hover:shadow-card-hover transition-all">
          <ClipboardList size={24} className="text-warning mx-auto mb-2" /><p className="text-sm font-semibold">إبلاغ غياب</p>
        </button>
        <button onClick={() => navigate('location')} className="card p-4 text-center hover:shadow-card-hover transition-all">
          <MapPin size={24} className="text-info mx-auto mb-2" /><p className="text-sm font-semibold">موقع المنزل</p>
        </button>
        <button onClick={() => navigate('subscription')} className="card p-4 text-center hover:shadow-card-hover transition-all">
          <CreditCard size={24} className="text-gold mx-auto mb-2" /><p className="text-sm font-semibold">الاشتراك</p>
        </button>
      </div>
    </div>
  );
}

export function ParentChildren() {
  const parent = parents[0];
  const children = getStudentsByParent(parent.id);
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">أبنائي</h1>
      {children.map(child => {
        const bus = getBusById(child.busId);
        return (
          <Card key={child.id} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: child.avatarColor }}>{child.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="font-semibold">{child.name}</p>
                <p className="text-xs text-ink-500">{child.grade} شعبة {child.section}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">الحافلة</span><span className="font-medium">{bus?.code}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">السائق</span><span className="font-medium">{getDriverById(bus?.driverId || '')?.name}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">المشرفة</span><span className="font-medium">{getSupervisorById(bus?.supervisorId || '')?.name}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">الاشتراك</span><Badge variant={statusBadge(child.subscriptionType).variant}>{statusBadge(child.subscriptionType).label}</Badge></div>
              <div className="flex justify-between"><span className="text-ink-500">الحالة</span><Badge variant={statusBadge(child.serviceStatus).variant} dot>{statusBadge(child.serviceStatus).label}</Badge></div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function ParentTracking() {
  const parent = parents[0];
  const children = getStudentsByParent(parent.id);
  const activeTrip = trips.find(t => t.status === 'active' && children.some(c => c.busId === t.busId));
  const bus = getBusById(children[0]?.busId || '');
  const driver = getDriverById(bus?.driverId || '');

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">تتبع الحافلة المباشر</h1>
      <Card className="p-0 overflow-hidden">
        <MapView
          markers={[
            { id: 'school', lat: 24.7136, lng: 46.6753, type: 'school', label: 'المدرسة' },
            { id: 'home', lat: parent.homeLat || 24.7136, lng: parent.homeLng || 46.6753, type: 'home', label: 'منزلك' },
            ...(activeTrip ? [{ id: activeTrip.busId, lat: activeTrip.busLat, lng: activeTrip.busLng, type: 'bus' as const, label: bus?.code, color: bus?.color, isMoving: true }] : []),
          ]}
          route={activeTrip?.routePoints || []}
          height={280}
          focusedMarkerId={activeTrip?.busId}
        />
      </Card>

      {activeTrip ? (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Bus size={20} /></div>
              <div><p className="font-bold">{bus?.code}</p><p className="text-xs text-ink-500">{driver?.name}</p></div>
            </div>
            <ConnectionIndicator status={activeTrip.connection} />
          </div>
          <ProgressBar value={activeTrip.progress} color={bus?.color} className="mb-2" />
          <div className="flex justify-between text-xs text-ink-500"><span>تقدم الرحلة</span><span className="num">{activeTrip.progress}%</span></div>
          <div className="mt-3 p-3 rounded-lg bg-info/5 border border-info/15">
            <p className="text-xs text-info flex items-center gap-1.5"><MapPinned size={14} /> الحافلة على بُعد ~300 متر من منزلك (بيانات تجريبية)</p>
          </div>
        </Card>
      ) : (
        <Card className="p-5 text-center">
          <div className="h-14 w-14 rounded-2xl bg-surface-subtle flex items-center justify-center text-ink-300 mx-auto mb-3"><Radio size={28} /></div>
          <p className="font-semibold">لا توجد رحلة نشطة</p>
          <p className="text-xs text-ink-500 mt-1">ستظهر الحافلة على الخريطة عند بدء الرحلة</p>
        </Card>
      )}
    </div>
  );
}

export function ParentLocation() {
  const parent = parents[0];
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(parent.homeRegistered);
  const [accuracy, setAccuracy] = useState(0);
  const { push } = useToast();

  const startRegister = () => {
    setRegistering(true);
    setAccuracy(0);
    const interval = setInterval(() => {
      setAccuracy(a => {
        if (a >= 95) { clearInterval(interval); return 95; }
        return a + 5;
      });
    }, 100);
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
      push('success', 'تم تسجيل موقع منزلك بنجاح');
    }, 2500);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">تسجيل موقع المنزل</h1>
      <Card className="p-4 bg-info/5 border-info/20">
        <div className="flex items-start gap-2">
          <Crosshair size={18} className="text-info shrink-0 mt-0.5" />
          <p className="text-xs text-ink-700">يجب أن تكون في منزلاك لتسجيل الموقع بدقة. يتم استخدام GPS لتحديد موقعك الفعلي، وليس إدخال العنوان يدوياً.</p>
        </div>
      </Card>
      <Card className="p-0 overflow-hidden">
        <MapView markers={[{ id: 'home', lat: parent.homeLat || 24.7136, lng: parent.homeLng || 46.6753, type: 'home', label: 'منزلك' }]} height={250} showControls={false} showLegend={false} />
      </Card>
      {registering && (
        <Card className="p-4">
          <div className="text-center">
            <Crosshair size={32} className="text-info mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-sm">جارٍ تحديد موقعك...</p>
            <p className="text-xs text-ink-500 mt-1">دقة GPS: <span className="num font-bold text-info">{accuracy}%</span></p>
            <ProgressBar value={accuracy} color="#4285B8" className="mt-3" />
          </div>
        </Card>
      )}
      {registered && !registering && (
        <Card className="p-4 border-success/30 bg-success/5">
          <div className="flex items-center gap-2"><Check size={20} className="text-success" /><div><p className="font-semibold text-sm text-success">الموقع مسجل</p><p className="text-xs text-ink-500">{parent.homeAddress}</p></div></div>
        </Card>
      )}
      <button onClick={startRegister} disabled={registering} className="w-full btn-primary py-3.5 text-base">
        <Crosshair size={20} className={registering ? 'animate-spin' : ''} />
        {registering ? 'جارٍ التحديد...' : registered ? 'إعادة تسجيل الموقع' : 'تسجيل موقع المنزل'}
      </button>
    </div>
  );
}

export function ParentAbsence() {
  const parent = parents[0];
  const children = getStudentsByParent(parent.id);
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [reported, setReported] = useState<Set<string>>(new Set());
  const { push } = useToast();

  const tripStarted = false;

  const handleSubmit = () => {
    setShowConfirm(false);
    setReported(prev => new Set([...prev, selectedChild]));
    push('success', 'تم إبلاغ الغياب — سيتم إزالة الطالب من قائمة الرحلة');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">الإبلاغ عن الغياب</h1>
      {tripStarted && (
        <Card className="p-3 bg-danger/5 border-danger/20">
          <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-danger" /><p className="text-xs text-danger font-medium">لا يمكن الإبلاغ عن الغياب بعد بدء الرحلة</p></div>
        </Card>
      )}
      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">اختر الطالب</p>
        <div className="space-y-2">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelectedChild(c.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all", selectedChild === c.id ? "border-emerald bg-emerald-soft/30" : "border-line")}>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: c.avatarColor }}>{c.name.charAt(0)}</div>
              <span className="font-medium text-sm flex-1 text-right">{c.name}</span>
              {selectedChild === c.id && <Check size={18} className="text-emerald" />}
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">تاريخ الغياب</p>
        <div className="flex items-center gap-2 bg-surface-subtle rounded-xl p-3"><Calendar size={18} className="text-ink-500" /><span className="text-sm font-medium">اليوم — 8 نوفمبر 2026</span></div>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-semibold mb-3">الرحلة</p>
        <div className="flex gap-2">
          <button className="flex-1 p-3 rounded-xl bg-emerald text-white text-sm font-medium">الذهاب</button>
          <button className="flex-1 p-3 rounded-xl bg-surface-subtle text-ink-500 text-sm">الإياب</button>
        </div>
      </Card>
      {reported.has(selectedChild) ? (
        <Card className="p-4 border-success/30 bg-success/5"><div className="flex items-center gap-2"><Check size={20} className="text-success" /><p className="text-sm text-success font-medium">تم تسجيل الغياب لهذا الطالب</p></div></Card>
      ) : (
        <button onClick={() => setShowConfirm(true)} className="w-full btn-danger py-3.5 text-base"><ClipboardList size={20} />تأكيد الإبلاغ عن الغياب</button>
      )}
      <ConfirmDialog open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleSubmit} title="تأكيد الإبلاغ عن الغياب" description={`سيتم إزالة الطالب من قائمة الرحلة وإشعار السائق والمشرفة.`} confirmLabel="تأكيد" danger />
    </div>
  );
}

export function ParentHistory() {
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">سجل الرحلات</h1>
      {trips.map(t => {
        const bus = getBusById(t.busId);
        return (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}><Bus size={16} /></div><span className="font-semibold text-sm">{bus?.code}</span></div>
              <Badge variant={statusBadge(t.status).variant} dot>{statusBadge(t.status).label}</Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-500"><Clock size={12} /><span className="num">{t.date}</span><span>•</span><Badge variant={t.direction === 'going' ? 'info' : 'gold'}>{t.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge></div>
          </Card>
        );
      })}
    </div>
  );
}

export function ParentSubscription() {
  const parent = parents[0];
  const children = getStudentsByParent(parent.id);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">اشتراك النقل</h1>
      {children.map(c => (
        <Card key={c.id} className="p-4">
          <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: c.avatarColor }}>{c.name.charAt(0)}</div><div className="flex-1"><p className="font-semibold text-sm">{c.name}</p><p className="text-xs text-ink-500">{c.grade}</p></div></div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">نوع الاشتراك</span><Badge variant={statusBadge(c.subscriptionType).variant}>{statusBadge(c.subscriptionType).label}</Badge></div>
            <div className="flex justify-between"><span className="text-ink-500">الرسوم السنوية</span><span className="font-medium num">1,800 ر.س</span></div>
            <div className="flex justify-between"><span className="text-ink-500">المدفوع</span><span className="font-medium num text-success">900 ر.س</span></div>
            <div className="flex justify-between"><span className="text-ink-500">المتبقي</span><span className="font-medium num text-warning">900 ر.س</span></div>
          </div>
          <ProgressBar value={50} color="#16845B" className="mt-3" />
        </Card>
      ))}
    </div>
  );
}

export function ParentProfile() {
  const { userName } = useApp();
  const parent = parents[0];
  return (
    <div className="p-4 space-y-4">
      <Card className="p-5 text-center">
        <div className="h-20 w-20 rounded-2xl bg-emerald flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{parent.name.charAt(0)}</div>
        <h2 className="font-bold text-lg">{userName}</h2>
        <p className="text-sm text-ink-500">ولي أمر</p>
      </Card>
      <Card className="p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-ink-500">الهاتف</span><span className="font-medium num">{parent.phone}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">عدد الأبناء</span><span className="font-medium num">{parent.childrenIds.length}</span></div>
          <div className="flex justify-between"><span className="text-ink-500">العنوان</span><span className="font-medium text-xs">{parent.homeAddress}</span></div>
        </div>
      </Card>
    </div>
  );
}

export function ParentNotifications() {
  const { notifications, markNotificationRead } = useApp();
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">الإشعارات</h1>
      {notifications.slice(0, 8).map(n => (
        <Card key={n.id} className={cn("p-3", !n.read && "border-emerald/20")} onClick={() => markNotificationRead(n.id)}>
          <div className="flex items-start gap-3"><div className="h-9 w-9 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald shrink-0"><Bell size={18} /></div><div className="flex-1"><p className="font-semibold text-sm">{n.title}</p><p className="text-xs text-ink-500 mt-0.5">{n.description}</p><p className="text-[10px] text-ink-300 mt-1">{n.timestamp}</p></div>{!n.read && <span className="h-2 w-2 rounded-full bg-emerald shrink-0 mt-2" />}</div>
        </Card>
      ))}
    </div>
  );
}
