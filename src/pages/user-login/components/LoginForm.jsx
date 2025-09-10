import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: location?.state?.email || '',
      password: '',
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location?.state?.message || '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage('');
    try {
      await login(data);
      navigate('/member-dashboard');
    } catch (error) {
      setApiError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AppIcon name="AlertTriangle" className="text-destructive" size={20} />
          <p className="text-sm font-medium text-destructive">{apiError}</p>
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <AppIcon name="CheckCircle" className="text-success" size={20} />
          <p className="text-sm font-medium text-success">{successMessage}</p>
        </div>
      )}

      <div className="space-y-2">
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
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
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          {...register('rememberMe')}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        loading={isLoading}
        fullWidth
        className="h-12 text-base font-semibold"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;