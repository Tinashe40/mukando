import React from 'react';
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
      </div>
    </>
  );
};

export default UserRegistration;
