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
import CreateGroup from './pages/group-creation';
import ContributionHistory from './pages/contribution-history';
import RecordContribution from './pages/record-contribution';
import RecordRepayment from './pages/record-repayment';
import RepaymentHistory from './pages/repayment-history';
import ReportGeneration from './pages/report-generation';
import AuditLog from './pages/audit-log';
import AdminDashboard from './pages/admin-dashboard';
import PublicGroups from './pages/public-groups';
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
            <Route path="groups/create" element={<CreateGroup />} />
            <Route path="contributions" element={<ContributionHistory />} />
            <Route path="contributions/record" element={withAuthorization(RecordContribution, ['admin', 'treasurer'])} />
            <Route path="loans/repay" element={<RecordRepayment />} />
            <Route path="loans/repayments" element={withAuthorization(RepaymentHistory, ['admin', 'treasurer'])} />
            <Route path="reports" element={withAuthorization(ReportGeneration, ['admin', 'treasurer'])} />
            <Route path="audit-log" element={withAuthorization(AuditLog, ['admin', 'superadmin'])} />
            <Route path="admin-dashboard" element={withAuthorization(AdminDashboard, ['admin', 'superadmin'])} />
            <Route path="public-groups" element={<PublicGroups />} />
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