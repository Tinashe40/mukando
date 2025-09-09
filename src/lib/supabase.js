import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing VITE_SUPABASE_URL',
    key: supabaseAnonKey ? 'Set' : 'Missing VITE_SUPABASE_ANON_KEY'
  });
}

// Validate URL format
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

if (supabaseUrl && !isValidUrl(supabaseUrl)) {
  console.error('Invalid VITE_SUPABASE_URL format:', supabaseUrl);
}

// Create supabase client with fallback values to prevent crashes
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Warning if supabase client is not initialized
if (!supabase) {
  console.warn('Supabase client not initialized. Please check your environment variables.');
}

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }
    
    const { data: { session }, error } = await supabase?.auth?.getSession()
    if (error) {
      throw error
    }
    return session?.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to get user profile
export const getUserProfile = async (userId) => {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }
    
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
    
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Helper function to update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase?.from('user_profiles')?.update({
        ...updates,
        updated_at: new Date()?.toISOString()
      })?.eq('id', userId)?.select()?.single()
    
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export const getUserPermissions = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_permissions_new', { p_user_id: userId });
  if (error) {
    console.error('Error fetching user permissions:', error);
}
  return data;
};

// Admin dashboard
export const getAdminDashboardData = async () => {
  const { data, error } = await supabase.rpc('get_admin_dashboard_data');
  if (error){
    console.error('Error fetching admin dashboard data:', error);
  }
  return data;
};

// Audit log
export const getAuditLogs = async () => {
  const { data, error } = await supabase.from('audit_logs').select('*');
  if (error) {
    console.error('Error fetching audit logs:', error);
}
  return data;
};

// Contribution history
export const getContributionHistory = async (groupId) => {
  const { data, error } = await supabase.from('contributions').select('*').eq('group_id', groupId);
  if (error){
    console.error('Error fetching contribution history:', error);
  }
  return data;
};

// Group analytics
export const getGroupAnalytics = async (groupId) => {
    const { data, error } = await supabase.rpc('get_group_analytics', { p_group_id: groupId });
    if (error){
      console.error('Error fetching group analytics:', error);
    }
    return data;
};

export const getUserGroups = async (userId) => {
    const { data, error } = await supabase
        .from('group_members')
        .select('groups(*)')
        .eq('user_id', userId);
    if (error){
      console.error('Error fetching user groups:', error);
    }
    return data ? data.map(item => item.groups) : [];
};

// Group creation
export const createGroup = async (groupData) => {
  const { data, error } = await supabase.from('groups').insert(groupData).select().single();
  if (error){
    console.error('Error creating group:', error);
  }
  return data;
};

// Group management
export const getGroupManagementData = async (groupId) => {
    const { data, error } = await supabase.rpc('get_group_management_data', { p_group_id: groupId });
    if (error){
      console.error('Error fetching group management data:', error);
    }
    return data;
};

export const inviteMember = async (invitation) => {
    const { data, error } = await supabase.rpc('invite_member', { p_invitation: invitation });
    if (error){
      console.error('Error inviting member:', error);
    }
    return data;
};

export const updateGroupSettings = async (groupId, settings) => {
    const { data, error } = await supabase.rpc('update_group_settings', { p_group_id: groupId, p_settings: settings });
    if (error){
      console.error('Error updating group settings:', error);
    }
    return data;
};

export const approveLoan = async (loanId) => {
    const { data, error } = await supabase.rpc('approve_loan', { p_loan_id: loanId });
    if (error){
      console.error('Error approving loan:', error);
    }
    return data;
};

export const rejectLoan = async (loanId) => {
    const { data, error } = await supabase.rpc('reject_loan', { p_loan_id: loanId });
    if (error){
      console.error('Error rejecting loan:', error);
    }
    return data;
};


// Loan request
export const getLoanRequestData = async (groupId) => {
    const { data, error } = await supabase.rpc('get_loan_request_data', { p_group_id: groupId });
    if (error){
      console.error('Error fetching loan request data:', error);
    }
    return data;
};

export const submitLoanApplication = async (application) => {
    const { data, error } = await supabase.from('loan_requests').insert(application).select().single();
    if (error){
      console.error('Error submitting loan application:', error);
    }
    return data;
};

// Member dashboard
export const getFinancialOverview = async (userId) => {
    const { data, error } = await supabase.rpc('get_financial_overview', { p_user_id: userId });
    if (error){
      console.error('Error fetching financial overview:', error);
    }
    return data;
};

export const getRecentActivity = async (userId) => {
    const { data: contributions, error: contributionsError } = await supabase
        .from('contributions')
        .select('id, amount, created_at, \'\' as type, \'Contribution\' as title, \'Money added to your savings\' as description')
        .eq('user_id', userId);

    const { data: loanRepayments, error: loanRepaymentsError } = await supabase
        .from('loan_repayments')
        .select('id, amount, repayment_date as created_at, \'\' as type, \'Loan Repayment\' as title, \'Payment made towards your loan\' as description')
        .eq('user_id', userId);

    if (contributionsError) {
        console.error('Error fetching contributions:', contributionsError);
        return [];
    }
    if (loanRepaymentsError) {
        console.error('Error fetching loan repayments:', loanRepaymentsError);
        return [];
    }

    const combinedActivity = [...contributions, ...loanRepayments];

    combinedActivity.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return combinedActivity.slice(0, 5);
};

// Notifications center
export const getNotificationsCenterData = async (userId) => {
    const { data, error } = await supabase.rpc('get_notifications_center_data', { p_user_id: userId });
    if (error) {
      console.error('Error fetching notifications center data:', error);
    }
    return data;
};

export const getNotificationSettings = async (userId) => {
    const { data, error } = await supabase.from('notification_settings').select('*').eq('user_id', userId).single();
    if (error) {
      console.error('Error fetching notification settings:', error);
    }
    return data;
};

export const updateNotificationSettings = async (userId, settings) => {
    const { data, error } = await supabase.from('notification_settings').update(settings).eq('user_id', userId);
    if (error) {
      console.error('Error updating notification settings:', error);
    }
    return data;
};

export const getScheduledNotifications = async (userId) => {
    const { data, error } = await supabase.from('scheduled_notifications').select('*').eq('user_id', userId);
    if (error) {
      console.error('Error fetching scheduled notifications:', error);
    }
    return data;
};

// Payment processing
export const getPaymentProcessingData = async (groupId) => {
    const { data, error } = await supabase.rpc('get_payment_processing_data', { p_group_id: groupId });
    if (error) {
      console.error('Error fetching payment processing data:', error);
    }
    return data;
};

// Record contribution
export const getUsers = async () => {
    const { data, error } = await supabase.from('auth.users').select('id');
    if (error) {
      console.error('Error fetching users:', error);
    }
    return data;
};

export const recordContribution = async (contribution) => {
    const { data, error } = await supabase.from('contributions').insert(contribution);
    if (error) {
      console.error('Error recording contribution:', error);
    }
    return data;
};

// Record repayment
export const getUserLoans = async (userId) => {
    const { data, error } = await supabase.from('loans').select('*').eq('user_id', userId);
    if (error) {
      console.error('Error fetching user loans:', error);
    }
    return data;
};

export const recordRepayment = async (repayment) => {
    const { data, error } = await supabase.from('loan_repayments').insert(repayment);
    if (error) {
      console.error('Error recording repayment:', error);
    }
    return data;
};

// Repayment history
export const getAllRepayments = async (groupId) => {
    const { data, error } = await supabase.from('loan_repayments').select('*').eq('group_id', groupId);
    if (error){
      console.error('Error fetching all repayments:', error);
    }
    return data;
};

export const getPublicGroups = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('groups')
      .select('id, name, description, (SELECT COUNT(*) FROM group_members WHERE group_id = groups.id) as member_count')
      .eq('is_public', true); // Assuming an 'is_public' column in the 'groups' table

    if (error) {
      console.error('Error fetching public groups:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching public groups:', error.message);
    return null;
  }
};
