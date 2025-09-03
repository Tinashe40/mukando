// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

/**
 * Validates if a string is a valid URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if the URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Validates required environment variables for Supabase
 * @throws {Error} If required environment variables are missing or invalid
 */
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

// Initialize Supabase client with enhanced configuration
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
  // In development, we might want to throw the error to make it visible
  if (import.meta.env.MODE === 'development') {
    throw error;
  }
}

/**
 * Gets the current authenticated user
 * @returns {Promise<Object|null>} The current user object or null if not authenticated
 */
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

/**
 * Retrieves a user's profile from the database
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object|null>} The user profile or null if not found
 */
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
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid throwing on no results

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

/**
 * Updates a user's profile in the database
 * @param {string} userId - The ID of the user to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated user profile
 * @throws {Error} If the update fails
 */
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

// Export the supabase client instance
export const supabase = supabaseClient;

// Additional helper functions can be added below