CREATE OR REPLACE FUNCTION get_group_management_data(p_group_id BIGINT)
RETURNS JSON AS $$
DECLARE
  management_data JSON;
BEGIN
  SELECT json_build_object(
    'members', (
      SELECT json_agg(
        json_build_object(
          'id', up.id,
          'name', up.full_name,
          'email', up.email,
          'avatar', up.avatar_url,
          'status', gm.status,
          'joinDate', gm.created_at
        )
      )
      FROM group_members gm
      JOIN user_profiles up ON gm.user_id = up.id
      WHERE gm.group_id = p_group_id
    ),
    'loan_requests', (
      SELECT json_agg(
        json_build_object(
          'id', l.id,
          'memberName', up.full_name,
          'requestedAmount', l.amount,
          'purpose', l.purpose,
          'status', l.status,
          'requestDate', l.created_at
        )
      )
      FROM loans l
      JOIN user_profiles up ON l.user_id = up.id
      WHERE l.group_id = p_group_id AND l.status = 'pending'
    ),
    'settings', (
      SELECT json_build_object(
        'groupName', g.name,
        'description', g.description
      )
      FROM groups g
      WHERE g.id = p_group_id
    ),
    'invitations', (
      SELECT json_agg(
        json_build_object(
          'id', i.id,
          'email', i.email,
          'status', i.status,
          'sentDate', i.created_at
        )
      )
      FROM invitations i
      WHERE i.group_id = p_group_id
    )
  ) INTO management_data;

  RETURN management_data;
END;
$$ LANGUAGE plpgsql;
