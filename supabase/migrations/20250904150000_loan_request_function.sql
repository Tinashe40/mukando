CREATE OR REPLACE FUNCTION get_loan_request_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  loan_request_data JSON;
  user_total_contributions NUMERIC;
  user_loan_repayment_rate NUMERIC;
  user_membership_months INT;
  calculated_credit_score INT;
  max_loan_amount_based_on_score NUMERIC;
  approval_likelihood_text TEXT;
BEGIN
  -- Calculate user's total contributions
  SELECT COALESCE(SUM(amount), 0)
  INTO user_total_contributions
  FROM public.contributions
  WHERE user_id = p_user_id;

  -- Calculate user's loan repayment rate (example: total repaid / total borrowed)
  SELECT COALESCE(SUM(lr.amount), 0) * 100.0 / NULLIF(SUM(l.amount), 0), 0
  INTO user_loan_repayment_rate
  FROM public.loans l
  LEFT JOIN public.loan_repayments lr ON l.id = lr.loan_id
  WHERE l.user_id = p_user_id;

  -- Calculate user's membership months
  SELECT EXTRACT(EPOCH FROM (NOW() - created_at)) / 2592000 -- seconds in 30 days
  INTO user_membership_months
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- Simple credit score calculation (example logic)
  calculated_credit_score := (user_total_contributions / 100) + (user_loan_repayment_rate / 10) + (user_membership_months * 5);
  IF calculated_credit_score > 100 THEN
    calculated_credit_score := 100;
  END IF;

  -- Max loan amount based on credit score
  max_loan_amount_based_on_score := calculated_credit_score * 100; -- Example: $100 per point
  IF max_loan_amount_based_on_score > 10000 THEN -- Cap at $10,000
    max_loan_amount_based_on_score := 10000;
  END IF;

  -- Approval likelihood based on credit score
  IF calculated_credit_score >= 80 THEN
    approval_likelihood_text := 'Very High';
  ELSIF calculated_credit_score >= 60 THEN
    approval_likelihood_text := 'High';
  ELSIF calculated_credit_score >= 40 THEN
    approval_likelihood_text := 'Medium';
  ELSE
    approval_likelihood_text := 'Low';
  END IF;

  SELECT json_build_object(
    'eligibility', (
      SELECT json_build_object(
        'creditScore', calculated_credit_score,
        'maxLoanAmount', max_loan_amount_based_on_score,
        'interestRate', 12, -- Still a placeholder, can be dynamic
        'currency', 'USD',
        'approvalLikelihood', approval_likelihood_text,
        'processingTime', '3-5 business days',
        'eligibilityFactors', json_build_array(
            json_build_object('factor', 'Total Contributions', 'value', user_total_contributions),
            json_build_object('factor', 'Repayment Rate', 'value', user_loan_repayment_rate || '%'),
            json_build_object('factor', 'Membership Duration', 'value', user_membership_months || ' months')
        )
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
      FROM public.loans l
      WHERE l.user_id = p_user_id
    )
  ) INTO loan_request_data;

  RETURN loan_request_data;
END;
$$ LANGUAGE plpgsql;