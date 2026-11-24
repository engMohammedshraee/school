import type {
  School,
  Branch,
  Bus,
  Driver,
  Supervisor,
  Student,
  Trip,
  Invoice,
  NotificationItem,
  Parent,
  RoleInfo,
} from '@/types';

export const ROLES: RoleInfo[] = [
  {
    id: 'superadmin',
    nameAr: 'مدير المنصة',
    nameEn: 'Platform Admin',
    description: 'إدارة المنصة العامة واشتراكات المدارس',
    sampleUserName: 'خالد المنصور',
  },
  {
    id: 'school_admin',
    nameAr: 'إدارة المدرسة',
    nameEn: 'School Admin',
    description: 'إدارة عمليات النقل على مستوى المدرسة',
    sampleUserName: 'م. سارة العتيبي',
  },
  {
    id: 'transport_manager',
    nameAr: 'مدير النقل',
    nameEn: 'Transport Manager',
    description: 'إدارة الرحلات اليومية وتتبع الحافلات',
    sampleUserName: 'أ. عبدالله الشهري',
  },
  {
    id: 'driver',
    nameAr: 'السائق',
    nameEn: 'Driver',
    description: 'واجهة السائق لإدارة الرحلات والطلاب',
    sampleUserName: 'أبو خالد — محمد القحطاني',
    isMobile: true,
  },
  {
    id: 'supervisor',
    nameAr: 'المشرفة',
    nameEn: 'Supervisor',
    description: 'واجهة المشرفة لحصر الطلاب والحضور',
    sampleUserName: 'أ. نورة الدوسري',
    isMobile: true,
  },
  {
    id: 'parent',
    nameAr: 'ولي الأمر',
    nameEn: 'Parent',
    description: 'بوابة ولي الأمر لتتبع الأبناء',
    sampleUserName: 'أ. فهد الغامدي',
    isMobile: true,
  },
  {
    id: 'accountant',
    nameAr: 'المحاسب',
    nameEn: 'Accountant',
    description: 'إدارة الرسوم والفواتير والإيقاف المالي',
    sampleUserName: 'أ. ماجد الحربي',
  },
];

export const schools: School[] = [
  {
    id: 's1',
    name: 'مدارس المستقبل الأهلية',
    nameEn: 'Al-Mustaqbal Schools',
    branchesCount: 3,
    busesCount: 18,
    studentsCount: 642,
    status: 'active',
    plan: 'enterprise',
    city: 'الرياض',
    joinedDate: '2024-09-01',
    monthlyFee: 4500,
    logoColor: '#16845B',
  },
  {
    id: 's2',
    name: 'مدارس النخبة الدولية',
    nameEn: 'Al-Nukhba International',
    branchesCount: 2,
    busesCount: 12,
    studentsCount: 384,
    status: 'active',
    plan: 'professional',
    city: 'جدة',
    joinedDate: '2024-11-15',
    monthlyFee: 2800,
    logoColor: '#4285B8',
  },
  {
    id: 's3',
    name: 'مدارس الابتكار الأهلية',
    nameEn: 'Al-Ibdaa Schools',
    branchesCount: 1,
    busesCount: 6,
    studentsCount: 168,
    status: 'trial',
    plan: 'starter',
    city: 'الدمام',
    joinedDate: '2025-01-10',
    monthlyFee: 1200,
    logoColor: '#C9A45C',
  },
  {
    id: 's4',
    name: 'مدارس الريادة التعليمية',
    nameEn: 'Al-Riyada Schools',
    branchesCount: 4,
    busesCount: 22,
    studentsCount: 812,
    status: 'active',
    plan: 'enterprise',
    city: 'الرياض',
    joinedDate: '2024-08-20',
    monthlyFee: 5200,
    logoColor: '#D99A32',
  },
  {
    id: 's5',
    name: 'مدارس الصرح التربوي',
    nameEn: 'Al-Sarh Educational',
    branchesCount: 2,
    busesCount: 9,
    studentsCount: 256,
    status: 'active',
    plan: 'professional',
    city: 'مكة المكرمة',
    joinedDate: '2024-12-05',
    monthlyFee: 2400,
    logoColor: '#7B61FF',
  },
];

export const branches: Branch[] = [
  { id: 'b1', schoolId: 's1', name: 'فرع النخيل', city: 'الرياض', address: 'حي النخيل، طريق الملك فهد', studentsCount: 280, busesCount: 8 },
  { id: 'b2', schoolId: 's1', name: 'فرع الياسمين', city: 'الرياض', address: 'حي الياسمين، طريق الأمير محمد', studentsCount: 212, busesCount: 6 },
  { id: 'b3', schoolId: 's1', name: 'فرع الورود', city: 'الرياض', address: 'حي الورود، طريق العليا', studentsCount: 150, busesCount: 4 },
  { id: 'b4', schoolId: 's2', name: 'فرع الروضة', city: 'جدة', address: 'حي الروضة، طريق الكورنيش', studentsCount: 224, busesCount: 7 },
  { id: 'b5', schoolId: 's2', name: 'فرع الشاطئ', city: 'جدة', address: 'حي الشاطئ، طريق الأمير سلطان', studentsCount: 160, busesCount: 5 },
  { id: 'b6', schoolId: 's4', name: 'فرع الملقا', city: 'الرياض', address: 'حي الملقا، طريق الأمير تركي', studentsCount: 310, busesCount: 9 },
];

export const drivers: Driver[] = [
  { id: 'd1', name: 'محمد القحطاني', phone: '0501234567', licenseNumber: 'D-1029384', licenseExpiry: '2026-08-15', rating: 4.8, tripsCount: 184, status: 'on_duty', busId: 'bus1', avatarColor: '#16845B' },
  { id: 'd2', name: 'أحمد الزهراني', phone: '0502345678', licenseNumber: 'D-2038475', licenseExpiry: '2025-12-01', rating: 4.6, tripsCount: 142, status: 'on_duty', busId: 'bus2', avatarColor: '#4285B8' },
  { id: 'd3', name: 'سعد العنزي', phone: '0503456789', licenseNumber: 'D-3049586', licenseExpiry: '2026-03-20', rating: 4.9, tripsCount: 210, status: 'off_duty', busId: 'bus3', avatarColor: '#C9A45C' },
  { id: 'd4', name: 'فهد المطيري', phone: '0504567890', licenseNumber: 'D-4058697', licenseExpiry: '2026-06-10', rating: 4.5, tripsCount: 98, status: 'on_duty', busId: 'bus4', avatarColor: '#D99A32' },
  { id: 'd5', name: 'عبدالعزيز الحربي', phone: '0505678901', licenseNumber: 'D-5069708', licenseExpiry: '2025-11-30', rating: 4.7, tripsCount: 167, status: 'on_leave', busId: 'bus5', avatarColor: '#16845B' },
  { id: 'd6', name: 'ماجد الدوسري', phone: '0506789012', licenseNumber: 'D-6070819', licenseExpiry: '2026-09-25', rating: 4.4, tripsCount: 76, status: 'on_duty', busId: 'bus6', avatarColor: '#4285B8' },
];

export const supervisors: Supervisor[] = [
  { id: 'sup1', name: 'نورة الدوسري', phone: '0561112233', grade: 'المرحلة الابتدائية', status: 'on_duty', busId: 'bus1', avatarColor: '#16845B' },
  { id: 'sup2', name: 'ريم الشهري', phone: '0562223344', grade: 'المرحلة المتوسطة', status: 'on_duty', busId: 'bus2', avatarColor: '#4285B8' },
  { id: 'sup3', name: 'هند العتيبي', phone: '0563334455', grade: 'المرحلة الابتدائية', status: 'off_duty', busId: 'bus3', avatarColor: '#C9A45C' },
  { id: 'sup4', name: 'لمى القحطاني', phone: '0564445566', grade: 'المرحلة الثانوية', status: 'on_duty', busId: 'bus4', avatarColor: '#D99A32' },
  { id: 'sup5', name: 'سارة الغامدي', phone: '0565556677', grade: 'المرحلة المتوسطة', status: 'on_duty', busId: 'bus6', avatarColor: '#16845B' },
];

export const buses: Bus[] = [
  { id: 'bus1', code: 'MST-001', plateNumber: 'ر س ط - 1024', capacity: 30, model: 'تويوتا كوستير', year: 2023, driverId: 'd1', supervisorId: 'sup1', schoolId: 's1', status: 'active', odometer: 45230, lastService: '2025-10-15', color: '#16845B' },
  { id: 'bus2', code: 'MST-002', plateNumber: 'ر س ط - 2087', capacity: 28, model: 'نيسان سيvilian', year: 2022, driverId: 'd2', supervisorId: 'sup2', schoolId: 's1', status: 'active', odometer: 62100, lastService: '2025-09-28', color: '#4285B8' },
  { id: 'bus3', code: 'MST-003', plateNumber: 'ر س ط - 3156', capacity: 32, model: 'مرسيدس سبرينتر', year: 2024, driverId: 'd3', supervisorId: 'sup3', schoolId: 's1', status: 'maintenance', odometer: 18900, lastService: '2025-11-01', color: '#C9A45C' },
  { id: 'bus4', code: 'MST-004', plateNumber: 'ر س ط - 4290', capacity: 26, model: 'تويوتا هايس', year: 2021, driverId: 'd4', supervisorId: 'sup4', schoolId: 's1', status: 'active', odometer: 78400, lastService: '2025-10-20', color: '#D99A32' },
  { id: 'bus5', code: 'MST-005', plateNumber: 'ر س ط - 5334', capacity: 30, model: 'تويوتا كوستير', year: 2023, driverId: 'd5', supervisorId: 'sup5', schoolId: 's4', status: 'idle', odometer: 31200, lastService: '2025-10-10', color: '#16845B' },
  { id: 'bus6', code: 'MST-006', plateNumber: 'ر س ط - 6478', capacity: 28, model: 'نيسان سيvilian', year: 2022, driverId: 'd6', supervisorId: 'sup5', schoolId: 's4', status: 'active', odometer: 54700, lastService: '2025-09-15', color: '#4285B8' },
];

const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الأول الثانوي'];
const sections = ['أ', 'ب', 'ج'];
const avatarColors = ['#16845B', '#4285B8', '#C9A45C', '#D99A32', '#7B61FF', '#16845B', '#D64B4B'];

const studentNames = [
  'عبدالله العتيبي', 'سارة الشهري', 'خالد القحطاني', 'ريم الدوسري', 'فهد الغامدي',
  'نورة الحربي', 'محمد الزهراني', 'لمى المطيري', 'أحمد العنزي', 'هند السبيعي',
  'عبدالعزيز الفيصل', 'جواهر الرشيد', 'سلطان البقمي', 'تalu المالكي', 'فيصل القرني',
  'مها الجهني', 'تركي الشمري', 'روان الحازمي', 'بدر العسيري', 'دانة الخالدي',
  'راكان الطيبي', 'شهد الزبيدي', 'ثامر الحربي', 'لطيفة المورقي', 'وائل القحطاني',
];

export const parents: Parent[] = [
  { id: 'p1', name: 'فهد الغامدي', phone: '0509876543', childrenIds: ['st1', 'st2'], homeRegistered: true, homeLat: 24.7136, homeLng: 46.6753, homeAddress: 'حي النخيل، شارع الأمير سلطان' },
  { id: 'p2', name: 'خالد القحطاني', phone: '0508765432', childrenIds: ['st3'], homeRegistered: true, homeLat: 24.6877, homeLng: 46.6858, homeAddress: 'حي الياسمين، شارع التحلية' },
  { id: 'p3', name: 'عبدالله العتيبي', phone: '0507654321', childrenIds: ['st4', 'st5'], homeRegistered: true, homeLat: 24.6920, homeLng: 46.6700, homeAddress: 'حي الورود، طريق العليا' },
  { id: 'p4', name: 'ماجد الحربي', phone: '0506543210', childrenIds: ['st6'], homeRegistered: false, homeAddress: 'حي الملقا — غير محدد' },
  { id: 'p5', name: 'سعد الدوسري', phone: '0505432109', childrenIds: ['st7', 'st8', 'st9'], homeRegistered: true, homeLat: 24.7100, homeLng: 46.6900, homeAddress: 'حي الياسمين، شارع أنس بن مالك' },
];

export const students: Student[] = studentNames.map((name, i) => {
  const bus = buses[i % buses.length];
  const subs = ['one_way', 'return_only', 'round_trip'] as const;
  const parentIdx = Math.floor(i / 5);
  return {
    id: `st${i + 1}`,
    name,
    grade: grades[i % grades.length],
    section: sections[i % sections.length],
    parentId: `p${parentIdx + 1}`,
    busId: bus.id,
    subscriptionType: subs[i % 3],
    serviceStatus: i === 14 ? 'suspended' : 'active',
    homeLat: 24.71 + (Math.random() - 0.5) * 0.08,
    homeLng: 46.67 + (Math.random() - 0.5) * 0.08,
    homeAddress: `حي ${['النخيل', 'الياسمين', 'الورود', 'الملقا', 'الروضة'][i % 5]}، شارع ${i + 1}`,
    avatarColor: avatarColors[i % avatarColors.length],
    photoSeed: `student${i + 1}`,
  };
});

export const trips: Trip[] = [
  {
    id: 't1', busId: 'bus1', driverId: 'd1', supervisorId: 'sup1', direction: 'going', date: '2026-11-08',
    startTime: '06:30', endTime: null, status: 'active', studentsCount: 25, boardedCount: 18, deliveredCount: 0,
    connection: 'online', lastGpsUpdate: 'قبل دقيقة', progress: 62,
    schoolLat: 24.7136, schoolLng: 46.6753, busLat: 24.7150, busLng: 46.6720,
    routePoints: [
      { lat: 24.7200, lng: 46.6800 }, { lat: 24.7180, lng: 46.6780 }, { lat: 24.7150, lng: 46.6750 },
      { lat: 24.7136, lng: 46.6753 }, { lat: 24.7150, lng: 46.6720 },
    ],
  },
  {
    id: 't2', busId: 'bus2', driverId: 'd2', supervisorId: 'sup2', direction: 'going', date: '2026-11-08',
    startTime: '06:45', endTime: null, status: 'active', studentsCount: 22, boardedCount: 22, deliveredCount: 0,
    connection: 'weak', lastGpsUpdate: 'قبل 4 دقائق', progress: 78,
    schoolLat: 24.7136, schoolLng: 46.6753, busLat: 24.7110, busLng: 46.6790,
    routePoints: [
      { lat: 24.7100, lng: 46.6900 }, { lat: 24.7120, lng: 46.6850 }, { lat: 24.7110, lng: 46.6790 },
    ],
  },
  {
    id: 't3', busId: 'bus4', driverId: 'd4', supervisorId: 'sup4', direction: 'return', date: '2026-11-08',
    startTime: '14:00', endTime: null, status: 'not_started', studentsCount: 20, boardedCount: 0, deliveredCount: 0,
    connection: 'offline', lastGpsUpdate: 'قبل 12 دقيقة', progress: 0,
    schoolLat: 24.7136, schoolLng: 46.6753, busLat: 24.7136, busLng: 46.6753,
    routePoints: [{ lat: 24.7136, lng: 46.6753 }],
  },
  {
    id: 't4', busId: 'bus6', driverId: 'd6', supervisorId: 'sup5', direction: 'going', date: '2026-11-08',
    startTime: '06:15', endTime: '07:20', status: 'completed', studentsCount: 24, boardedCount: 24, deliveredCount: 24,
    connection: 'online', lastGpsUpdate: 'قبل 30 دقيقة', progress: 100,
    schoolLat: 24.7136, schoolLng: 46.6753, busLat: 24.7136, busLng: 46.6753,
    routePoints: [{ lat: 24.7136, lng: 46.6753 }, { lat: 24.7200, lng: 46.6800 }],
  },
  {
    id: 't5', busId: 'bus3', driverId: 'd3', supervisorId: 'sup3', direction: 'going', date: '2026-11-07',
    startTime: '06:30', endTime: '07:15', status: 'terminated', studentsCount: 20, boardedCount: 8, deliveredCount: 0,
    connection: 'gps_unavailable', lastGpsUpdate: 'قبل 24 ساعة', progress: 35,
    schoolLat: 24.7136, schoolLng: 46.6753, busLat: 24.7160, busLng: 46.6700,
    routePoints: [{ lat: 24.7160, lng: 46.6700 }],
    terminateReason: 'عطل ميكانيكي في الحافلة — تم إنهاء الرحلة لسلامة الطلاب',
  },
];

export const invoices: Invoice[] = students.slice(0, 18).map((s, i) => {
  const statuses = ['paid', 'pending', 'overdue', 'partial'] as const;
  const status = s.serviceStatus === 'suspended' ? 'overdue' : statuses[i % 4];
  const total = 1800;
  const paid = status === 'paid' ? total : status === 'partial' ? 900 : 0;
  return {
    id: `inv${i + 1}`,
    studentId: s.id,
    studentName: s.name,
    amount: total,
    paidAmount: paid,
    dueDate: `2026-11-${(i % 28) + 1 < 10 ? '0' + ((i % 28) + 1) : (i % 28) + 1}`,
    status,
    installmentNo: (i % 3) + 1,
    totalInstallments: 3,
  };
});

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'bus_approaching', title: 'الحافلة تقترب من المنزل', description: 'الحافلة MST-001 على بعد 300 متر من موقعك', timestamp: 'قبل دقيقتين', read: false, studentName: 'عبدالله العتيبي', tripId: 't1' },
  { id: 'n2', type: 'student_boarded', title: 'تم صعود الطالبة إلى الحافلة', description: 'سارة الشهري صعدت إلى الحافلة MST-001', timestamp: 'قبل 8 دقائق', read: false, studentName: 'سارة الشهري', tripId: 't1' },
  { id: 'n3', type: 'trip_started', title: 'بدأت رحلة النقل', description: 'الرحلة الصباحية للحافلة MST-001 بدأت من الساعة 06:30', timestamp: 'قبل 35 دقيقة', read: true, tripId: 't1' },
  { id: 'n4', type: 'gps_lost', title: 'انقطاع إشارة GPS', description: 'الحافلة MST-004 فقدت الاتصال بالأقمار الصناعية', timestamp: 'قبل 12 دقيقة', read: false, tripId: 't3' },
  { id: 'n5', type: 'financial_suspension', title: 'إيقاف الخدمة المالي', description: 'تم إيقاف خدمة النقل للطالب ترقي الشمري لعدم سداد الرسوم', timestamp: 'قبل ساعة', read: true, studentName: 'ترقي الشمري' },
  { id: 'n6', type: 'trip_completed', title: 'اكتملت رحلة النقل', description: 'الحافلة MST-006 أكملت الرحلة الصباحية بنجاح', timestamp: 'قبل 30 دقيقة', read: true, tripId: 't4' },
  { id: 'n7', type: 'absence_reported', title: 'تقرير غياب', description: 'ولي أمر الطالب أحمد العنزي أبلغ عن غياب اليوم', timestamp: 'قبل 3 ساعات', read: true, studentName: 'أحمد العنزي' },
  { id: 'n8', type: 'emergency_termination', title: 'إنهاء طارئ للرحلة', description: 'تم إنهاء رحلة الحافلة MST-003 بسبب عطل ميكانيكي', timestamp: 'قبل 24 ساعة', read: true, tripId: 't5' },
];

export const subscriptionPlans = [
  { id: 'plan1', name: 'الباقة الابتدائية', nameEn: 'Starter', maxBuses: 5, maxStudents: 150, priceMonthly: 1200, features: ['تتبع أساسي', 'إدارة الطلاب', 'تقارير شهرية'], color: '#16845B' },
  { id: 'plan2', name: 'الباقة الاحترافية', nameEn: 'Professional', maxBuses: 20, maxStudents: 600, priceMonthly: 2800, features: ['تتبع مباشر', 'إشعارات ولي الأمر', 'تقارير متقدمة', 'دعم فني'], color: '#4285B8' },
  { id: 'plan3', name: 'باقة المؤسسات', nameEn: 'Enterprise', maxBuses: 50, maxStudents: 2000, priceMonthly: 5200, features: ['كل المميزات', 'تكامل مخصص', 'مدير حساب مخصص', 'تدريب الفريق'], color: '#C9A45C' },
];

// Helper functions
export function getBusById(id: string) {
  return buses.find(b => b.id === id);
}
export function getDriverById(id: string) {
  return drivers.find(d => d.id === id);
}
export function getSupervisorById(id: string) {
  return supervisors.find(s => s.id === id);
}
export function getStudentsByBus(busId: string) {
  return students.filter(s => s.busId === busId);
}
export function getTripsByBus(busId: string) {
  return trips.filter(t => t.busId === busId);
}
export function getParentById(id: string) {
  return parents.find(p => p.id === id);
}
export function getStudentsByParent(parentId: string) {
  return students.filter(s => s.parentId === parentId);
}
export function getSchoolById(id: string) {
  return schools.find(s => s.id === id);
}

export const platformStats = {
  totalSchools: schools.length,
  activeSchools: schools.filter(s => s.status === 'active').length,
  trialSchools: schools.filter(s => s.status === 'trial').length,
  totalBuses: buses.length,
  totalStudents: students.length,
  activeTrips: trips.filter(t => t.status === 'active').length,
  totalRevenue: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
  outstandingBalance: invoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
  monthlyGrowth: 12.5,
  schoolGrowthData: [
    { month: 'يونيو', value: 2 },
    { month: 'يوليو', value: 3 },
    { month: 'أغسطس', value: 4 },
    { month: 'سبتمبر', value: 4 },
    { month: 'أكتوبر', value: 5 },
    { month: 'نوفمبر', value: 5 },
  ],
  revenueData: [
    { month: 'يونيو', value: 8400 },
    { month: 'يوليو', value: 9600 },
    { month: 'أغسطس', value: 12100 },
    { month: 'سبتمبر', value: 14900 },
    { month: 'أكتوبر', value: 16100 },
    { month: 'نوفمبر', value: 16100 },
  ],
};

export const transportStats = {
  totalTrips: trips.length,
  activeTrips: trips.filter(t => t.status === 'active').length,
  completedToday: trips.filter(t => t.status === 'completed').length,
  offlineBuses: buses.filter(b => b.status === 'maintenance').length,
  totalStudents: students.length,
  boardedStudents: trips.reduce((s, t) => s + t.boardedCount, 0),
  absentToday: 3,
  suspendedStudents: students.filter(s => s.serviceStatus === 'suspended').length,
  onTimeRate: 94.2,
};
