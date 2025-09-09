CREATE OR REPLACE FUNCTION invite_member(p_group_id UUID, p_email TEXT, p_phone TEXT, p_role TEXT)
RETURNS JSON AS $$
DECLARE
  invitation_data JSON;
  new_token TEXT;
BEGIN
  new_token := extensions.uuid_generate_v4()::text;

  INSERT INTO public.invitations (group_id, email, phone, role, token)
  VALUES (p_group_id, p_email, p_phone, p_role, new_token)
  RETURNING json_build_object('id', id, 'email', email, 'phone', phone, 'role', role, 'status', status, 'token', token)
  INTO invitation_data;

  RETURN invitation_data;
END;
$$ LANGUAGE plpgsql;
