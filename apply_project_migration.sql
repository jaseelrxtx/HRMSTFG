-- Project Management Module Migration
-- Copy and paste this entire script into Supabase SQL Editor

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  project_head_id UUID REFERENCES employees(id),
  client_name TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  initial_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assigned_to UUID REFERENCES employees(id),
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create client_communications table
CREATE TABLE IF NOT EXISTS client_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date DATE,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'admin_only')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_payments table
CREATE TABLE IF NOT EXISTS project_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_testimonials table
CREATE TABLE IF NOT EXISTS project_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  feedback TEXT,
  rating INTEGER,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert access for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for Admin, HR, and Project Head" ON projects;
DROP POLICY IF EXISTS "Enable delete for Admin only" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON project_milestones;
DROP POLICY IF EXISTS "Enable insert/update for all users" ON project_milestones;
DROP POLICY IF EXISTS "Enable delete for Admin and Project Head" ON project_milestones;
DROP POLICY IF EXISTS "Enable read access based on visibility" ON client_communications;
DROP POLICY IF EXISTS "Enable insert for all users" ON client_communications;
DROP POLICY IF EXISTS "Enable full access for Admin only" ON project_payments;
DROP POLICY IF EXISTS "Enable read access for all users" ON project_testimonials;
DROP POLICY IF EXISTS "Enable write access for Admin and Project Head" ON project_testimonials;

-- Project Policies
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for all users" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for Admin, HR, and Project Head" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'hr')
    ) OR
    project_head_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) OR
    created_by = auth.uid()
  );

CREATE POLICY "Enable delete for Admin only" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Milestone Policies
CREATE POLICY "Enable read access for all users" ON project_milestones
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert/update for all users" ON project_milestones
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for Admin and Project Head" ON project_milestones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_milestones.project_id
      AND (
        project_head_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) OR
        created_by = auth.uid()
      )
    )
  );

-- Communication Policies
CREATE POLICY "Enable read access based on visibility" ON client_communications
  FOR SELECT USING (
    visibility = 'public' OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Enable insert for all users" ON client_communications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Payment Policies
CREATE POLICY "Enable full access for Admin only" ON project_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Testimonial Policies
CREATE POLICY "Enable read access for all users" ON project_testimonials
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for Admin and Project Head" ON project_testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_testimonials.project_id
      AND (
        project_head_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) OR
        created_by = auth.uid()
      )
    )
  );
