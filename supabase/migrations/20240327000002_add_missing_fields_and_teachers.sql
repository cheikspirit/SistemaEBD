-- Add missing columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Create Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create Policies for teachers
CREATE POLICY "Allow public read on teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on teachers" ON teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on teachers" ON teachers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on teachers" ON teachers FOR DELETE USING (true);

-- Insert initial teachers from the mock data if they don't exist
INSERT INTO teachers (name, email) VALUES
('Prof. João Silva', 'joao@email.com'),
('Profa. Maria Oliveira', 'maria@email.com'),
('Ana Paula Costa', 'ana@email.com'),
('Ricardo Mendes', 'ricardo@email.com')
ON CONFLICT DO NOTHING;
