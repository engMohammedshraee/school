-- Add anon SELECT policies for all tables so the frontend can load data before login (demo/prototype).
-- The anon key is used for initial data loading; write operations remain restricted to authenticated users.

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'academic_years','attendance_records','audit_logs','branches','enrollments',
    'grades','guardian_links','guardians','membership_branches','periods',
    'profiles','roles','school_memberships','schools','sections','stages',
    'student_documents','students','subject_stages','subjects','supervisor_assignments',
    'teacher_branch_assignments','teacher_employments','teacher_qualifications',
    'teachers','teaching_assignments','terms','timetable_slots'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT TO anon, authenticated USING (true);',
      'anon_select_' || t, t
    );
  END LOOP;
END $$;
