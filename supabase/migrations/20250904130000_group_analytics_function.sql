CREATE OR REPLACE FUNCTION get_group_analytics(p_group_id BIGINT)
RETURNS JSON AS $$
DECLARE
  analytics_data JSON;
BEGIN
  SELECT json_build_object(
    'kpis', (
      SELECT json_build_object(
        'total_savings', (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE group_id = p_group_id AND type = 'contribution'),
        'active_loans', (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE group_id = p_group_id AND status = 'active'),
        'repayment_rate', 0, -- Placeholder
        'member_participation', 0 -- Placeholder
      )
    ),
    'savings_growth', (
      SELECT json_agg(json_build_object('date', date_trunc('week', created_at), 'totalSavings', SUM(amount)))
      FROM transactions
      WHERE group_id = p_group_id AND type = 'contribution'
      GROUP BY date_trunc('week', created_at)
      ORDER BY date_trunc('week', created_at)
    ),
    'loan_distribution', (
        SELECT json_agg(json_build_object('category', purpose, 'value', SUM(amount)))
        FROM loans
        WHERE group_id = p_group_id
        GROUP BY purpose
    ),
    'member_engagement', (
        SELECT json_agg(json_build_object('name', up.full_name, 'value', SUM(t.amount)))
        FROM transactions t
        JOIN user_profiles up ON t.user_id = up.id
        WHERE t.group_id = p_group_id AND t.type = 'contribution'
        GROUP BY up.full_name
    ),
    'risk_heatmap', (
        SELECT json_agg(json_build_object('name', up.full_name, 'riskLevel', 'low')) -- Placeholder
        FROM group_members gm
        JOIN user_profiles up ON gm.user_id = up.id
        WHERE gm.group_id = p_group_id
    )
  ) INTO analytics_data;

  RETURN analytics_data;
END;
$$ LANGUAGE plpgsql;
