CREATE OR REPLACE FUNCTION update_group_settings(p_group_id UUID, p_settings JSONB)
RETURNS JSON AS $$
DECLARE
  updated_group JSON;
BEGIN
  UPDATE public.groups
  SET
    settings = p_settings
  WHERE id = p_group_id
  RETURNING to_json(groups.*)
  INTO updated_group;

  RETURN updated_group;
END;
$$ LANGUAGE plpgsql;