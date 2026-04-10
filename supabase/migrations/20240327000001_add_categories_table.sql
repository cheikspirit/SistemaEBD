-- Create Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#10b981', -- Default emerald color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial categories
INSERT INTO categories (name, color) VALUES
('Bíblica (Adultos)', '#10b981'),
('Jovens', '#3b82f6'),
('Adolescentes', '#8b5cf6'),
('Crianças', '#f59e0b'),
('Discipulado', '#ef4444');

-- Update classes table to use category_id
-- First, add the column
ALTER TABLE classes ADD COLUMN category_id UUID REFERENCES categories(id);

-- Migration logic: Map old text categories to new IDs
UPDATE classes c
SET category_id = cat.id
FROM categories cat
WHERE 
  (c.category = 'Biblical' AND cat.name = 'Bíblica (Adultos)') OR
  (c.category = 'Youth' AND cat.name = 'Jovens') OR
  (c.category = 'Teens' AND cat.name = 'Adolescentes') OR
  (c.category = 'Kids' AND cat.name = 'Crianças') OR
  (c.category = 'Discipleship' AND cat.name = 'Discipulado');

-- Now we can drop the old column and the check constraint
-- Note: In a real production env, you'd be more careful here.
ALTER TABLE classes DROP COLUMN category;

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on categories" ON categories FOR DELETE USING (true);
