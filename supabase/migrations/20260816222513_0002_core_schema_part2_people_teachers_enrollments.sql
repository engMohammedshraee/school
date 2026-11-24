/*
# MASAR Schema — Part 2: People, Teachers, Enrollments, Guardians

## Overview
Creates tables for user profiles, students, guardians, teachers, enrollments,
and all teacher-related assignment/qualification tables.

## New Tables

### People
- `profiles` — Extended user data linked to `auth.users` (national_id, name, email, phone, avatar_color, login_enabled, birth_date).
- `students` — Student records linked to a profile, with student_number, gender, blood_type.
- `guardians` — Guardian records linked to a profile, with phone and occupation.
- `guardian_links` — Links guardians to students with a relationship type.

### Enrollments
- `enrollments` — Student placement in a school/branch/year/grade/section, with status and date range.
  Preserves history — transfers create new rows, never overwrite old ones.

### Teachers
- `teachers` — Teacher records linked to a profile, with employee_number, specialization, status.
- `teacher_employments` — Employment history linking teachers to schools, with date range and status.
- `teacher_branch_assignments` — Branch assignment history for teachers, with date range and status.
- `teacher_qualifications` — Links teachers to subjects and stages they're qualified to teach.
- `teaching_assignments` — Assigns teachers to teach a subject in a specific section/grade/branch/year/term.
- `supervisor_assignments` — Section supervisor history (who supervised a section and when).

## Security
- RLS enabled on all tables.
- SELECT: users can read data within schools where they have active membership.
- INSERT/UPDATE/DELETE: restricted to platform admins, school managers, and student affairs (for students/guardians/enrollments/documents).

## Important Notes
1. `profiles` table extends `auth.users` with a FK `user_id REFERENCES auth.users(id)`.
2. Enrollment history is preserved — transfers add new rows, old rows get status='transferred' or 'completed'.
3. Teacher employments and branch assignments track history with date ranges.
4. Supervisor assignments are separate from sections (normalized vs. the frontend's embedded array).
*/

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  national_id text NOT NULL UNIQUE,
  name text NOT NULL,
  email text,
  phone text,
  birth_date date,
  avatar_color text NOT NULL DEFAULT '#0284c7',
  login_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_number text NOT NULL UNIQUE,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  blood_type text,
  birth_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Guardians
CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  occupation text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Guardian Links
CREATE TABLE IF NOT EXISTS guardian_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship text NOT NULL CHECK (relationship IN ('father', 'mother', 'brother', 'uncle', 'guardian', 'other')),
  relationship_label text NOT NULL,
  UNIQUE(guardian_id, student_id)
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  grade_id uuid NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred', 'ended')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teachers
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_number text NOT NULL UNIQUE,
  specialization text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teacher Employments
CREATE TABLE IF NOT EXISTS teacher_employments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teacher Branch Assignments
CREATE TABLE IF NOT EXISTS teacher_branch_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teacher Qualifications
CREATE TABLE IF NOT EXISTS teacher_qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, subject_id, stage_id)
);

-- Teaching Assignments
CREATE TABLE IF NOT EXISTS teaching_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  grade_id uuid NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Supervisor Assignments
CREATE TABLE IF NOT EXISTS supervisor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_employments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_branch_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

-- --- PROFILES ---
-- Users can read their own profile; managers can read profiles of users in their school
DROP POLICY IF EXISTS "select_profiles_self_or_school_member" ON profiles;
CREATE POLICY "select_profiles_self_or_school_member" ON profiles FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
      AND (
        -- School managers/admins can see all profiles in their school
        EXISTS (
          SELECT 1 FROM school_memberships sm2
          WHERE sm2.user_id = profiles.user_id AND sm2.status = 'active'
            AND sm2.school_id = sm.school_id
        )
      )
    )
  );

DROP POLICY IF EXISTS "insert_profiles_admin" ON profiles;
CREATE POLICY "insert_profiles_admin" ON profiles FOR INSERT
  TO authenticated WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "update_profiles_self_or_admin" ON profiles;
CREATE POLICY "update_profiles_self_or_admin" ON profiles FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  ) WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

-- --- STUDENTS ---
-- Students readable by users with school membership where the student is enrolled
DROP POLICY IF EXISTS "select_students_school_member" ON students;
CREATE POLICY "select_students_school_member" ON students FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN school_memberships sm ON sm.school_id = e.school_id
      WHERE e.student_id = students.id AND sm.user_id = auth.uid() AND sm.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN guardians g ON g.id = gl.guardian_id
      WHERE gl.student_id = students.id AND g.user_id = auth.uid()
    )
    OR students.user_id = auth.uid()
  );

DROP POLICY IF EXISTS "insert_students_staff" ON students;
CREATE POLICY "insert_students_staff" ON students FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "update_students_staff" ON students;
CREATE POLICY "update_students_staff" ON students FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = students.id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = students.id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "delete_students_staff" ON students;
CREATE POLICY "delete_students_staff" ON students FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = students.id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- GUARDIANS ---
DROP POLICY IF EXISTS "select_guardians_school_member" ON guardians;
CREATE POLICY "select_guardians_school_member" ON guardians FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN students s ON s.id = gl.student_id
      JOIN enrollments e ON e.student_id = s.id
      JOIN school_memberships sm ON sm.school_id = e.school_id
      WHERE gl.guardian_id = guardians.id AND sm.user_id = auth.uid() AND sm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "insert_guardians_staff" ON guardians;
CREATE POLICY "insert_guardians_staff" ON guardians FOR INSERT
  TO authenticated WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "update_guardians_staff" ON guardians;
CREATE POLICY "update_guardians_staff" ON guardians FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  ) WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "delete_guardians_staff" ON guardians;
CREATE POLICY "delete_guardians_staff" ON guardians FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- GUARDIAN LINKS ---
DROP POLICY IF EXISTS "select_guardian_links_school_member" ON guardian_links;
CREATE POLICY "select_guardian_links_school_member" ON guardian_links FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM guardians g
      WHERE g.id = guardian_links.guardian_id AND g.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = guardian_links.student_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      JOIN school_memberships sm ON sm.school_id = e.school_id
      WHERE e.student_id = guardian_links.student_id AND sm.user_id = auth.uid() AND sm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "insert_guardian_links_staff" ON guardian_links;
CREATE POLICY "insert_guardian_links_staff" ON guardian_links FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "update_guardian_links_staff" ON guardian_links;
CREATE POLICY "update_guardian_links_staff" ON guardian_links FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "delete_guardian_links_staff" ON guardian_links;
CREATE POLICY "delete_guardian_links_staff" ON guardian_links FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

-- --- ENROLLMENTS ---
DROP POLICY IF EXISTS "select_enrollments_school_member" ON enrollments;
CREATE POLICY "select_enrollments_school_member" ON enrollments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = enrollments.school_id
    )
    OR EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = enrollments.student_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN guardians g ON g.id = gl.guardian_id
      WHERE gl.student_id = enrollments.student_id AND g.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_enrollments_staff" ON enrollments;
CREATE POLICY "insert_enrollments_staff" ON enrollments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = enrollments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "update_enrollments_staff" ON enrollments;
CREATE POLICY "update_enrollments_staff" ON enrollments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = enrollments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = enrollments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs')
    )
  );

DROP POLICY IF EXISTS "delete_enrollments_staff" ON enrollments;
CREATE POLICY "delete_enrollments_staff" ON enrollments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = enrollments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TEACHERS ---
DROP POLICY IF EXISTS "select_teachers_school_member" ON teachers;
CREATE POLICY "select_teachers_school_member" ON teachers FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM teacher_employments te
      JOIN school_memberships sm ON sm.school_id = te.school_id
      WHERE te.teacher_id = teachers.id AND sm.user_id = auth.uid() AND sm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "insert_teachers_staff" ON teachers;
CREATE POLICY "insert_teachers_staff" ON teachers FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_teachers_staff" ON teachers;
CREATE POLICY "update_teachers_staff" ON teachers FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM teacher_employments te
      JOIN school_memberships sm ON sm.school_id = te.school_id
      WHERE te.teacher_id = teachers.id AND sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM teacher_employments te
      JOIN school_memberships sm ON sm.school_id = te.school_id
      WHERE te.teacher_id = teachers.id AND sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_teachers_staff" ON teachers;
CREATE POLICY "delete_teachers_staff" ON teachers FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM teacher_employments te
      JOIN school_memberships sm ON sm.school_id = te.school_id
      WHERE te.teacher_id = teachers.id AND sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TEACHER EMPLOYMENTS ---
DROP POLICY IF EXISTS "select_teacher_employments_school_member" ON teacher_employments;
CREATE POLICY "select_teacher_employments_school_member" ON teacher_employments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = teacher_employments.school_id
    )
  );

DROP POLICY IF EXISTS "insert_teacher_employments_manager" ON teacher_employments;
CREATE POLICY "insert_teacher_employments_manager" ON teacher_employments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = teacher_employments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_teacher_employments_manager" ON teacher_employments;
CREATE POLICY "update_teacher_employments_manager" ON teacher_employments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = teacher_employments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = teacher_employments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_teacher_employments_manager" ON teacher_employments;
CREATE POLICY "delete_teacher_employments_manager" ON teacher_employments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = teacher_employments.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TEACHER BRANCH ASSIGNMENTS ---
DROP POLICY IF EXISTS "select_teacher_branch_assignments_school_member" ON teacher_branch_assignments;
CREATE POLICY "select_teacher_branch_assignments_school_member" ON teacher_branch_assignments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN branches b ON b.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND b.id = teacher_branch_assignments.branch_id
    )
  );

DROP POLICY IF EXISTS "insert_teacher_branch_assignments_manager" ON teacher_branch_assignments;
CREATE POLICY "insert_teacher_branch_assignments_manager" ON teacher_branch_assignments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN branches b ON b.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND b.id = teacher_branch_assignments.branch_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_teacher_branch_assignments_manager" ON teacher_branch_assignments;
CREATE POLICY "update_teacher_branch_assignments_manager" ON teacher_branch_assignments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN branches b ON b.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND b.id = teacher_branch_assignments.branch_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN branches b ON b.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND b.id = teacher_branch_assignments.branch_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_teacher_branch_assignments_manager" ON teacher_branch_assignments;
CREATE POLICY "delete_teacher_branch_assignments_manager" ON teacher_branch_assignments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN branches b ON b.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND b.id = teacher_branch_assignments.branch_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TEACHER QUALIFICATIONS ---
DROP POLICY IF EXISTS "select_teacher_qualifications_school_member" ON teacher_qualifications;
CREATE POLICY "select_teacher_qualifications_school_member" ON teacher_qualifications FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sub.id = teacher_qualifications.subject_id
    )
  );

DROP POLICY IF EXISTS "insert_teacher_qualifications_manager" ON teacher_qualifications;
CREATE POLICY "insert_teacher_qualifications_manager" ON teacher_qualifications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sub.id = teacher_qualifications.subject_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_teacher_qualifications_manager" ON teacher_qualifications;
CREATE POLICY "delete_teacher_qualifications_manager" ON teacher_qualifications FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sub.id = teacher_qualifications.subject_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TEACHING ASSIGNMENTS ---
DROP POLICY IF EXISTS "select_teaching_assignments_school_member" ON teaching_assignments;
CREATE POLICY "select_teaching_assignments_school_member" ON teaching_assignments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = teaching_assignments.academic_year_id
    )
  );

DROP POLICY IF EXISTS "insert_teaching_assignments_manager" ON teaching_assignments;
CREATE POLICY "insert_teaching_assignments_manager" ON teaching_assignments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = teaching_assignments.academic_year_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_teaching_assignments_manager" ON teaching_assignments;
CREATE POLICY "update_teaching_assignments_manager" ON teaching_assignments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = teaching_assignments.academic_year_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = teaching_assignments.academic_year_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_teaching_assignments_manager" ON teaching_assignments;
CREATE POLICY "delete_teaching_assignments_manager" ON teaching_assignments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = teaching_assignments.academic_year_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- SUPERVISOR ASSIGNMENTS ---
DROP POLICY IF EXISTS "select_supervisor_assignments_school_member" ON supervisor_assignments;
CREATE POLICY "select_supervisor_assignments_school_member" ON supervisor_assignments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = supervisor_assignments.section_id
    )
  );

DROP POLICY IF EXISTS "insert_supervisor_assignments_manager" ON supervisor_assignments;
CREATE POLICY "insert_supervisor_assignments_manager" ON supervisor_assignments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = supervisor_assignments.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_supervisor_assignments_manager" ON supervisor_assignments;
CREATE POLICY "update_supervisor_assignments_manager" ON supervisor_assignments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = supervisor_assignments.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = supervisor_assignments.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_supervisor_assignments_manager" ON supervisor_assignments;
CREATE POLICY "delete_supervisor_assignments_manager" ON supervisor_assignments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = supervisor_assignments.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_guardians_user ON guardians(user_id);
CREATE INDEX IF NOT EXISTS idx_guardian_links_guardian ON guardian_links(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_links_student ON guardian_links(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_school ON enrollments(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_branch ON enrollments(branch_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_year ON enrollments(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section ON enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_grade ON enrollments(grade_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_employments_teacher ON teacher_employments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_employments_school ON teacher_employments(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_branch_assignments_teacher ON teacher_branch_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_branch_assignments_branch ON teacher_branch_assignments(branch_id);
CREATE INDEX IF NOT EXISTS idx_teacher_qualifications_teacher ON teacher_qualifications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_teacher ON teaching_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_section ON teaching_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_year ON teaching_assignments(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_assignments_section ON supervisor_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_assignments_teacher ON supervisor_assignments(teacher_id);
