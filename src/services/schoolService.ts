import { supabase } from './supabaseClient';
import { getSchool } from './db';
import type { School } from '@/types';

export async function setSchoolStatus(
  schoolId: string,
  status: School['status'],
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('schools')
    .update({ status })
    .eq('id', schoolId)
    .select('id, status');

  if (error) return { success: false, error: 'تعذر تحديث حالة المدرسة' };
  if (!data || data.length === 0) return { success: false, error: 'ليست لديك صلاحية تعديل هذه المدرسة' };

  const school = getSchool(schoolId);
  if (school) school.status = status;
  return { success: true };
}
