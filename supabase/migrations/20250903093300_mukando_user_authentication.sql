-- Location: supabase/migrations/20250903093300_mukando_user_authentication.sql
-- Mukando Community Savings Platform - User Authentication System
-- Schema Analysis: No existing schema - creating from scratch
-- Integration Type: Complete authentication system setup
-- Dependencies: auth.users (Supabase built-in)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('member', 'admin', 'group_leader');
CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE public.country_code AS ENUM ('ZW', 'ZA', 'KE', 'UG', 'TZ', 'MW', 'ZM', 'BW');
CREATE TYPE public.mobile_money_provider AS ENUM ('ecocash', 'onemoney', 'telecash', 'pesepay', 'mpesa', 'airtel', 'capitec');

-- 2. Core User Profiles Table (Critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    country public.country_code DEFAULT 'ZW'::public.country_code,
    mobile_money_provider public.mobile_money_provider,
    role public.user_role DEFAULT 'member'::public.user_role,
    account_status public.account_status DEFAULT 'active'::public.account_status,
    subscribe_newsletter BOOLEAN DEFAULT false,
    profile_completed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_phone ON public.user_profiles(phone_number);
CREATE INDEX idx_user_profiles_country ON public.user_profiles(country);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(account_status);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- 4. Helper Functions (Must be created before RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
DECLARE
  role_id BIGINT;
BEGIN
  -- Get the role_id from the roles table based on the role name provided in the raw_user_meta_data
  SELECT id INTO role_id FROM public.roles WHERE name = COALESCE(NEW.raw_user_meta_data->>'role', 'member');

  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    phone_number,
    country,
    mobile_money_provider,
    role_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'country')::public.country_code, 'ZW'::public.country_code),
    (NEW.raw_user_meta_data->>'mobile_money_provider')::public.mobile_money_provider,
    role_id
  );
  RETURN NEW;
END;
$func$;

-- Function to update last login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
  UPDATE public.user_profiles 
  SET 
    last_login_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
  RETURN NEW;
END;
$func$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$func$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Using Pattern 2 - RBAC with Permissions)
-- Pattern 2: RBAC with permissions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_signed_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.update_last_login();

CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Comment on important objects
COMMENT ON TABLE public.user_profiles IS 'User profiles table that bridges auth.users with application data. Required for PostgREST compatibility.';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new user registers via Supabase Auth';