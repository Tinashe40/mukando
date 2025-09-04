import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const withAuthorization = (WrappedComponent, allowedRoles) => {
  const ComponentWithAuthorization = (props) => {
    const { profile, permissions } = useAuth();

    if (!profile) {
      return <Navigate to="/user-login" />;
    }

    const userRole = profile.roles?.name;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthorization;
};

export default withAuthorization;
