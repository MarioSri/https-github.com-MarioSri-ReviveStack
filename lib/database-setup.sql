-- ReviveStack Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  repo_url TEXT,
  stars INTEGER DEFAULT 0,
  estimated_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  seller_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  buyer_id UUID REFERENCES auth.users(id),
  last_commit_date TIMESTAMP
);

-- Create a profiles table with proper constraints
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clean up any duplicate profiles (if they exist)
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at) as rn
    FROM public.profiles
  ) t
  WHERE t.rn > 1
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for projects
CREATE POLICY "Anyone can view active projects" ON public.projects
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id OR auth.uid() = buyer_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data (only if no projects exist)
INSERT INTO public.projects (title, description, repo_url, stars, estimated_value, seller_email, last_commit_date) 
SELECT * FROM (VALUES
  ('TaskFlow Pro', 'Advanced project management tool with AI-powered insights. Built with React and Node.js. Includes user authentication, real-time collaboration, and analytics dashboard.', 'https://github.com/example/taskflow-pro', 1247, 15000, 'john@example.com', '2023-08-15T10:30:00Z'),
  ('EcoTracker', 'Carbon footprint tracking app for individuals and businesses. Features include expense tracking, sustainability reports, and goal setting.', 'https://github.com/example/ecotracker', 892, 8500, 'sarah@example.com', '2023-10-22T14:45:00Z'),
  ('CodeReview Bot', 'Automated code review tool that integrates with GitHub. Uses machine learning to detect code smells and suggest improvements.', 'https://github.com/example/codereview-bot', 2156, 25000, 'mike@example.com', '2023-05-03T09:15:00Z'),
  ('FitnessPal Clone', 'Comprehensive fitness tracking application with meal planning, workout routines, and progress analytics.', 'https://github.com/example/fitnesspal', 634, 12000, 'lisa@example.com', '2023-11-18T16:20:00Z')
) AS v(title, description, repo_url, stars, estimated_value, seller_email, last_commit_date)
WHERE NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1);
