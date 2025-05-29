"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Database } from "lucide-react"

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
  isPublic: boolean
}

export default function SetupPage() {
  const [envChecks, setEnvChecks] = useState<EnvCheck[]>([])
  const [supabaseConnection, setSupabaseConnection] = useState<"checking" | "success" | "error">("checking")
  const [stripeConnection, setStripeConnection] = useState<"checking" | "success" | "error">("checking")
  const [databaseSetup, setDatabaseSetup] = useState<"checking" | "success" | "error">("checking")
  const [copied, setCopied] = useState(false)

  const databaseScript = `-- ReviveStack Database Setup Script
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
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for projects
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
CREATE POLICY "Anyone can view active projects" ON public.projects
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.projects (title, description, repo_url, stars, estimated_value, seller_email, last_commit_date) VALUES
('TaskFlow Pro', 'Advanced project management tool with AI-powered insights. Built with React and Node.js. Includes user authentication, real-time collaboration, and analytics dashboard.', 'https://github.com/example/taskflow-pro', 1247, 15000, 'john@example.com', '2023-08-15T10:30:00Z'),
('EcoTracker', 'Carbon footprint tracking app for individuals and businesses. Features include expense tracking, sustainability reports, and goal setting.', 'https://github.com/example/ecotracker', 892, 8500, 'sarah@example.com', '2023-10-22T14:45:00Z'),
('CodeReview Bot', 'Automated code review tool that integrates with GitHub. Uses machine learning to detect code smells and suggest improvements.', 'https://github.com/example/codereview-bot', 2156, 25000, 'mike@example.com', '2023-05-03T09:15:00Z'),
('FitnessPal Clone', 'Comprehensive fitness tracking application with meal planning, workout routines, and progress analytics.', 'https://github.com/example/fitnesspal', 634, 12000, 'lisa@example.com', '2023-11-18T16:20:00Z')
ON CONFLICT DO NOTHING;`

  useEffect(() => {
    // Check environment variables
    const checks: EnvCheck[] = [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        description: "Supabase project URL",
        isPublic: true,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        description: "Supabase anonymous key",
        isPublic: true,
      },
      {
        name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        required: true,
        description: "Stripe publishable key",
        isPublic: true,
      },
    ]

    setEnvChecks(checks)

    // Test connections
    testSupabaseConnection()
    testStripeConnection()
    testDatabaseSetup()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      const { supabase } = await import("@/lib/supabase")
      const { data, error } = await supabase.from("projects").select("count").limit(1)

      if (error) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          setDatabaseSetup("error")
        }
        throw error
      }
      setSupabaseConnection("success")
      setDatabaseSetup("success")
    } catch (error) {
      console.error("Supabase connection error:", error)
      setSupabaseConnection("error")
    }
  }

  const testStripeConnection = async () => {
    try {
      const response = await fetch("/api/stripe-test")
      if (response.ok) {
        setStripeConnection("success")
      } else {
        setStripeConnection("error")
      }
    } catch (error) {
      console.error("Stripe connection error:", error)
      setStripeConnection("error")
    }
  }

  const testDatabaseSetup = async () => {
    try {
      const { supabase } = await import("@/lib/supabase")
      const { data, error } = await supabase.from("projects").select("id").limit(1)

      if (error) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          setDatabaseSetup("error")
        } else {
          throw error
        }
      } else {
        setDatabaseSetup("success")
      }
    } catch (error) {
      console.error("Database setup error:", error)
      setDatabaseSetup("error")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(databaseScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getStatusIcon = (hasValue: boolean, required: boolean) => {
    if (required && !hasValue) {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else if (hasValue) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getConnectionIcon = (status: "checking" | "success" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ReviveStack Setup</h1>
          <p className="text-gray-600 mb-8">Verify your environment configuration and service connections.</p>

          {/* Database Setup */}
          {databaseSetup === "error" && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-red-900">Database Setup Required</h2>
              </div>
              <p className="text-red-800 mb-4">
                The database tables haven't been created yet. Please run the following SQL script in your Supabase
                dashboard:
              </p>

              <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-red-900">Database Setup Script</h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto max-h-64 text-gray-800">
                  {databaseScript}
                </pre>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Open Supabase Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <button
                  onClick={testDatabaseSetup}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Test Again
                </button>
              </div>
            </div>
          )}

          {/* Environment Variables */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
            <div className="space-y-3">
              {envChecks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(!!check.value, check.required)}
                    <div>
                      <div className="font-medium text-gray-900">{check.name}</div>
                      <div className="text-sm text-gray-500">{check.description}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {check.value ? (
                      <span className="text-green-600">✓ Set</span>
                    ) : check.required ? (
                      <span className="text-red-600">✗ Missing</span>
                    ) : (
                      <span className="text-yellow-600">⚠ Optional</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Connections */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Connections</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getConnectionIcon(supabaseConnection)}
                  <div>
                    <div className="font-medium text-gray-900">Supabase Database</div>
                    <div className="text-sm text-gray-500">Connection to your Supabase project</div>
                  </div>
                </div>
                <div className="text-sm">
                  {supabaseConnection === "success" && <span className="text-green-600">✓ Connected</span>}
                  {supabaseConnection === "error" && <span className="text-red-600">✗ Failed</span>}
                  {supabaseConnection === "checking" && <span className="text-blue-600">⏳ Testing...</span>}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getConnectionIcon(databaseSetup)}
                  <div>
                    <div className="font-medium text-gray-900">Database Tables</div>
                    <div className="text-sm text-gray-500">Required tables and policies</div>
                  </div>
                </div>
                <div className="text-sm">
                  {databaseSetup === "success" && <span className="text-green-600">✓ Ready</span>}
                  {databaseSetup === "error" && <span className="text-red-600">✗ Not Setup</span>}
                  {databaseSetup === "checking" && <span className="text-blue-600">⏳ Testing...</span>}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getConnectionIcon(stripeConnection)}
                  <div>
                    <div className="font-medium text-gray-900">Stripe Payments</div>
                    <div className="text-sm text-gray-500">Connection to Stripe payment processing</div>
                  </div>
                </div>
                <div className="text-sm">
                  {stripeConnection === "success" && <span className="text-green-600">✓ Connected</span>}
                  {stripeConnection === "error" && <span className="text-red-600">✗ Failed</span>}
                  {stripeConnection === "checking" && <span className="text-blue-600">⏳ Testing...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Setup Instructions</h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm">
                  1
                </span>
                <div>
                  <strong>Database Setup:</strong> Run the SQL script above in your Supabase dashboard to create the
                  required tables.
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm">
                  2
                </span>
                <div>
                  <strong>Stripe Webhook:</strong> Set up a webhook endpoint in your Stripe dashboard pointing to{" "}
                  <code className="bg-blue-100 px-1 rounded">/api/webhook</code>
                  <a
                    href="https://dashboard.stripe.com/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm">
                  3
                </span>
                <div>
                  <strong>Authentication:</strong> Configure Google OAuth in your Supabase Auth settings if you want to
                  enable Google sign-in.
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  )
}
