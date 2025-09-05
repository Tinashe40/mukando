import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AuthLayout from './components/AuthLayout';
import withAuthorization from './components/withAuthorization';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import UserLogin from './pages/user-login';
import UserRegistration from './pages/user-registration';
import AdminDashboard from './pages/admin-dashboard';
import AuditLog from './pages/audit-log';
import ContributionHistory from './pages/contribution-history';
import GroupAnalytics from './pages/group-analytics';
import GroupCreation from './pages/group-creation';
import GroupManagement from './pages/group-management';
import LoanRequest from './pages/loan-request';
import MemberDashboard from './pages/member-dashboard';
import NotificationsCenter from './pages/notifications-center';
import PaymentProcessing from './pages/payment-processing';
import PublicGroups from './pages/public-groups';
import RecordContribution from './pages/record-contribution';
import RecordRepayment from './pages/record-repayment';
import RepaymentHistory from './pages/repayment-history';
import ReportGeneration from './pages/report-generation';
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppRoutes() {
  const AuthorizedAdminDashboard = withAuthorization(['admin'])(AdminDashboard);
  const AuthorizedAuditLog = withAuthorization(['admin'])(AuditLog);
  const AuthorizedContributionHistory = withAuthorization(['member', 'admin'])(ContributionHistory);
  const AuthorizedGroupAnalytics = withAuthorization(['admin'])(GroupAnalytics);
  const AuthorizedGroupCreation = withAuthorization(['member', 'admin'])(GroupCreation);
  const AuthorizedGroupManagement = withAuthorization(['admin'])(GroupManagement);
  const AuthorizedLoanRequest = withAuthorization(['member', 'admin'])(LoanRequest);
  const AuthorizedMemberDashboard = withAuthorization(['member', 'admin'])(MemberDashboard);
  const AuthorizedNotificationsCenter = withAuthorization(['member', 'admin'])(NotificationsCenter);
  const AuthorizedPaymentProcessing = withAuthorization(['member', 'admin'])(PaymentProcessing);
  const AuthorizedRecordContribution = withAuthorization(['member', 'admin'])(RecordContribution);
  const AuthorizedRecordRepayment = withAuthorization(['member', 'admin'])(RecordRepayment);
  const AuthorizedRepaymentHistory = withAuthorization(['member', 'admin'])(RepaymentHistory);
  const AuthorizedReportGeneration = withAuthorization(['admin'])(ReportGeneration);

  const AuthenticatedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth/login" />;
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <RouterRoutes>
            {/* Root path redirect */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Authentication Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="login" />} />
              <Route path="login" element={<UserLogin />} />
              <Route path="register" element={<UserRegistration />} />
              <Route path="callback" element={<AuthCallback />} />
            </Route>

            {/* Authenticated Routes */}
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <AppLayout />
                </AuthenticatedRoute>
              }
            >
              <Route path="member-dashboard" element={<AuthorizedMemberDashboard />} />
              <Route path="admin-dashboard" element={<AuthorizedAdminDashboard />} />
              <Route path="audit-log" element={<AuthorizedAuditLog />} />
              <Route path="contribution-history" element={<AuthorizedContributionHistory />} />
              <Route path="group-analytics" element={<AuthorizedGroupAnalytics />} />
              <Route path="group-creation" element={<AuthorizedGroupCreation />} />
              <Route path="group-management" element={<AuthorizedGroupManagement />} />
              <Route path="loan-request" element={<AuthorizedLoanRequest />} />
              <Route path="notifications-center" element={<AuthorizedNotificationsCenter />} />
              <Route path="payment-processing" element={<AuthorizedPaymentProcessing />} />
              <Route path="record-contribution" element={<AuthorizedRecordContribution />} />
              <Route path="record-repayment" element={<AuthorizedRecordRepayment />} />
              <Route path="repayment-history" element={<AuthorizedRepaymentHistory />} />
              <Route path="report-generation" element={<AuthorizedReportGeneration />} />
            </Route>

            {/* Public Routes */}
            <Route path="/public-groups" element={<PublicGroups />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Other Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default AppRoutes;