/*
# MASAR Schema — Part 3: Operations (Attendance, Documents, Timetable, Audit Logs)

## Overview
Creates the operational tables for daily school management: attendance tracking,
student documents, timetable slots, and the immutable audit log.

## New Tables

### Attendance
- `attendance_records` — Daily attendance per student per section, with status (present/absent/late/excused) and date.
  Unique constraint on (section_id, student_id, date) prevents duplicate entries for the same day.

### Documents
- `student_documents` — Tracks required documents per student (birth certificate, photo, etc.) with status workflow
  (missing → received → under_review → accepted/rejected/needs_replacement) and optional notes.

### Timetable
- `timetable_slots` — Weekly schedule slots: each slot assigns a subject and teacher to a section on a specific
  day (0-4 = Sat-Wed) and period index, with start/end times.

### Audit Log
- `audit_logs` — Immutable record of all significant actions. Stores user_id, action description, school_id,
  branch_id, resource path, and timestamp. No UPDATE or DELETE policies — append-only by design.

## Security
- RLS enabled on all tables.
- SELECT: school members can read data within their school.
- INSERT/UPDATE: restricted to appropriate staff roles (student affairs, teachers for attendance, managers for timetable).
- audit_logs: INSERT-only (no update/delete) — truly append-only via RLS.

## Important Notes
1. Attendance has a unique constraint on (section_id, student_id, date) to prevent duplicates.
2. Audit logs are append-only — no UPDATE or DELETE policies exist, making them immutable at the RLS level.
3. Timetable day field uses 0-4 (Saturday through Wednesday) matching the Arabic school week.
*/

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section_id, student_id, date)
);

-- Student Documents
CREATE TABLE IF NOT EXISTS student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('birth_certificate', 'personal_photo', 'previous_certificate', 'transfer_document')),
  status text NOT NULL DEFAULT 'missing' CHECK (status IN ('missing', 'received', 'under_review', 'accepted', 'rejected', 'needs_replacement')),
  uploaded_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, type)
);

-- Timetable Slots
CREATE TABLE IF NOT EXISTS timetable_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  day int NOT NULL CHECK (day >= 0 AND day <= 4),
  period_index int NOT NULL CHECK (period_index >= 0 AND period_index <= 9),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section_id, day, period_index)
);

-- Audit Logs (append-only)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  action text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  resource text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

-- --- ATTENDANCE RECORDS ---
DROP POLICY IF EXISTS "select_attendance_school_member" ON attendance_records;
CREATE POLICY "select_attendance_school_member" ON attendance_records FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = attendance_records.section_id
    )
    OR EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance_records.student_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN guardians g ON g.id = gl.guardian_id
      WHERE gl.student_id = attendance_records.student_id AND g.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_attendance_staff" ON attendance_records;
CREATE POLICY "insert_attendance_staff" ON attendance_records FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = attendance_records.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'teacher', 'admin_staff')
    )
  );

DROP POLICY IF EXISTS "update_attendance_staff" ON attendance_records;
CREATE POLICY "update_attendance_staff" ON attendance_records FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = attendance_records.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'teacher', 'admin_staff')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = attendance_records.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'teacher', 'admin_staff')
    )
  );

DROP POLICY IF EXISTS "delete_attendance_manager" ON attendance_records;
CREATE POLICY "delete_attendance_manager" ON attendance_records FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = attendance_records.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- STUDENT DOCUMENTS ---
DROP POLICY IF EXISTS "select_documents_school_member" ON student_documents;
CREATE POLICY "select_documents_school_member" ON student_documents FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = student_documents.student_id
    )
    OR EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_documents.student_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM guardian_links gl
      JOIN guardians g ON g.id = gl.guardian_id
      WHERE gl.student_id = student_documents.student_id AND g.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_documents_staff" ON student_documents;
CREATE POLICY "insert_documents_staff" ON student_documents FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = student_documents.student_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'admin_staff')
    )
  );

DROP POLICY IF EXISTS "update_documents_staff" ON student_documents;
CREATE POLICY "update_documents_staff" ON student_documents FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = student_documents.student_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'admin_staff')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = student_documents.student_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager', 'student_affairs', 'admin_staff')
    )
  );

DROP POLICY IF EXISTS "delete_documents_manager" ON student_documents;
CREATE POLICY "delete_documents_manager" ON student_documents FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN enrollments e ON e.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND e.student_id = student_documents.student_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- TIMETABLE SLOTS ---
DROP POLICY IF EXISTS "select_timetable_school_member" ON timetable_slots;
CREATE POLICY "select_timetable_school_member" ON timetable_slots FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = timetable_slots.section_id
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.section_id = timetable_slots.section_id
        AND e.student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
        AND e.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM teaching_assignments ta
      JOIN teacher_employments te ON te.teacher_id = ta.teacher_id
      JOIN school_memberships sm ON sm.school_id = te.school_id
      WHERE ta.section_id = timetable_slots.section_id
        AND sm.user_id = auth.uid() AND sm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "insert_timetable_manager" ON timetable_slots;
CREATE POLICY "insert_timetable_manager" ON timetable_slots FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = timetable_slots.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "update_timetable_manager" ON timetable_slots;
CREATE POLICY "update_timetable_manager" ON timetable_slots FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = timetable_slots.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = timetable_slots.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

DROP POLICY IF EXISTS "delete_timetable_manager" ON timetable_slots;
CREATE POLICY "delete_timetable_manager" ON timetable_slots FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      JOIN sections sec ON sec.school_id = sm.school_id
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND sec.id = timetable_slots.section_id
        AND sm.role_key IN ('platform_super_admin', 'school_manager')
    )
  );

-- --- AUDIT LOGS (append-only: SELECT + INSERT only, no UPDATE/DELETE) ---
DROP POLICY IF EXISTS "select_audit_logs_school_member" ON audit_logs;
CREATE POLICY "select_audit_logs_school_member" ON audit_logs FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM school_memberships sm
      WHERE sm.user_id = auth.uid() AND sm.status = 'active'
        AND (sm.school_id = audit_logs.school_id OR audit_logs.school_id IS NULL)
    )
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "insert_audit_logs_authenticated" ON audit_logs;
CREATE POLICY "insert_audit_logs_authenticated" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_attendance_section ON attendance_records(section_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_documents_student ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_section ON timetable_slots(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_teacher ON timetable_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
