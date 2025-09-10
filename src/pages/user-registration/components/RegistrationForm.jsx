import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { register: signup } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await signup(data);
      navigate('/auth/login', { 
        state: { 
          message: 'Registration successful! Please check your email to verify your account before logging in.' 
        } 
      });
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AppIcon name="AlertTriangle" className="text-destructive" size={20} />
          <p className="text-sm font-medium text-destructive">{apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Anesu Tawanda"
          {...register('fullName', { required: 'Full name is required' })}
          error={errors.fullName?.message}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="anesu@mukando.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+263 771 234 567"
        {...register('phoneNumber', { required: 'Phone number is required' })}
        error={errors.phoneNumber?.message}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
        >
          <AppIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        {...register('confirmPassword', { 
          required: 'Please confirm your password', 
          validate: (value) => value === watch('password') || 'Passwords do not match' 
        })}
        error={errors.confirmPassword?.message}
      />

      <Select
        label="Country"
        options={countryOptions}
        value={watch('country')} // Explicitly pass the value
        {...register('country', { required: 'Country is required' })}
        error={errors.country?.message}
      />

      <div className="space-y-3">
        <Checkbox
          label="I agree to the Terms and Privacy Policy"
          {...register('agreeToTerms', { required: 'You must agree to the terms' })}
          error={errors.agreeToTerms?.message}
        />
        <Checkbox
          label="Subscribe to our newsletter"
          {...register('subscribeNewsletter')}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        loading={isLoading}
        fullWidth
        className="h-12 text-base font-semibold"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
