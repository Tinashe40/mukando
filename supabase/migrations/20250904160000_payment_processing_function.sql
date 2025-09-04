CREATE OR REPLACE FUNCTION get_payment_processing_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  payment_data JSON;
BEGIN
  SELECT json_build_object(
    'user_balance', (SELECT COALESCE(SUM(CASE WHEN type = 'contribution' THEN amount ELSE -amount END), 0) FROM transactions WHERE user_id = p_user_id),
    'transaction_history', (
      SELECT json_agg(
        json_build_object(
          'id', t.id,
          'amount', t.amount,
          'fee', 0, -- Placeholder
          'method', t.type,
          'recipient', g.name,
          'purpose', t.purpose,
          'status', t.status,
          'date', t.created_at,
          'reference', t.reference
        )
      )
      FROM transactions t
      JOIN groups g ON t.group_id = g.id
      WHERE t.user_id = p_user_id
    )
  ) INTO payment_data;

  RETURN payment_data;
END;
$$ LANGUAGE plpgsql;
