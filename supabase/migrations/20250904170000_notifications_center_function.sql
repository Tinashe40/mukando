CREATE OR REPLACE FUNCTION get_notifications_center_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  notifications_data JSON;
BEGIN
  SELECT json_build_object(
    'notifications', (
      SELECT json_agg(
        json_build_object(
          'id', n.id,
          'type', n.type,
          'priority', n.priority,
          'title', n.title,
          'message', n.message,
          'timestamp', n.created_at,
          'isRead', n.is_read
        )
      )
      FROM notifications n
      WHERE n.user_id = p_user_id
    ),
    'communication_preferences', (
      SELECT json_build_object(
        'globalTiming', 'immediate', -- Placeholder
        'quietHoursStart', '22:00', -- Placeholder
        'quietHoursEnd', '07:00' -- Placeholder
      )
    ),
    'integrations', (
      SELECT json_agg(
        json_build_object(
          'id', i.id,
          'name', i.name,
          'status', i.status
        )
      )
      FROM integrations i
    )
  ) INTO notifications_data;

  RETURN notifications_data;
END;
$$ LANGUAGE plpgsql;
