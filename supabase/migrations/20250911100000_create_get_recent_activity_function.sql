CREATE OR REPLACE FUNCTION get_recent_activity(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  type TEXT,
  title TEXT,
  description TEXT,
  amount NUMERIC,
  timestamp TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, 'contribution' as type, 'Contribution' as title, 'Money added to your savings' as description, c.amount, c.created_at as timestamp
  FROM contributions c
  WHERE c.user_id = p_user_id
  UNION ALL
  SELECT lr.id, 'loan_repayment' as type, 'Loan Repayment' as title, 'Payment made towards your loan' as description, lr.amount, lr.repayment_date as timestamp
  FROM loan_repayments lr
  WHERE lr.user_id = p_user_id
  UNION ALL
  SELECT l.id, 'loan_approved' as type, 'Loan Approved' as title, 'Your loan has been approved' as description, l.amount, l.created_at as timestamp
  FROM loans l
  WHERE l.user_id = p_user_id AND l.status = 'approved'
  UNION ALL
  SELECT l.id, 'loan_request' as type, 'Loan Request' as title, 'You requested a new loan' as description, l.amount, l.created_at as timestamp
  FROM loans l
  WHERE l.user_id = p_user_id AND l.status = 'pending'
  UNION ALL
  SELECT n.id, 'notification' as type, 'Notification' as title, n.message as description, NULL as amount, n.created_at as timestamp
  FROM notifications n
  WHERE n.user_id = p_user_id
  UNION ALL
  SELECT gm.id, 'group_join' as type, 'Group Joined' as title, 'You joined a new group' as description, NULL as amount, gm.created_at as timestamp
  FROM group_members gm
  WHERE gm.user_id = p_user_id
  ORDER BY timestamp DESC
  LIMIT 5;
END;
$$;