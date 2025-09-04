CREATE OR REPLACE FUNCTION get_user_financial_overview(p_user_id UUID)
RETURNS TABLE(
  total_savings NUMERIC,
  savings_change_percentage NUMERIC,
  active_loans_amount NUMERIC,
  active_loans_count INT,
  pending_contributions_amount NUMERIC,
  days_to_next_due INT,
  monthly_growth NUMERIC,
  monthly_growth_percentage NUMERIC,
  savings_growth JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = p_user_id AND type = 'contribution') AS total_savings,
    0 AS savings_change_percentage, -- Placeholder
    (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = p_user_id AND status = 'active') AS active_loans_amount,
    (SELECT COUNT(*)::INT FROM loans WHERE user_id = p_user_id AND status = 'active') AS active_loans_count,
    0 AS pending_contributions_amount, -- Placeholder
    0 AS days_to_next_due, -- Placeholder
    0 AS monthly_growth, -- Placeholder
    0 AS monthly_growth_percentage, -- Placeholder
    (SELECT json_agg(json_build_object('date', date_trunc('week', created_at), 'savings', SUM(amount))) FROM transactions WHERE user_id = p_user_id AND type = 'contribution' GROUP BY date_trunc('week', created_at) ORDER BY date_trunc('week', created_at)) AS savings_growth;
END;
$$ LANGUAGE plpgsql;
