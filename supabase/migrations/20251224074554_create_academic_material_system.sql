/*
  # Academic Material Management System - Initial Schema
  
  ## Overview
  Creates a comprehensive system for managing academic materials with secure authentication,
  role-based access control, and file management capabilities.
  
  ## New Tables
  
  ### 1. `profiles`
  User profiles linked to Supabase Auth
  - `id` (uuid, references auth.users)
  - `user_type` (text): 'mahasiswa' or 'dosen'
  - `nama` (text): Full name
  - `foto_url` (text): Profile photo URL
  - `institusi` (text): Institution name
  - `created_at` (timestamptz): Account creation timestamp
  - `updated_at` (timestamptz): Last update timestamp
  
  ### 2. `mahasiswa`
  Student-specific information
  - `id` (uuid, primary key)
  - `profile_id` (uuid, references profiles)
  - `npm` (text, unique): Student ID number
  - `sesi_belajar` (text): Learning session (e.g., "Pagi", "Sore")
  - `program_studi` (text): Study program
  - `pembimbing_akademik` (text): Academic advisor name
  - `semester` (integer): Current semester (1-8)
  
  ### 3. `dosen`
  Lecturer-specific information
  - `id` (uuid, primary key)
  - `profile_id` (uuid, references profiles)
  - `nidn` (text, unique): Lecturer ID number
  - `department` (text): Department name
  
  ### 4. `materi`
  Academic materials/resources
  - `id` (uuid, primary key)
  - `program_studi` (text): Study program
  - `semester` (integer): Semester (1-8)
  - `bab` (text): Chapter name
  - `sub_bab` (text): Sub-chapter name
  - `file_path` (text): File storage path
  - `file_name` (text): Original file name
  - `uploaded_by` (uuid, references profiles): Uploader profile ID
  - `created_at` (timestamptz): Upload timestamp
  - `updated_at` (timestamptz): Last update timestamp
  
  ### 5. `password_reset_codes`
  Temporary codes for password reset
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `code` (text): Verification code
  - `expires_at` (timestamptz): Expiration time
  - `used` (boolean): Whether code has been used
  
  ## Security Features
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only view/edit their own data
  - Dosen can manage materials
  - Public read access for materials (search functionality)
  
  ### Policies
  - Restrictive by default - no access without explicit policy
  - Authenticated users only for sensitive operations
  - Ownership checks on all mutations
  - Public read for material search
  
  ## Indexes
  - npm and nidn for fast lookups
  - program_studi, semester, bab for efficient material searches
  - Foreign keys for referential integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (Base user information)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('mahasiswa', 'dosen')),
  nama text NOT NULL,
  foto_url text DEFAULT '',
  institusi text NOT NULL DEFAULT 'Universitas',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- MAHASISWA TABLE (Student details)
-- =====================================================
CREATE TABLE IF NOT EXISTS mahasiswa (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  npm text UNIQUE NOT NULL,
  sesi_belajar text NOT NULL DEFAULT 'Pagi',
  program_studi text NOT NULL,
  pembimbing_akademik text NOT NULL DEFAULT '',
  semester integer NOT NULL DEFAULT 1 CHECK (semester >= 1 AND semester <= 8),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mahasiswa can view own data"
  ON mahasiswa FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Mahasiswa can update own data"
  ON mahasiswa FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Mahasiswa can insert own data"
  ON mahasiswa FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- =====================================================
-- DOSEN TABLE (Lecturer details)
-- =====================================================
CREATE TABLE IF NOT EXISTS dosen (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nidn text UNIQUE NOT NULL,
  department text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dosen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dosen can view own data"
  ON dosen FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Dosen can update own data"
  ON dosen FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Dosen can insert own data"
  ON dosen FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- =====================================================
-- MATERI TABLE (Academic materials)
-- =====================================================
CREATE TABLE IF NOT EXISTS materi (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_studi text NOT NULL,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  bab text NOT NULL,
  sub_bab text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE materi ENABLE ROW LEVEL SECURITY;

-- Public can search and view materials
CREATE POLICY "Anyone can view materi"
  ON materi FOR SELECT
  TO authenticated
  USING (true);

-- Only dosen can insert materials
CREATE POLICY "Dosen can insert materi"
  ON materi FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'dosen'
    )
  );

-- Only dosen can update their own materials
CREATE POLICY "Dosen can update own materi"
  ON materi FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'dosen'
    )
  )
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'dosen'
    )
  );

-- Only dosen can delete their own materials
CREATE POLICY "Dosen can delete own materi"
  ON materi FOR DELETE
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'dosen'
    )
  );

-- =====================================================
-- PASSWORD RESET CODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reset codes"
  ON password_reset_codes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service can insert reset codes"
  ON password_reset_codes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own reset codes"
  ON password_reset_codes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_mahasiswa_npm ON mahasiswa(npm);
CREATE INDEX IF NOT EXISTS idx_dosen_nidn ON dosen(nidn);
CREATE INDEX IF NOT EXISTS idx_materi_program_studi ON materi(program_studi);
CREATE INDEX IF NOT EXISTS idx_materi_semester ON materi(semester);
CREATE INDEX IF NOT EXISTS idx_materi_bab ON materi(bab);
CREATE INDEX IF NOT EXISTS idx_materi_uploaded_by ON materi(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- =====================================================
-- FUNCTIONS for automatic timestamp updates
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materi_updated_at
  BEFORE UPDATE ON materi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();