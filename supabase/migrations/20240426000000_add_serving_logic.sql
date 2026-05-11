-- Add is_serving to attendance table
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS is_serving BOOLEAN DEFAULT FALSE;

-- Ensure other columns from ebd-app.tsx exist (they seemed missing in initial_schema migration)
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS teacher_name TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS lesson_theme TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS biblical_reference TEXT;

-- Add student_id to teachers table to link them to their enrollment as a student
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id) ON DELETE SET NULL;
