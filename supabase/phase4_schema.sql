-- ============================================================
-- Campus Hub — Phase 4: Jobs & Roommates SQL Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL)
-- ============================================================

-- Ensure the profiles table exists (may already exist from Phase 1)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  university TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure newly required columns exist if profiles was previously created
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poster_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('part-time', 'full-time', 'internship', 'freelance', 'on-campus')),
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  pay_min NUMERIC(10,2),
  pay_max NUMERIC(10,2),
  pay_period TEXT DEFAULT 'hourly' CHECK (pay_period IN ('hourly', 'weekly', 'monthly', 'fixed')),
  skills_required TEXT[],
  application_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROOMMATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS roommates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poster_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('offering', 'looking')),
  rent NUMERIC(10,2),
  location TEXT,
  move_in_date DATE,
  lease_duration TEXT,
  room_type TEXT CHECK (room_type IN ('private', 'shared', 'studio', 'apartment', 'house')),
  amenities TEXT[],
  preferences TEXT[],
  image_urls TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'taken', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can update their own jobs"
  ON jobs FOR UPDATE TO authenticated
  USING (auth.uid() = poster_id)
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can delete their own jobs"
  ON jobs FOR DELETE TO authenticated
  USING (auth.uid() = poster_id);

ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active roommate posts"
  ON roommates FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can insert roommate posts"
  ON roommates FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can update their own roommate posts"
  ON roommates FOR UPDATE TO authenticated
  USING (auth.uid() = poster_id)
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Users can delete their own roommate posts"
  ON roommates FOR DELETE TO authenticated
  USING (auth.uid() = poster_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_poster ON jobs(poster_id);
CREATE INDEX IF NOT EXISTS idx_roommates_status ON roommates(status);
CREATE INDEX IF NOT EXISTS idx_roommates_type ON roommates(listing_type);
CREATE INDEX IF NOT EXISTS idx_roommates_poster ON roommates(poster_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roommates_updated_at
  BEFORE UPDATE ON roommates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
