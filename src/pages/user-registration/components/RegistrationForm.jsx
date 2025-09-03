import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: 'ZW',
    mobileMoneyProvider: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countryOptions = [
    { value: 'ZW', label: 'Zimbabwe' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'KE', label: 'Kenya' },
    { value: 'UG', label: 'Uganda' },
    { value: 'TZ', label: 'Tanzania' },
    { value: 'MW', label: 'Malawi' },
    { value: 'ZM', label: 'Zambia' },
    { value: 'BW', label: 'Botswana' }
  ];

  const mobileMoneyOptions = {
    ZW: [
      { value: 'ecocash', label: 'EcoCash' },
      { value: 'onemoney', label: 'OneMoney' },
      { value: 'telecash', label: 'TeleCash' },
      { value: 'pesepay', label: 'Pesepay' }
    ],
    ZA: [
      { value: 'mpesa', label: 'M-Pesa' },
      { value: 'capitec', label: 'Capitec Pay' }
    ],
    KE: [
      { value: 'mpesa', label: 'M-Pesa' },
      { value: 'airtel', label: 'Airtel Money' }
    ]
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (field === 'country') {
      setFormData(prev => ({ ...prev, mobileMoneyProvider: '' }));
    }
    
    // Clear errors when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/?.test(formData?.phoneNumber?.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result?.success) {
        // Show success message
        console.log('Registration successful:', result?.message);
        
        // Navigate to login or verification page
        navigate('/user-login', { 
          state: { 
            message: result?.message,
            email: formData?.email 
          } 
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-0 p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Icon name="UserPlus" size={28} color="white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Join Mukando
          </h2>
          <p className="text-gray-500 text-lg">
            Start your community savings journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-200"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-200"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+263 77 123 4567"
              value={formData?.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
              error={errors?.phoneNumber}
              description="Include country code (e.g., +263 for Zimbabwe)"
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-200"
              required
            />
          </div>

          {/* Country and Mobile Money Provider in a Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Country"
              options={countryOptions}
              value={formData?.country}
              onChange={(value) => handleInputChange('country', value)}
              className="rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
              required
            />

            {mobileMoneyOptions?.[formData?.country] && (
              <Select
                label="Mobile Money Provider"
                options={mobileMoneyOptions?.[formData?.country]}
                value={formData?.mobileMoneyProvider}
                onChange={(value) => handleInputChange('mobileMoneyProvider', value)}
                placeholder="Select provider"
                description="For USD payments and withdrawals"
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
              />
            )}
          </div>

          {/* Password */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
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
            
            {/* Password Strength Indicator */}
            {formData?.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Password strength:</span>
                  <span className={`font-semibold ${
                    passwordStrength < 50 ? 'text-red-500' : 
                    passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 pr-12 transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-12 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <Checkbox
              label="I agree to the Terms and Conditions and Privacy Policy"
              checked={formData?.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
              error={errors?.agreeToTerms}
              className="text-sm"
              required
            />
            
            <Checkbox
              label="Subscribe to newsletter for updates and financial tips"
              checked={formData?.subscribeNewsletter}
              onChange={(e) => handleInputChange('subscribeNewsletter', e?.target?.checked)}
              className="text-sm"
            />
          </div>

          {/* Submit Error */}
          {errors?.submit && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 leading-relaxed">{errors?.submit}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            className="h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            iconName="UserPlus"
            iconPosition="left"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/user-login')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;