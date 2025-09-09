-- Add users_can_view_public_profiles policy to user_profiles table
CREATE POLICY "users_can_view_public_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1
  FROM public.role_permissions rp
  JOIN public.user_profiles up ON rp.role_id = up.role_id
  WHERE up.id = auth.uid() AND rp.permission_id = (SELECT id FROM public.permissions WHERE name = 'users:read')
));
