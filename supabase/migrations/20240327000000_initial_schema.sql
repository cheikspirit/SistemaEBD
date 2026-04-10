-- Create Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  teacher TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Biblical', 'Youth', 'Kids', 'Teens', 'Discipleship')),
  student_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  present BOOLEAN DEFAULT FALSE,
  has_bible BOOLEAN DEFAULT FALSE,
  has_magazine BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow public read/write for demo purposes, in production these should be restricted)
CREATE POLICY "Allow public read on classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on classes" ON classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on classes" ON classes FOR UPDATE USING (true);

CREATE POLICY "Allow public read on students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON students FOR UPDATE USING (true);

CREATE POLICY "Allow public read on attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance" ON attendance FOR UPDATE USING (true);

-- Function to update student count in classes
CREATE OR REPLACE FUNCTION update_class_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE classes SET student_count = student_count + 1 WHERE id = NEW.class_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE classes SET student_count = student_count - 1 WHERE id = OLD.class_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.class_id IS DISTINCT FROM NEW.class_id) THEN
      IF (OLD.class_id IS NOT NULL) THEN
        UPDATE classes SET student_count = student_count - 1 WHERE id = OLD.class_id;
      END IF;
      IF (NEW.class_id IS NOT NULL) THEN
        UPDATE classes SET student_count = student_count + 1 WHERE id = NEW.class_id;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for student count
CREATE TRIGGER tr_update_class_student_count
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW EXECUTE FUNCTION update_class_student_count();

-- Insert initial data
INSERT INTO classes (name, teacher, category, image_url) VALUES
('Adultos - Classe Bereana', 'Prof. João Silva', 'Biblical', 'https://picsum.photos/seed/ebd1/800/400'),
('Jovens - Radicais Livres', 'Profa. Maria Oliveira', 'Youth', 'https://picsum.photos/seed/ebd2/800/400'),
('Primários - Cordeirinhos', 'Ana Paula Costa', 'Kids', 'https://picsum.photos/seed/ebd3/800/400'),
('Adolescentes - Atalaias', 'Ricardo Mendes', 'Teens', 'https://picsum.photos/seed/ebd4/800/400');

-- Get class IDs for students (this is a bit tricky in a single script without variables, but we can use subqueries)
INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Ana Beatriz Oliveira', id, 'active', 'https://picsum.photos/seed/p1/100/100' FROM classes WHERE name = 'Primários - Cordeirinhos' LIMIT 1;

INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Lucas Mendes', id, 'active', 'https://picsum.photos/seed/p2/100/100' FROM classes WHERE name = 'Primários - Cordeirinhos' LIMIT 1;

INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Mariana Costa', id, 'inactive', 'https://picsum.photos/seed/p3/100/100' FROM classes WHERE name = 'Adolescentes - Atalaias' LIMIT 1;

INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Gabriel Souza', id, 'active', 'https://picsum.photos/seed/p4/100/100' FROM classes WHERE name = 'Adultos - Classe Bereana' LIMIT 1;

INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Carla Peixoto', id, 'active', 'https://picsum.photos/seed/p5/100/100' FROM classes WHERE name = 'Adultos - Classe Bereana' LIMIT 1;

INSERT INTO students (name, class_id, status, avatar_url)
SELECT 'Ricardo Silva', id, 'active', 'https://picsum.photos/seed/p6/100/100' FROM classes WHERE name = 'Adultos - Classe Bereana' LIMIT 1;
