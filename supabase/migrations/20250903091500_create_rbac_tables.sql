-- Create roles, permissions, and role_permissions tables
CREATE TABLE public.roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.role_permissions (
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
