-- rls-policies.sql
-- Run this in your Supabase SQL Editor to secure your tables

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_notes ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
-- Users can only view and edit their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
ON profiles FOR DELETE 
USING (auth.uid() = id);

-- 3. Projects Policies
-- Users can only view, create, edit, and delete their own projects
CREATE POLICY "Users can view own projects" 
ON projects FOR SELECT 
USING (auth.uid() = editor_id);

CREATE POLICY "Users can insert own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = editor_id);

CREATE POLICY "Users can update own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = editor_id);

CREATE POLICY "Users can delete own projects" 
ON projects FOR DELETE 
USING (auth.uid() = editor_id);

-- 4. Feedback Notes Policies
-- Users can only manage notes linked to their own projects
CREATE POLICY "Users can view notes of their projects" 
ON feedback_notes FOR SELECT 
USING (project_id IN (SELECT id FROM projects WHERE editor_id = auth.uid()));

CREATE POLICY "Users can insert notes for their projects" 
ON feedback_notes FOR INSERT 
WITH CHECK (project_id IN (SELECT id FROM projects WHERE editor_id = auth.uid()));

CREATE POLICY "Users can update notes of their projects" 
ON feedback_notes FOR UPDATE 
USING (project_id IN (SELECT id FROM projects WHERE editor_id = auth.uid()));

CREATE POLICY "Users can delete notes of their projects" 
ON feedback_notes FOR DELETE 
USING (project_id IN (SELECT id FROM projects WHERE editor_id = auth.uid()));

-- NOTE: If your clients are not authenticated (anonymous users) when submitting feedback or viewing projects,
-- you will need to add additional policies allowing public/anonymous access 
-- or bypass RLS using the Service Role key in your Server Actions for those specific operations!
