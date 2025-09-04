CREATE OR REPLACE FUNCTION get_loan_request_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  loan_request_data JSON;
BEGIN
  SELECT json_build_object(
    'eligibility', (
      SELECT json_build_object(
        'creditScore', 0, -- Placeholder
        'maxLoanAmount', 5000, -- Placeholder
        'interestRate', 12, -- Placeholder
        'currency', 'USD',
        'approvalLikelihood', 'High', -- Placeholder
        'processingTime', '3-5 business days' -- Placeholder
      )
    ),
    'applications', (
      SELECT json_agg(
        json_build_object(
          'id', l.id,
          'amount', l.amount,
          'currency', 'USD',
          'purpose', l.purpose,
          'repaymentPeriod', l.term_months,
          'status', l.status,
          'submittedAt', l.created_at
        )
      )
      FROM loans l
      WHERE l.user_id = p_user_id
    )
  ) INTO loan_request_data;

  RETURN loan_request_data;
END;
$$ LANGUAGE plpgsql;
