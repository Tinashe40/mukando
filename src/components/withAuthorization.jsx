import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
  const ComponentWithAuthorization = (props) => {
    const { profile, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    if (!profile) {
      // Profile is still loading or not available
      return <LoadingSpinner />;
    }

    const userRole = profile.role; // Assuming profile.role holds the role name

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthorization;
};

export default withAuthorization;