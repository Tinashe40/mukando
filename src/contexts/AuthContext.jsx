import { createContext, useContext, useEffect, useState } from 'react';
import { getUserPermissions, getUserProfile, supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }
        
        if (session?.user && mounted) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Get user profile
          const userProfile = await getUserProfile(session.user.id);
          if (userProfile && mounted) {
            setProfile(userProfile);
          }

          // Get user permissions if profile exists
          if (userProfile?.role_id && mounted) {
            const userPermissions = await getUserPermissions(userProfile.id);
            setPermissions(userPermissions || []);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setError(error.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          setIsLoading(true);
          if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
            
            // Get user profile
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile || null);

            // Get user permissions if profile exists
            if (userProfile?.role_id) {
              const userPermissions = await getUserPermissions(userProfile.role_id);
              setPermissions(userPermissions || []);
            }
            
            // Update last login in profile
            if (event === 'SIGNED_IN' && userProfile) {
              await supabase
                .from('profiles')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', session.user.id);
            }
          } else {
            setUser(null);
            setProfile(null);
            setPermissions([]);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Register new user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input data
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Create user profile manually instead of relying on trigger
      if (authData.user) {
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'member')
          .single();

        if (roleError) {
          throw new Error(roleError.message);
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
            country: userData.country,
            mobile_money_provider: userData.mobileMoneyProvider,
            subscribe_newsletter: userData.subscribeNewsletter,
            role_id: roleData.id, // Default role
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here as auth was successful, just profile creation failed
        }
      }

      return { 
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: authData.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = error.message || 'Registration failed. Please try again.';
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please log in or use a different email.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (error.message.includes('email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Login user - handles both email and phone
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if input is email or phone
      const isEmail = credentials.emailOrPhone.includes('@');
      let emailToUse = credentials.emailOrPhone;
      
      // If it's a phone number, look up the associated email
      if (!isEmail) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone_number', credentials.emailOrPhone)
          .single();
          
        if (profileError || !profileData) {
          throw new Error('No account found with this phone number.');
        }
        
        emailToUse = profileData.email;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: credentials.password
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email/phone or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before logging in.');
        }
        throw authError;
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Social login
  const socialLogin = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Social login error:', error);
      throw new Error(error.message || 'Social login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, profile: data };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (newPassword) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user statistics
  const getUserStats = () => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      joinDate: profile.created_at,
      lastLogin: profile.last_login_at,
      profileComplete: calculateProfileCompleteness(profile),
      isActive: profile.account_status === 'active'
    };
  };

  // Calculate profile completeness
  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0;
    
    const fields = [
      'full_name', 'email', 'phone_number', 'country', 'mobile_money_provider'
    ];
    
    const completedFields = fields.filter(field => 
      profileData[field] && profileData[field].toString().trim()
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const value = {
    // State
    user,
    profile,
    permissions,
    isLoading,
    isAuthenticated,
    error,
    
    // Actions
    register,
    login,
    socialLogin,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    
    // Utilities
    getUserStats,
    calculateProfileCompleteness
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;