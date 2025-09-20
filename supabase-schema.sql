-- Tree of Unity Database Schema
-- Run this in your Supabase SQL Editor

-- Create the leaves table
CREATE TABLE IF NOT EXISTS leaves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  angle INTEGER NOT NULL,
  scale DECIMAL NOT NULL,
  leaf_type TEXT NOT NULL CHECK (leaf_type IN ('leaf1', 'leaf2')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on coordinates to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS leaves_coordinates_unique 
ON leaves (x, y);

-- Enable Row Level Security
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON leaves
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON leaves
  FOR INSERT WITH CHECK (true);

-- Enable real-time for the leaves table
ALTER PUBLICATION supabase_realtime ADD TABLE leaves;

-- Create a function to get available coordinates
CREATE OR REPLACE FUNCTION get_available_coordinates()
RETURNS TABLE(x_coord INTEGER, y_coord INTEGER) AS $$
BEGIN
  -- This function will be used by the application to find available positions
  -- The actual coordinate generation logic remains in the JavaScript
  RETURN QUERY
  SELECT 0::INTEGER, 0::INTEGER; -- Placeholder - actual logic in JS
END;
$$ LANGUAGE plpgsql;
