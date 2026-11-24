/*
# MASAR School Management System — Core Schema (Part 1: Platform & Academic Structure)

## Overview
This migration creates the foundational tables for the MASAR multi-tenant school management platform.
It establishes platform-level entities (schools, branches), academic structure (years, terms, periods,
stages, grades, sections, subjects), and the RBAC system (roles, memberships).

## New Tables

### RBAC (created first — referenced by other tables' policies)
- `roles` — Role definitions with name, scope (platform/school/branch), permissions array, and status.
- `school_memberships` — Links users to schools with a role, date range, and status.
- `membership_branches` — Junction table for branch-scoped memberships (empty = all branches).

### Platform Structure
- `schools` — Top-level tenant entities with unique code, status, and brand color.
- `branches` — Physical locations belonging to a school, with code and status.

### Academic Structure
- `academic_years` — Year labels scoped to school, with date range and status.
- `terms` — Semesters within an academic year, sequenced with date ranges.
- `periods` — Sub-divisions of a term, sequenced with date ranges.
- `stages` — Educational stages scoped to school, sequenced.
- `grades` — Specific grades within a stage, scoped to school, sequenced.
- `sections` — Class sections within a grade/branch/year, with capacity and status.
- `subjects` — Course subjects scoped to school, with code and status.
- `subject_stages` — Many-to-many junction between subjects and stages.

## Security
- RLS enabled on ALL tables.
- Policies scoped to `authenticated` users.
- Platform-level tables (schools, branches, roles) readable by all authenticated users.
- School-scoped tables readable by users with an active membership in that school.
- Write operations restricted to platform admins and school managers.

## Important Notes
1. All tables created first, then policies applied — policies reference other tables via subqueries.
2. All tables use UUID primary keys with `gen_random_uuid()` defaults.
3. Foreign keys use `ON DELETE CASCADE` for child tables.
4. The `permissions` column on roles is a `text[]` array storing permission strings.
5. `school_memberships.user_id` defaults to `auth.uid()` for owner-scoped inserts.
*/

-- ============================================================
-- STEP 1: CREATE ALL TABLES (no policies yet)
-- ============================================================

-- Roles (no FK dependencies)
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('platform', 'school', 'branch')),
  role_key text NOT NULL UNIQUE,
  permissions text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Schools (no FK dependencies)
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  logo_color text NOT NULL DEFAULT '#0d9488',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Branches (depends on schools)
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, code)
);

-- School Memberships (depends on schools, roles)
CREATE TABLE IF NOT EXISTS school_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  role_key text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'ended')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Membership-Branches junction (depends on school_memberships, branches)
CREATE TABLE IF NOT EXISTS membership_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES school_memberships(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  UNIQUE(membership_id, branch_id)
);

-- Academic Years (depends on schools)
CREATE TABLE IF NOT EXISTS academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  label text NOT NULL,
  status text NOT NULL DEFAULT 'preparing' CHECK (status IN ('active', 'closed', 'preparing')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, label)
);

-- Terms (depends on academic_years)
CREATE TABLE IF NOT EXISTS terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  sequence int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'preparing' CHECK (status IN ('active', 'closed', 'preparing')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(academic_year_id, sequence)
);

-- Periods (depends on terms)
CREATE TABLE IF NOT EXISTS periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id uuid NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  name text NOT NULL,
  sequence int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'closed' CHECK (status IN ('active', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(term_id, sequence)
);

-- Stages (depends on schools)
CREATE TABLE IF NOT EXISTS stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  sequence int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, sequence)
);

-- Grades (depends on schools, stages)
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  name text NOT NULL,
  sequence int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, sequence)
);

-- Sections (depends on schools, branches, academic_years, grades)
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  grade_id uuid NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity int NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Subjects (depends on schools)
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, code)
);

-- Subject-Stages junction (depends on subjects, stages)
CREATE TABLE IF NOT EXISTS subject_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  UNIQUE(subject_id, stage_id)
);

-- ============================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_stages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: CREATE POLICIES
-- ============================================================

-- Helper: a user is a platform admin if they have an active membership with role_key = 'platform_super_admin'
-- Helper: a user is a school manager of school X if they have an active membership with role_key = 'school_manager' and school_id = X

-- --- SCHOOLS ---
DROP POLICY IF EXISTS "select_schools_authenticated" ON schools;
CREATE POLICY "select_schools_authenticated" ON schools FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_schools_platform_admin" ON schools;
CREATE POLICY "insert_schools_platform_admin" ON schools FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

DROP POLICY IF EXISTS "update_schools_platform_admin" ON schools;
CREATE POLICY "update_schools_platform_admin" ON schools FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

DROP POLICY IF EXISTS "delete_schools_platform_admin" ON schools;
CREATE POLICY "delete_schools_platform_admin" ON schools FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

-- --- BRANCHES ---
DROP POLICY IF EXISTS "select_branches_authenticated" ON branches;
CREATE POLICY "select_branches_authenticated" ON branches FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_branches_manager" ON branches;
CREATE POLICY "insert_branches_manager" ON branches FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = branches.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_branches_manager" ON branches;
CREATE POLICY "update_branches_manager" ON branches FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = branches.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = branches.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_branches_manager" ON branches;
CREATE POLICY "delete_branches_manager" ON branches FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = branches.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- ROLES ---
DROP POLICY IF EXISTS "select_roles_authenticated" ON roles;
CREATE POLICY "select_roles_authenticated" ON roles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_roles_platform_admin" ON roles;
CREATE POLICY "insert_roles_platform_admin" ON roles FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

DROP POLICY IF EXISTS "update_roles_platform_admin" ON roles;
CREATE POLICY "update_roles_platform_admin" ON roles FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

DROP POLICY IF EXISTS "delete_roles_platform_admin" ON roles;
CREATE POLICY "delete_roles_platform_admin" ON roles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM school_memberships sm WHERE sm.user_id = auth.uid() AND sm.status = 'active' AND sm.role_key = 'platform_super_admin')
  );

-- --- SCHOOL MEMBERSHIPS ---
DROP POLICY IF EXISTS "select_memberships_self_or_manager" ON school_memberships;
CREATE POLICY "select_memberships_self_or_manager" ON school_memberships FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM school_memberships sm2
      WHERE sm2.user_id = auth.uid() AND sm2.status = 'active'
        AND sm2.school_id = school_memberships.school_id
        AND sm2.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "insert_memberships_manager" ON school_memberships;
CREATE POLICY "insert_memberships_manager" ON school_memberships FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = school_memberships.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_memberships_manager" ON school_memberships;
CREATE POLICY "update_memberships_manager" ON school_memberships FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = school_memberships.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = school_memberships.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_memberships_manager" ON school_memberships;
CREATE POLICY "delete_memberships_manager" ON school_memberships FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = school_memberships.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- MEMBERSHIP BRANCHES ---
DROP POLICY IF EXISTS "select_membership_branches_self_or_manager" ON membership_branches;
CREATE POLICY "select_membership_branches_self_or_manager" ON membership_branches FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.id = membership_branches.membership_id
        AND (sm.user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM school_memberships sm2
          WHERE sm2.user_id = auth.uid() AND sm2.status = 'active'
            AND sm2.school_id = sm.school_id
            AND sm2.role_key IN ('platform_super_admin', 'school_manager')
        ))
    )
  );

DROP POLICY IF EXISTS "insert_membership_branches_manager" ON membership_branches;
CREATE POLICY "insert_membership_branches_manager" ON membership_branches FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.id = membership_branches.membership_id
        AND sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_membership_branches_manager" ON membership_branches;
CREATE POLICY "delete_membership_branches_manager" ON membership_branches FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.id = membership_branches.membership_id
        AND sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- ACADEMIC YEARS ---
DROP POLICY IF EXISTS "select_academic_years_school_member" ON academic_years;
CREATE POLICY "select_academic_years_school_member" ON academic_years FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = academic_years.school_id
    )
  );

DROP POLICY IF EXISTS "insert_academic_years_manager" ON academic_years;
CREATE POLICY "insert_academic_years_manager" ON academic_years FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = academic_years.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_academic_years_manager" ON academic_years;
CREATE POLICY "update_academic_years_manager" ON academic_years FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = academic_years.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = academic_years.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_academic_years_manager" ON academic_years;
CREATE POLICY "delete_academic_years_manager" ON academic_years FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = academic_years.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TERMS ---
DROP POLICY IF EXISTS "select_terms_school_member" ON terms;
CREATE POLICY "select_terms_school_member" ON terms FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND ay.id = terms.academic_year_id
    )
  );

DROP POLICY IF EXISTS "insert_terms_manager" ON terms;
CREATE POLICY "insert_terms_manager" ON terms FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND ay.id = terms.academic_year_id
    )
  );

DROP POLICY IF EXISTS "update_terms_manager" ON terms;
CREATE POLICY "update_terms_manager" ON terms FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND ay.id = terms.academic_year_id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND ay.id = terms.academic_year_id
    )
  );

DROP POLICY IF EXISTS "delete_terms_manager" ON terms;
CREATE POLICY "delete_terms_manager" ON terms FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND ay.id = terms.academic_year_id
    )
  );

-- --- PERIODS ---
DROP POLICY IF EXISTS "select_periods_school_member" ON periods;
CREATE POLICY "select_periods_school_member" ON periods FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      JOIN terms t ON t.academic_year_id = ay.id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND t.id = periods.term_id
    )
  );

DROP POLICY IF EXISTS "insert_periods_manager" ON periods;
CREATE POLICY "insert_periods_manager" ON periods FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      JOIN terms t ON t.academic_year_id = ay.id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND t.id = periods.term_id
    )
  );

DROP POLICY IF EXISTS "update_periods_manager" ON periods;
CREATE POLICY "update_periods_manager" ON periods FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      JOIN terms t ON t.academic_year_id = ay.id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND t.id = periods.term_id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      JOIN terms t ON t.academic_year_id = ay.id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND t.id = periods.term_id
    )
  );

DROP POLICY IF EXISTS "delete_periods_manager" ON periods;
CREATE POLICY "delete_periods_manager" ON periods FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN academic_years ay ON ay.school_id = sm.school_id
      JOIN terms t ON t.academic_year_id = ay.id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND t.id = periods.term_id
    )
  );

-- --- STAGES ---
DROP POLICY IF EXISTS "select_stages_school_member" ON stages;
CREATE POLICY "select_stages_school_member" ON stages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = stages.school_id
    )
  );

DROP POLICY IF EXISTS "insert_stages_manager" ON stages;
CREATE POLICY "insert_stages_manager" ON stages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = stages.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_stages_manager" ON stages;
CREATE POLICY "update_stages_manager" ON stages FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = stages.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = stages.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_stages_manager" ON stages;
CREATE POLICY "delete_stages_manager" ON stages FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = stages.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- GRADES ---
DROP POLICY IF EXISTS "select_grades_school_member" ON grades;
CREATE POLICY "select_grades_school_member" ON grades FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = grades.school_id
    )
  );

DROP POLICY IF EXISTS "insert_grades_manager" ON grades;
CREATE POLICY "insert_grades_manager" ON grades FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = grades.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_grades_manager" ON grades;
CREATE POLICY "update_grades_manager" ON grades FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = grades.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = grades.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_grades_manager" ON grades;
CREATE POLICY "delete_grades_manager" ON grades FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = grades.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- SECTIONS ---
DROP POLICY IF EXISTS "select_sections_school_member" ON sections;
CREATE POLICY "select_sections_school_member" ON sections FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = sections.school_id
    )
  );

DROP POLICY IF EXISTS "insert_sections_manager" ON sections;
CREATE POLICY "insert_sections_manager" ON sections FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = sections.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_sections_manager" ON sections;
CREATE POLICY "update_sections_manager" ON sections FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = sections.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = sections.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_sections_manager" ON sections;
CREATE POLICY "delete_sections_manager" ON sections FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = sections.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- SUBJECTS ---
DROP POLICY IF EXISTS "select_subjects_school_member" ON subjects;
CREATE POLICY "select_subjects_school_member" ON subjects FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = subjects.school_id
    )
  );

DROP POLICY IF EXISTS "insert_subjects_manager" ON subjects;
CREATE POLICY "insert_subjects_manager" ON subjects FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = subjects.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_subjects_manager" ON subjects;
CREATE POLICY "update_subjects_manager" ON subjects FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = subjects.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = subjects.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_subjects_manager" ON subjects;
CREATE POLICY "delete_subjects_manager" ON subjects FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.school_id = subjects.school_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- SUBJECT_STAGES ---
DROP POLICY IF EXISTS "select_subject_stages_school_member" ON subject_stages;
CREATE POLICY "select_subject_stages_school_member" ON subject_stages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sub.id = subject_stages.subject_id
    )
  );

DROP POLICY IF EXISTS "insert_subject_stages_manager" ON subject_stages;
CREATE POLICY "insert_subject_stages_manager" ON subject_stages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND sub.id = subject_stages.subject_id
    )
  );

DROP POLICY IF EXISTS "delete_subject_stages_manager" ON subject_stages;
CREATE POLICY "delete_subject_stages_manager" ON subject_stages FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN subjects sub ON sub.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
        AND sub.id = subject_stages.subject_id
    )
  );

-- ============================================================
-- STEP 4: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_branches_school ON branches(school_id);
CREATE INDEX IF NOT EXISTS idx_academic_years_school ON academic_years(school_id);
CREATE INDEX IF NOT EXISTS idx_terms_year ON terms(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_periods_term ON periods(term_id);
CREATE INDEX IF NOT EXISTS idx_stages_school ON stages(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_school ON grades(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_stage ON grades(stage_id);
CREATE INDEX IF NOT EXISTS idx_sections_school ON sections(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_branch ON sections(branch_id);
CREATE INDEX IF NOT EXISTS idx_sections_year ON sections(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_sections_grade ON sections(grade_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_subject_stages_subject ON subject_stages(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_stages_stage ON subject_stages(stage_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_school ON school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_membership_branches_membership ON membership_branches(membership_id);
