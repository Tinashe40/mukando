ALTER TABLE public.groups
ADD COLUMN settings JSONB NOT NULL DEFAULT '{}'::JSONB;

-- Migrate existing settings to the new JSONB column (optional, but good for existing data)
UPDATE public.groups
SET settings = jsonb_build_object(
    'general', jsonb_build_object(
        'groupName', name,
        'description', description,
        'currency', 'USD', -- Default or infer from existing data
        'maxMembers', 100, -- Default or infer
        'allowInvitations', true, -- Default or infer
        'requireApproval', true -- Default or infer
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
);

-- Remove old columns (optional, after data migration is confirmed)
-- ALTER TABLE public.groups DROP COLUMN name;
-- ALTER TABLE public.groups DROP COLUMN description;
-- ... and so on for other settings columns
