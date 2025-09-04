import React from 'react';
import { BrowserRouter, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import AppLayout from './components/AppLayout';
import AuthLayout from './components/AuthLayout';
import withAuthorization from './components/withAuthorization';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import UserLogin from './pages/user-login';
import UserRegistration from './pages/user-registration';
import AuthCallback from './pages/AuthCallback';
import MemberDashboard from './pages/member-dashboard';
import GroupAnalytics from './pages/group-analytics';
import GroupManagement from './pages/group-management';
import LoanRequest from './pages/loan-request';
import NotificationsCenter from './pages/notifications-center';
import PaymentProcessing from './pages/payment-processing';
import { useAuth } from './contexts/AuthContext';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

const AnalyticsPage = withAuthorization(GroupAnalytics, ['admin', 'treasurer']);
const ManagementPage = withAuthorization(GroupManagement, ['admin']);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Authenticated Routes */}
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <AppLayout />
              </AuthenticatedRoute>
            }
          >
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="management" element={<ManagementPage />} />
            <Route path="loans" element={<LoanRequest />} />
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="payments" element={<PaymentProcessing />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="register" element={<UserRegistration />} />
            <Route path="callback" element={<AuthCallback />} />
          </Route>

          {/* Other Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;