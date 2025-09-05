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
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    phone_number,
    country,
    mobile_money_provider,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'country')::public.country_code, 'ZW'::public.country_code),
    (NEW.raw_user_meta_data->>'mobile_money_provider')::public.mobile_money_provider,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
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
  WHERE id = NEW.user_id;
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

-- 6. RLS Policies (Using Pattern 1 - Core User Tables)
-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to read public profile information (for group features)
CREATE POLICY "users_can_view_public_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (account_status = 'active'::public.account_status);

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

-- 8. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    sarah_uuid UUID := gen_random_uuid();
    member_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@mukando.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "phone_number": "+263771234567", "country": "ZW", "mobile_money_provider": "ecocash", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (sarah_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'anesu@mukando.com', crypt('member123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Anesu", "phone_number": "+263772345678", "country": "ZW", "mobile_money_provider": "ecocash", "role": "member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (member_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'member@mukando.com', crypt('member123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Chikwanha", "phone_number": "+263773456789", "country": "ZW", "mobile_money_provider": "onemoney", "role": "member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 9. Cleanup function for development/testing
CREATE OR REPLACE FUNCTION public.cleanup_test_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $cleanup$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get test auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@mukando.com', 'anesu@mukando.com', 'member@mukando.com');

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
    RAISE NOTICE 'Cleaned up % test users', array_length(auth_user_ids_to_delete, 1);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$cleanup$;

-- Comment on important objects
COMMENT ON TABLE public.user_profiles IS 'User profiles table that bridges auth.users with application data. Required for PostgREST compatibility.';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new user registers via Supabase Auth';
COMMENT ON FUNCTION public.cleanup_test_users() IS 'Development function to clean up test users and related data';