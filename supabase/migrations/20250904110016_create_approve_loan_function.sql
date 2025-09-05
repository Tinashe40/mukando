CREATE OR REPLACE FUNCTION approve_loan(p_loan_id BIGINT)
RETURNS JSON AS $$
DECLARE
  updated_loan JSON;
BEGIN
  UPDATE public.loans
  SET
    status = 'approved',
    updated_at = NOW()
  WHERE id = p_loan_id
  RETURNING to_json(loans.*)
  INTO updated_loan;

  RETURN updated_loan;
END;
$$ LANGUAGE plpgsql;
