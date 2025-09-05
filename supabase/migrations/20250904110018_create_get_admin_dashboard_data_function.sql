CREATE OR REPLACE FUNCTION get_admin_dashboard_data()
RETURNS JSON AS $$
DECLARE
  dashboard_data JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*)::INT FROM users),
    'total_groups', (SELECT COUNT(*)::INT FROM groups),
    'total_loans_disbursed', (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status IN ('approved', 'active', 'completed'))
  ) INTO dashboard_data;

  RETURN dashboard_data;
END;
$$ LANGUAGE plpgsql;
