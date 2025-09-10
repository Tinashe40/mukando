import { Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Create an Account</h2>
        <p className="text-slate-500 mt-2">Join our community and start saving today.</p>
      </div>

      <RegistrationForm />

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/terms" className="text-slate-500 hover:text-blue-600 hover:underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-slate-500 hover:text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
      </div>
    </>
  );
};

export default UserRegistration;
