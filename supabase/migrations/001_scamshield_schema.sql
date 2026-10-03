-- ====================================================================
-- ScamShield Cybersecurity Platform - Supabase PostgreSQL Schema
-- Migration 001: Core Tables, Indexes & Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (syncs with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Analyses Table (User Threat Assessments)
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('message', 'email', 'url', 'payment')),
  input_preview TEXT NOT NULL, -- Note: sensitive tokens are redacted prior to storage
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  scam_category TEXT NOT NULL,
  summary TEXT NOT NULL,
  warning_signs JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_engineering_tactics JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  avoid_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  uncertainties JSONB NOT NULL DEFAULT '[]'::jsonb,
  safe_interpretation TEXT,
  simple_explanation TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Threat Library Table (Public Cybersecurity Reference)
CREATE TABLE IF NOT EXISTS public.threat_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  summary TEXT NOT NULL,
  how_it_works JSONB NOT NULL DEFAULT '[]'::jsonb,
  warning_signs JSONB NOT NULL DEFAULT '[]'::jsonb,
  example_snippet TEXT NOT NULL,
  example_analysis_type TEXT NOT NULL,
  prevention_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  incident_response_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Simulator Questions Table
CREATE TABLE IF NOT EXISTS public.simulator_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_title TEXT NOT NULL,
  channel TEXT NOT NULL,
  content TEXT NOT NULL,
  sender_info TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  threat_category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Simulator Attempts Table
CREATE TABLE IF NOT EXISTS public.simulator_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulator_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulator_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Analyses: Users can only select, insert, and delete their own analyses
CREATE POLICY "Users can read own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Threat Library: Readable by anyone (public educational resource)
CREATE POLICY "Public read access for threat library"
  ON public.threat_library FOR SELECT
  TO public
  USING (true);

-- Simulator Questions: Readable by anyone
CREATE POLICY "Public read access for simulator questions"
  ON public.simulator_questions FOR SELECT
  TO public
  USING (true);

-- Simulator Attempts: Users can read and insert their own attempts
CREATE POLICY "Users can read own simulator attempts"
  ON public.simulator_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulator attempts"
  ON public.simulator_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_library_category ON public.threat_library(category);
