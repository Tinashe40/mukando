// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const validateSupabaseConfig = () => {
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file'
    );
  }

  if (!isValidUrl(supabaseUrl)) {
    throw new Error(
      `Invalid Supabase URL format: "${supabaseUrl}". ` +
      'Please provide a valid URL for VITE_SUPABASE_URL'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

let supabaseClient = null;

try {
  const { supabaseUrl, supabaseAnonKey } = validateSupabaseConfig();
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'mukando-app'
      }
    }
  });
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message);
  if (import.meta.env.MODE === 'development') {
    throw error;
  }
}

export const getCurrentUser = async () => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.error('Error getting user session:', error.message);
      return null;
    }
    
    return session?.user || null;
  } catch (error) {
    console.error('Unexpected error getting current user:', error.message);
    return null;
  }
};

export const getUserProfile = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch profile');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*, roles(name)')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error.message);
    return null;
  }
};

export const updateUserProfile = async (userId, updates) => {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized');
  }

  if (!userId) {
    throw new Error('User ID is required to update profile');
  }

  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    throw error;
  }
};

export const getUserPermissions = async (roleId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return [];
  }

  if (!roleId) {
    console.error('Role ID is required to fetch permissions');
    return [];
  }

  try {
    const { data, error } = await supabaseClient
      .from('role_permissions')
      .select('permissions:permission_id(name)')
      .eq('role_id', roleId);

    if (error) {
      console.error('Error fetching user permissions:', error.message);
      return [];
    }

    return data.map((item) => item.permissions.name);
  } catch (error) {
    console.error('Unexpected error fetching user permissions:', error.message);
    return [];
  }
};

export const getFinancialOverview = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch financial overview');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_user_financial_overview', { p_user_id: userId });

    if (error) {
      console.error('Error fetching financial overview:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching financial overview:', error.message);
    return null;
  }
};

export const getRecentActivity = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch recent activity');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*, groups(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent activity:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching recent activity:', error.message);
    return null;
  }
};

export const getUserGroups = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch user groups');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('group_members')
      .select('*, groups(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user groups:', error.message);
      return null;
    }

    return data.map(item => item.groups);
  } catch (error) {
    console.error('Unexpected error fetching user groups:', error.message);
    return null;
  }
};

export const getGroupAnalytics = async (groupId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!groupId) {
    console.error('Group ID is required to fetch group analytics');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_group_analytics', { p_group_id: groupId });

    if (error) {
      console.error('Error fetching group analytics:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching group analytics:', error.message);
    return null;
  }
};

export const getGroupManagementData = async (groupId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!groupId) {
    console.error('Group ID is required to fetch group management data');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_group_management_data', { p_group_id: groupId });

    if (error) {
      console.error('Error fetching group management data:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching group management data:', error.message);
    return null;
  }
};

export const getLoanRequestData = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch loan request data');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_loan_request_data', { p_user_id: userId });

    if (error) {
      console.error('Error fetching loan request data:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching loan request data:', error.message);
    return null;
  }
};

export const submitLoanApplication = async (applicationData) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('loans')
      .insert([applicationData])
      .select();

    if (error) {
      console.error('Error submitting loan application:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error submitting loan application:', error.message);
    return null;
  }
};

export const getPaymentProcessingData = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch payment processing data');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_payment_processing_data', { p_user_id: userId });

    if (error) {
      console.error('Error fetching payment processing data:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching payment processing data:', error.message);
    return null;
  }
};

export const getNotificationsCenterData = async (userId) => {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return null;
  }

  if (!userId) {
    console.error('User ID is required to fetch notifications center data');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('get_notifications_center_data', { p_user_id: userId });

    if (error) {
      console.error('Error fetching notifications center data:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching notifications center data:', error.message);
    return null;
  }
};

export const supabase = supabaseClient;
