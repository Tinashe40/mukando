import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('Error fetching user profile:', error);
  }
  return data;
};

export const getUserPermissions = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_permissions', { p_user_id: userId });
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
    // This is a guess. There is no specific migration for this.
    // I will assume it gets the last 5 contributions and loans for the user.
    const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
    if (error) {
      console.error('Error fetching recent activity:', error);
    }
    return data;
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
    const { data, error } = await supabase.from('users').select('id, username');
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