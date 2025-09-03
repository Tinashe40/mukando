import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, supabase } from '../lib/supabase';

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase?.auth?.getSession()
        
        if (session?.user) {
          setUser(session?.user)
          setIsAuthenticated(true)
          
          // Get user profile
          const userProfile = await getUserProfile(session?.user?.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          setIsAuthenticated(true)
          
          // Get user profile
          const userProfile = await getUserProfile(session?.user?.id)
          setProfile(userProfile)
          
          // Update last login in profile
          if (event === 'SIGNED_IN') {
            await supabase?.from('user_profiles')?.update({ last_login_at: new Date()?.toISOString() })?.eq('id', session?.user?.id)
          }
        } else {
          setUser(null)
          setProfile(null)
          setIsAuthenticated(false)
        }
        setIsLoading(false)
      }
    )

    return () => subscription?.unsubscribe();
  }, [])

  // Register new user
  const register = async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      // validate input data
      if (!userData.email || !userData.password){
        throw new Error('Email and password are required')
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
            country: userData.country,
            mobile_money_provider: userData.mobileMoneyProvider,
            subscribe_newsletter: userData.subscribeNewsletter,
            role: 'member'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError){
        throw new Error(authError.message)
      }

      // Return success - user profile will be created automatically via trigger
      return { 
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: authData?.user
      };
    } catch (error) {
      console.error('Registration error:', error)

      // handle specific error cases
      let errorMessage = error.message || 'Registration failed. Please try again.';
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please log in or use a different email.';
      }else if (error.message.includes('password')){
        errorMessage= 'Please enter a valid password.';
      }
      setError(errorMessage)
      return{success: false, error: errorMessage};
    } finally {
      setIsLoading(false)
    }
  };

  // Login user
  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email: credentials?.emailOrPhone,
        password: credentials?.password
      })

      if (error) throw error

      return { success: true, user: data?.user };
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Social login
  const socialLogin = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/member-dashboard`,
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
    setIsLoading(true)
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error(error.message || 'Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    setIsLoading(true)
    try {
      if (!user) {
        throw new Error('No user logged in')
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', user?.id)?.select()?.single()

      if (error) throw error

      setProfile(data)
      return { success: true, profile: data }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Change password
  const changePassword = async (newPassword) => {
    setIsLoading(true)
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    setIsLoading(true)
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`
      })

      if (error) throw error

      return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get user statistics
  const getUserStats = () => {
    if (!profile) return null
    
    return {
      id: profile?.id,
      joinDate: profile?.created_at,
      lastLogin: profile?.last_login_at,
      profileComplete: calculateProfileCompleteness(profile),
      isActive: profile?.account_status === 'active'
    };
  }

  // Calculate profile completeness
  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0
    
    const fields = [
      'full_name', 'email', 'phone_number', 'country', 'mobile_money_provider'
    ]
    
    const completedFields = fields?.filter(field => 
      profileData?.[field] && profileData?.[field]?.toString()?.trim()
    )?.length
    
    return Math.round((completedFields / fields?.length) * 100);
  }

  const value = {
    // State
    user,
    profile,
    isLoading,
    isAuthenticated,
    
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
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext