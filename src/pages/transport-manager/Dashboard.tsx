import { useState } from 'react';
import { Radio, Navigation, Bus, Users, AlertTriangle, WifiOff, Activity, Clock, MapPin, TrendingUp, ChevronLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, StatCard, Card, Badge, statusBadge } from '@/components/ui';
import { MapView } from '@/components/ui/map';
import { BarChart, ProgressBar, DonutChart } from '@/components/ui/charts';
import { ConnectionIndicator } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/overlays';
import { useToast } from '@/components/ui/toast';
import { trips, buses, drivers, supervisors, students, transportStats, getBusById, getDriverById, getSupervisorById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Trip } from '@/types';

export function TransportManagerDashboard() {
  const { navigate, notifications } = useApp();
  const activeTrips = trips.filter((t) => t.status === 'active');
  const offlineBuses = buses.filter((b) => b.status === 'maintenance');

  return (
    <div>
      <PageHeader
        title="لوحة العمليات"
        description="نظرة شاملة على عمليات النقل المباشرة لليوم — 8 نوفمبر 2026"
        breadcrumb={[{ label: 'العمليات' }, { label: 'لوحة العمليات' }]}
        actions={
          <button className="btn-primary" onClick={() => navigate('live')}>
            <Radio size={16} />
            مركز التتبع المباشر
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="رحلات نشطة" value={activeTrips.length} icon={<Navigation size={20} />} accent="emerald" trend="up" trendValue="2" />
        <StatCard label="طلاب على المتن" value={transportStats.boardedStudents} icon={<Users size={20} />} accent="info" />
        <StatCard label="حافلات غير متصلة" value={offlineBuses.length} icon={<WifiOff size={20} />} accent="danger" />
        <StatCard label="نسبة الالتزام بالوقت" value="94.2%" icon={<TrendingUp size={20} />} accent="gold" trend="up" trendValue="1.8%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-900">الرحلات النشطة الآن</h3>
            <Badge variant="emerald" dot>مباشر</Badge>
          </div>
          <div className="space-y-3">
            {activeTrips.map((trip) => {
              const bus = getBusById(trip.busId);
              const driver = getDriverById(trip.driverId);
              const sup = getSupervisorById(trip.supervisorId);
              return (
                <button
                  key={trip.id}
                  onClick={() => navigate('active-trips')}
                  className="w-full flex items-center gap-4 p-3 rounded-xl border border-line hover:border-line-strong hover:bg-surface-subtle/50 transition-all text-right"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald shrink-0">
                    <Bus size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-900 text-sm">{bus?.code}</p>
                      <Badge variant={trip.direction === 'going' ? 'info' : 'gold'}>
                        {trip.direction === 'going' ? 'ذهاب' : 'إياب'}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5">{driver?.name} • {sup?.name}</p>
                  </div>
                  <div className="hidden sm:block w-32">
                    <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1">
                      <span>التقدم</span>
                      <span className="num">{trip.progress}%</span>
                    </div>
                    <ProgressBar value={trip.progress} />
                  </div>
                  <div className="text-left shrink-0">
                    <ConnectionIndicator status={trip.connection} />
                    <p className="text-[10px] text-ink-300 mt-1">{trip.lastGpsUpdate}</p>
                  </div>
                  <ChevronLeft size={18} className="text-ink-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-ink-900 mb-4">توزيع حالة الطلاب</h3>
          <DonutChart
            segments={[
              { label: 'على متن الحافلة', value: 18, color: '#4285B8' },
              { label: 'تم التوصيل', value: 24, color: '#16845B' },
              { label: 'بانتظار الاستلام', value: 7, color: '#D99A32' },
              { label: 'غائب', value: 3, color: '#D64B4B' },
            ]}
            centerValue="52"
            centerLabel="إجمالي الطلاب"
          />
          <div className="mt-4 pt-4 border-t border-line">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">الطلاب الموقوفون مالياً</span>
              <Badge variant="danger">{transportStats.suspendedStudents}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-ink-900 mb-4">تنبيهات تحتاج متابعة</h3>
          <div className="space-y-2.5">
            {notifications.filter((n) => !n.read && ['gps_lost', 'driver_offline'].includes(n.type)).map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-danger/5 border border-danger/15">
                <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{n.description}</p>
                </div>
                <span className="text-[10px] text-ink-300 shrink-0">{n.timestamp}</span>
              </div>
            ))}
            <button onClick={() => navigate('offline-buses')} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-line transition-colors">
              <span className="text-sm text-ink-700">عرض كل الحافلات غير المتصلة</span>
              <ChevronLeft size={16} className="text-ink-300" />
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-ink-900 mb-4">إحصائيات الأسبوع</h3>
          <BarChart
            data={[
              { month: 'الأحد', value: 48 }, { month: 'الإثنين', value: 52 }, { month: 'الثلاثاء', value: 50 },
              { month: 'الأربعاء', value: 53 }, { month: 'الخميس', value: 47 }, { month: 'الجمعة', value: 0 },
            ]}
            color="#16845B"
            height={160}
          />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-line">
            <div>
              <p className="text-xs text-ink-500">إجمالي الرحلات</p>
              <p className="text-lg font-bold text-ink-900 num">248</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">متوسط المدة</p>
              <p className="text-lg font-bold text-ink-900 num">42د</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">حالات طارئة</p>
              <p className="text-lg font-bold text-danger num">1</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LiveTrackingCenter() {
  const { navigate } = useApp();
  const { push } = useToast();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips.find((t) => t.status === 'active') || null);
  const [showTerminate, setShowTerminate] = useState(false);
  const [terminated, setTerminated] = useState<Set<string>>(new Set());

  const activeTrips = trips.filter((t) => t.status === 'active' && !terminated.has(t.id));

  const selectedBus = selectedTrip ? getBusById(selectedTrip.busId) : null;
  const selectedDriver = selectedTrip ? getDriverById(selectedTrip.driverId) : null;
  const selectedSup = selectedTrip ? getSupervisorById(selectedTrip.supervisorId) : null;

  const mapMarkers = selectedTrip
    ? [
        { id: 'school', lat: selectedTrip.schoolLat, lng: selectedTrip.schoolLng, type: 'school' as const, label: 'المدرسة' },
        { id: selectedTrip.busId, lat: selectedTrip.busLat, lng: selectedTrip.busLng, type: 'bus' as const, label: selectedBus?.code, color: selectedBus?.color, isMoving: true },
        ...students.filter((s) => s.busId === selectedTrip.busId && s.serviceStatus === 'active').slice(0, 8).map((s) => ({
          id: s.id, lat: s.homeLat, lng: s.homeLng, type: 'home' as const, label: s.name,
        })),
      ]
    : [];

  const handleTerminate = (reason?: string) => {
    if (!reason || !reason.trim()) {
      push('error', 'يرجى إدخال سبب الإنهاء الطارئ');
      return;
    }
    if (selectedTrip) {
      setTerminated((prev) => new Set([...prev, selectedTrip.id]));
      push('warning', `تم إنهاء رحلة ${selectedBus?.code} قسرياً — تم إيقاف بث GPS`);
      setShowTerminate(false);
      setSelectedTrip(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="مركز التتبع المباشر"
        description="متابعة الحافلات على الخريطة في الوقت الفعلي"
        breadcrumb={[{ label: 'العمليات' }, { label: 'التتبع المباشر' }]}
      />

      <div className="flex-1 grid lg:grid-cols-[1fr_360px] gap-4 min-h-0">
        <Card className="relative overflow-hidden p-0">
          <MapView
            markers={mapMarkers}
            route={selectedTrip?.routePoints || []}
            focusedMarkerId={selectedTrip?.busId}
            onMarkerClick={(id) => {
              const t = activeTrips.find((tr) => tr.busId === id);
              if (t) setSelectedTrip(t);
            }}
            title={selectedBus ? `الحافلة ${selectedBus.code}` : 'خريطة المتابعة'}
            height="100%"
          />
        </Card>

        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto no-scrollbar">
          <Card className="p-4 shrink-0">
            <h3 className="font-semibold text-ink-900 mb-3">الرحلات النشطة</h3>
            <div className="space-y-2">
              {activeTrips.length === 0 ? (
                <p className="text-sm text-ink-500 text-center py-4">لا توجد رحلات نشطة</p>
              ) : (
                activeTrips.map((trip) => {
                  const bus = getBusById(trip.busId);
                  const isSelected = selectedTrip?.id === trip.id;
                  return (
                    <button
                      key={trip.id}
                      onClick={() => setSelectedTrip(trip)}
                      className={cn(
                        'w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-right',
                        isSelected ? 'border-emerald bg-emerald-soft/50' : 'border-line hover:border-line-strong'
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: bus?.color }}>
                        <Bus size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900">{bus?.code}</p>
                        <p className="text-[10px] text-ink-500">{trip.direction === 'going' ? 'رحلة ذهاب' : 'رحلة إياب'}</p>
                      </div>
                      <ConnectionIndicator status={trip.connection} />
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {selectedTrip && selectedBus && (
            <Card className="p-4 shrink-0 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: selectedBus.color }}>
                    <Bus size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{selectedBus.code}</p>
                    <p className="text-xs text-ink-500">{selectedBus.plateNumber}</p>
                  </div>
                </div>
                <Badge variant={selectedTrip.direction === 'going' ? 'info' : 'gold'}>
                  {selectedTrip.direction === 'going' ? 'ذهاب' : 'إياب'}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">السائق</span>
                  <span className="font-medium text-ink-900">{selectedDriver?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">المشرفة</span>
                  <span className="font-medium text-ink-900">{selectedSup?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">الطلاب</span>
                  <span className="font-medium text-ink-900 num">{selectedTrip.boardedCount}/{selectedTrip.studentsCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">آخر تحديث GPS</span>
                  <span className="font-medium text-ink-900 text-xs">{selectedTrip.lastGpsUpdate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">الحالة</span>
                  <ConnectionIndicator status={selectedTrip.connection} />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-500">تقدم الرحلة</span>
                  <span className="font-semibold text-ink-900 num">{selectedTrip.progress}%</span>
                </div>
                <ProgressBar value={selectedTrip.progress} color={selectedBus.color} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="btn-outline text-xs py-2" onClick={() => navigate('active-trips')}>
                  <Activity size={14} />
                  تفاصيل الرحلة
                </button>
                <button className="btn-outline text-xs py-2" onClick={() => navigate('gps-history')}>
                  <MapPin size={14} />
                  سجل GPS
                </button>
              </div>

              <button
                onClick={() => setShowTerminate(true)}
                className="w-full btn-danger text-xs py-2.5"
              >
                <AlertTriangle size={14} />
                إنهاء طارئ للرحلة
              </button>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showTerminate}
        onClose={() => setShowTerminate(false)}
        onConfirm={handleTerminate}
        title="إنهاء طارئ للرحلة"
        description="هذا إجراء خطير سيؤدي إلى إيقاف الرحلة فوراً وإيقاف بث GPS. سيتم إشعار السائق والمشرفة وأولياء الأمور. يرجى إدخال سبب الإنهاء."
        confirmLabel="تأكيد الإنهاء الطارئ"
        danger
        requireText
        placeholder="أدخل سبب الإنهاء الطارئ..."
      />
    </div>
  );
}

export function ActiveTrips() {
  const { navigate } = useApp();
  const activeTrips = trips.filter((t) => t.status === 'active' || t.status === 'not_started');

  return (
    <div>
      <PageHeader
        title="الرحلات النشطة"
        description="جميع الرحلات الجارية والمجدولة لهذا اليوم"
        breadcrumb={[{ label: 'العمليات' }, { label: 'الرحلات النشطة' }]}
        actions={<button className="btn-primary" onClick={() => navigate('live')}><Radio size={16} />التتبع المباشر</button>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTrips.map((trip) => {
          const bus = getBusById(trip.busId);
          const driver = getDriverById(trip.driverId);
          const sup = getSupervisorById(trip.supervisorId);
          const sb = statusBadge(trip.status);
          return (
            <Card key={trip.id} className="p-5" hover>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: bus?.color }}>
                    <Bus size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{bus?.code}</p>
                    <p className="text-xs text-ink-500">{bus?.plateNumber}</p>
                  </div>
                </div>
                <Badge variant={sb.variant} dot>{sb.label}</Badge>
              </div>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">الاتجاه</span>
                  <Badge variant={trip.direction === 'going' ? 'info' : 'gold'}>{trip.direction === 'going' ? 'ذهاب' : 'إياب'}</Badge>
                </div>
                <div className="flex items-center justify-between"><span className="text-ink-500">السائق</span><span className="font-medium">{driver?.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">المشرفة</span><span className="font-medium">{sup?.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">الطلاب</span><span className="font-medium num">{trip.boardedCount}/{trip.studentsCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">وقت البدء</span><span className="font-medium num">{trip.startTime}</span></div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-ink-500">التقدم</span><span className="num">{trip.progress}%</span></div>
                <ProgressBar value={trip.progress} color={bus?.color} />
              </div>
              <button className="w-full btn-outline text-xs py-2" onClick={() => navigate('live')}>
                عرض على الخريطة
                <ChevronLeft size={14} />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function OfflineBuses() {
  const offlineBuses = buses.filter((b) => b.status === 'maintenance');
  const offlineTrips = trips.filter((t) => t.connection === 'offline' || t.connection === 'gps_unavailable');

  return (
    <div>
      <PageHeader
        title="الحافلات غير المتصلة"
        description="الحافلات التي فقدت الاتصال أو في حالة صيانة"
        breadcrumb={[{ label: 'العمليات' }, { label: 'الحافلات غير المتصلة' }]}
      />
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {offlineBuses.map((bus) => {
          const driver = getDriverById(bus.driverId);
          return (
            <Card key={bus.id} className="p-5 border-danger/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
                    <Bus size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{bus.code}</p>
                    <p className="text-xs text-ink-500">{bus.plateNumber}</p>
                  </div>
                </div>
                <Badge variant="danger" dot>صيانة</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-500">السائق</span><span className="font-medium">{driver?.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">المشكلة</span><span className="text-danger font-medium">عطل ميكانيكي</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">آخر صيانة</span><span className="font-medium">{bus.lastService}</span></div>
              </div>
            </Card>
          );
        })}
        {offlineTrips.filter((t) => t.status !== 'terminated').map((trip) => {
          const bus = getBusById(trip.busId);
          return (
            <Card key={trip.id} className="p-5 border-warning/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                    <WifiOff size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{bus?.code}</p>
                    <p className="text-xs text-ink-500">انقطاع الاتصال</p>
                  </div>
                </div>
                <ConnectionIndicator status={trip.connection} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-ink-500">آخر تحديث</span><span className="font-medium">{trip.lastGpsUpdate}</span></div>
                <div className="flex items-center justify-between"><span className="text-ink-500">الطلاب على المتن</span><span className="font-medium num">{trip.boardedCount}</span></div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ink-900">إجراءات مقترحة</p>
            <p className="text-xs text-ink-500 mt-1">تواصل مع السائقين عبر الهاتف للتأكد من سلامة الطلاب. يتم الاحتفاظ بسجلات GPS لمدة 48 ساعة.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
