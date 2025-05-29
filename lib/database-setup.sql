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

-- Create a profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive',
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_intent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create saved projects table
CREATE TABLE IF NOT EXISTS public.saved_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  project_id UUID REFERENCES public.projects(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Create watchlist alerts table
CREATE TABLE IF NOT EXISTS public.watchlist_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_alerts ENABLE ROW LEVEL SECURITY;

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

-- Create policies for user subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for offers
CREATE POLICY "Users can view their own offers" ON public.offers
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() IN (
    SELECT user_id FROM public.projects WHERE id = project_id
  ));

CREATE POLICY "Users can create offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Project owners can update offers" ON public.offers
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.projects WHERE id = project_id
  ));

-- Create policies for saved projects
CREATE POLICY "Users can view their own saved projects" ON public.saved_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save projects" ON public.saved_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved projects" ON public.saved_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for watchlist alerts
CREATE POLICY "Users can view their own alerts" ON public.watchlist_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create alerts" ON public.watchlist_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON public.watchlist_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON public.watchlist_alerts
  FOR DELETE USING (auth.uid() = user_id);

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
