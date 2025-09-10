CREATE OR REPLACE FUNCTION get_payment_reminders(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  title TEXT,
  amount NUMERIC,
  due_date DATE,
  days_until_due INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id,
    pr.title,
    pr.amount,
    pr.due_date,
    (pr.due_date - now()::date) as days_until_due
  FROM payment_reminders pr
  WHERE pr.user_id = p_user_id
  ORDER BY pr.due_date ASC;
END;
$$;