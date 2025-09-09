-- Fix RLS policies for groups table

-- Remove existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.groups;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.groups;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.groups;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.groups;

-- New SELECT policy: Allow authenticated users to read public groups or groups they created
CREATE POLICY "Authenticated users can read public or owned groups" ON public.groups
FOR SELECT
TO authenticated
USING (
    is_public = TRUE OR creator_id = auth.uid()
);

-- New INSERT policy: Allow authenticated users to create groups, setting creator_id
CREATE POLICY "Authenticated users can create groups" ON public.groups
FOR INSERT
TO authenticated
WITH CHECK (
    creator_id = auth.uid()
);

-- New UPDATE policy: Allow authenticated users to update groups they created
CREATE POLICY "Authenticated users can update their own groups" ON public.groups
FOR UPDATE
TO authenticated
USING (
    creator_id = auth.uid()
);

-- New DELETE policy: Allow authenticated users to delete groups they created
CREATE POLICY "Authenticated users can delete their own groups" ON public.groups
FOR DELETE
TO authenticated
USING (
    creator_id = auth.uid()
);

-- Admin policies (assuming admin role has appropriate permissions via RBAC)
-- Admins can bypass RLS if they have the 'bypass_rls' permission or similar setup.
-- For simplicity, we can add specific policies for admin if needed, or rely on a superuser role.
-- For now, we assume admin can manage all via a higher-level mechanism or specific policies will be added later.

-- Example for admin SELECT (if not relying on bypass_rls or other mechanisms)
-- CREATE POLICY "Admins can view all groups" ON public.groups
-- FOR SELECT
-- TO authenticated
-- USING (
--     EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
-- );

-- Example for admin UPDATE
-- CREATE POLICY "Admins can update all groups" ON public.groups
-- FOR UPDATE
-- TO authenticated
-- USING (
--     EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
-- );

-- Example for admin DELETE
-- CREATE POLICY "Admins can delete all groups" ON public.groups
-- FOR DELETE
-- TO authenticated
-- USING (
--     EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
-- );
