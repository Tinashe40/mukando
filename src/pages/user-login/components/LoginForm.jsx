import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    emailOrPhone: location?.state?.email || '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(location?.state?.message || '');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/member-dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: error.message || 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.emailOrPhone.trim()) {
      setErrors({ emailOrPhone: 'Please enter your email address first' });
      return;
    }
    
    // Check if input is email or phone
    const isEmail = formData.emailOrPhone.includes('@');
    let emailToUse = formData.emailOrPhone;
    
    // If it's a phone number, look up the associated email
    if (!isEmail) {
      try {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone_number', formData.emailOrPhone)
          .single();
          
        if (profileError || !profiles) {
          setErrors({ emailOrPhone: 'No account found with this phone number.' });
          return;
        }
        
        emailToUse = profiles.email;
      } catch (error) {
        setErrors({ general: 'Error looking up account. Please try again.' });
        return;
      }
    }
    
    setIsLoading(true);
    try {
      const result = await resetPassword(emailToUse);
      if (result.success) {
        setSuccessMessage(result.message);
        setErrors({});
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Password reset failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-0 p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Icon name="LogIn" size={28} color="white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-lg">
            Sign in to continue your savings journey
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700 leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Phone Input */}
          <div className="space-y-2">
            <Input
              label="Email or Phone Number"
              type="text"
              placeholder="Enter your email or phone number"
              value={formData.emailOrPhone}
              onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
              error={errors.emailOrPhone}
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-200"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 pr-12 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-12 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="text-sm"
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 leading-relaxed">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            fullWidth
            className="h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            iconName="LogIn"
            iconPosition="left"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Create Account Link */}
          <div className="text-center pt-4">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/register')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create new account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;