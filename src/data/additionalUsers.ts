import type { User } from '@/types';

// Additional users referenced by students, teachers, guardians
export const additionalUsers: User[] = [
  // Students (usr-13 to usr-33)
  { id: 'usr-13', nationalId: '1000000013', name: 'سارة عبدالله القحطاني', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-14', nationalId: '1000000014', name: 'فهد ناصر العتيبي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-15', nationalId: '1000000015', name: 'لمى خالد الدوسري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-16', nationalId: '1000000016', name: 'عبدالعزيز محمد الشهري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-17', nationalId: '1000000017', name: 'يوسف إبراهيم الحربي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-18', nationalId: '1000000018', name: 'دانة سعد المطيري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-19', nationalId: '1000000019', name: 'سلطان فهد العنزي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-20', nationalId: '1000000020', name: 'رغد ماجد السبيعي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-21', nationalId: '1000000021', name: 'تركي نوفل البقمي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-22', nationalId: '1000000022', name: 'جود أحمد الغامدي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-23', nationalId: '1000000023', name: 'راكان سلطان القرني', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-24', nationalId: '1000000024', name: 'تالا راشد الزهراني', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-25', nationalId: '1000000025', name: 'بدر وليد الحازمي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-26', nationalId: '1000000026', name: 'ميرا عادل الشمري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-27', nationalId: '1000000027', name: 'زيد عمرو العتيبي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-28', nationalId: '1000000028', name: 'أمل طارق السهلي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-29', nationalId: '1000000029', name: 'غلا ثامر المطيري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-30', nationalId: '1000000030', name: 'مى ماجد الدوسري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-31', nationalId: '1000000031', name: 'كامل ربيع الحربي', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-32', nationalId: '1000000032', name: 'عاصم سعد الشهري', avatarColor: '#0284c7', loginEnabled: false },
  { id: 'usr-33', nationalId: '1000000033', name: 'نورة بدر العنزي', avatarColor: '#0284c7', loginEnabled: false },
  // Guardians (usr-34 to usr-42)
  { id: 'usr-34', nationalId: '1000000034', name: 'د. ماجد بن سعد القحطاني', phone: '0551112222', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-35', nationalId: '1000000035', name: 'أ. منيرة بنت فهد الدوسري', phone: '0563334444', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-36', nationalId: '1000000036', name: 'م. راشد بن علي العتيبي', phone: '0545556666', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-37', nationalId: '1000000037', name: 'أ. عبدالعزيز بن ناصر الحربي', phone: '0537778888', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-38', nationalId: '1000000038', name: 'د. سامي بن خالد المطيري', phone: '0529990000', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-39', nationalId: '1000000039', name: 'أ. وليد بن صالح الشمري', phone: '0501113333', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-40', nationalId: '1000000040', name: 'م. أحمد بن راشد الزهراني', phone: '0512224444', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-41', nationalId: '1000000041', name: 'أ. بدر بن فواز السهلي', phone: '0563335555', avatarColor: '#ea580c', loginEnabled: false },
  { id: 'usr-42', nationalId: '1000000042', name: 'أ. مازن بن طلال الدوسري', phone: '0554446666', avatarColor: '#ea580c', loginEnabled: false },
  // Teachers (usr-43 to usr-48)
  { id: 'usr-43', nationalId: '1000000043', name: 'أ. سلمان بن حمد القرني', phone: '0502223333', avatarColor: '#be185d', loginEnabled: false },
  { id: 'usr-44', nationalId: '1000000044', name: 'أ. عبدالرحمن بن عثمان الغامدي', phone: '0503334444', avatarColor: '#be185d', loginEnabled: false },
  { id: 'usr-45', nationalId: '1000000045', name: 'أ. سارة بنت محمد الحازمي', phone: '0504445555', avatarColor: '#be185d', loginEnabled: false },
  { id: 'usr-46', nationalId: '1000000046', name: 'أ. خالد بن عبدالله الشمري', phone: '0505556666', avatarColor: '#be185d', loginEnabled: false },
  { id: 'usr-47', nationalId: '1000000047', name: 'أ. ريم بنت أحمد السهلي', phone: '0506667777', avatarColor: '#be185d', loginEnabled: false },
  { id: 'usr-48', nationalId: '1000000048', name: 'أ. نوال بنت سعد المطيري', phone: '0507778888', avatarColor: '#be185d', loginEnabled: false },
];
