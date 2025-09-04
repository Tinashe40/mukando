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
        'repayment_rate', (SELECT COALESCE(SUM(lr.amount) * 100.0 / NULLIF(SUM(l.amount), 0), 0) FROM loans l JOIN loan_repayments lr ON l.id = lr.loan_id WHERE l.group_id = p_group_id),
        'member_participation', (SELECT COALESCE(COUNT(DISTINCT user_id) * 100.0 / NULLIF(COUNT(*), 0), 0) FROM group_members WHERE group_id = p_group_id),
        'total_members', (SELECT COUNT(*)::INT FROM group_members WHERE group_id = p_group_id),
        'new_members_this_month', (SELECT COUNT(*)::INT FROM group_members WHERE group_id = p_group_id AND created_at >= date_trunc('month', NOW())),
        'total_loans_disbursed', (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE group_id = p_group_id AND status IN ('approved', 'active', 'completed')),
        'total_repaid', (SELECT COALESCE(SUM(amount), 0) FROM loan_repayments lr JOIN loans l ON lr.loan_id = l.id WHERE l.group_id = p_group_id),
        'overdue_loans_count', (SELECT COUNT(*)::INT FROM loans WHERE group_id = p_group_id AND status = 'active' AND repayment_due_date < NOW()), -- Assuming repayment_due_date column
        'overdue_loans_amount', (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE group_id = p_group_id AND status = 'active' AND repayment_due_date < NOW()) -- Assuming repayment_due_date column
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