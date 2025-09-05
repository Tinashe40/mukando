-- Add the settings column if it doesn't exist
ALTER TABLE public.groups
ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}'::JSONB;

-- Only migrate data if the settings column is empty (contains only default empty JSON)
UPDATE public.groups
SET settings = jsonb_build_object(
    'general', jsonb_build_object(
        'groupName', name,
        'description', description,
        'currency', 'USD',
        'maxMembers', 100,
        'allowInvitations', true,
        'requireApproval', true
    ),
    'contributions', jsonb_build_object(
        'minimumAmount', 0,
        'maximumAmount', 1000,
        'frequency', 'monthly',
        'dueDate', 15,
        'penaltyType', 'percentage',
        'penaltyAmount', 5,
        'gracePeriod', 3
    ),
    'loans', jsonb_build_object(
        'minimumAmount', 0,
        'maximumAmount', 5000,
        'interestRate', 12,
        'maxTermMonths', 12,
        'minMembershipMonths', 0,
        'minCreditScore', 0,
        'requireGuarantor', false,
        'allowMultipleLoans', false
    ),
    'notifications', jsonb_build_object(
        'email', jsonb_build_object(
            'contributionReminders', true,
            'loanApprovals', true,
            'paymentConfirmations', true
        ),
        'sms', jsonb_build_object(
            'paymentReminders', true,
            'loanUpdates', true
        ),
        'reminderDays', 3
    ),
    'security', jsonb_build_object(
        'requireTwoFactor', false,
        'auditLogging', true,
        'requireApprovalForLargeTransactions', false,
        'largeTransactionThreshold', 1000,
        'sessionTimeout', 60
    )
)
WHERE settings = '{}'::jsonb; -- Only update if settings is empty

-- Note: Don't drop the name and description columns yet as they might still be needed
-- by your application. Consider a phased approach to removing these columns.