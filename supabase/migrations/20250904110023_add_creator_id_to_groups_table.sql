-- Add creator_id to groups table
ALTER TABLE public.groups
ADD COLUMN creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Optional: Update existing groups with a default creator_id if needed
-- For example, set to a specific admin user's ID or NULL
-- UPDATE public.groups SET creator_id = 'YOUR_ADMIN_USER_UUID' WHERE creator_id IS NULL;

COMMENT ON COLUMN public.groups.creator_id IS 'The ID of the user who created this group.';