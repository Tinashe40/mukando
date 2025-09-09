-- Location: supabase/migrations/20250903100000_rbac.sql
-- RBAC (Role-Based Access Control) Implementation - Part 2: Alter user_profiles and Seed Data

-- 1. Add role_id to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN role_id BIGINT REFERENCES public.roles(id);

-- 2. Seed the roles and permissions
INSERT INTO public.roles (name) VALUES ('admin'), ('treasurer'), ('member');

INSERT INTO public.permissions (name) VALUES
    ('users.read'),
    ('users.write'),
    ('groups.read'),
    ('groups.write'),
    ('payments.read'),
    ('payments.write');

-- 3. Assign permissions to roles
-- Admin permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin';

-- Treasurer permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'treasurer' AND p.name IN ('groups.read', 'payments.read', 'payments.write');

-- Member permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'member' AND p.name IN ('groups.read', 'payments.read');
