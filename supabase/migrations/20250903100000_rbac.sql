-- Location: supabase/migrations/20250903100000_rbac.sql
-- RBAC (Role-Based Access Control) Implementation

-- 1. Create roles table
CREATE TABLE public.roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 2. Create permissions table
CREATE TABLE public.permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 3. Create role_permissions table
CREATE TABLE public.role_permissions (
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Add role_id to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN role_id BIGINT REFERENCES public.roles(id);

-- 5. Seed the roles and permissions
INSERT INTO public.roles (name) VALUES ('admin'), ('treasurer'), ('member');

INSERT INTO public.permissions (name) VALUES
    ('users.read'),
    ('users.write'),
    ('groups.read'),
    ('groups.write'),
    ('payments.read'),
    ('payments.write');

-- 6. Assign permissions to roles
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
