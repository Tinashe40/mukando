-- Location: supabase/migrations/20250906130000_create_get_user_permissions_new_rpc.sql
-- Description: Creates a new RPC to get user permissions from the role_permissions table.

CREATE OR REPLACE FUNCTION public.get_user_permissions_new(p_user_id UUID)
RETURNS TABLE(permission_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  RETURN QUERY
  SELECT p.name
  FROM public.role_permissions rp
  JOIN public.permissions p ON rp.permission_id = p.id
  JOIN public.user_profiles up ON rp.role_id = up.role_id
  WHERE up.id = p_user_id;
END;
$func$;
