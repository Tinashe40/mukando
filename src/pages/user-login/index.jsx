import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';

const UserLogin = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
        <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
      </div>
      
      <LoginForm />

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-500">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-semibold text-blue-600 hover:underline">
            Sign up for free
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

export default UserLogin;
