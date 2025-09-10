import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AuthLayout from './components/AuthLayout';
import AuthNavigator from './components/AuthNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/ui/LoadingSpinner';
import withAuthorization from './components/withAuthorization';
import { useAuth } from './contexts/AuthContext';

// Lazy load components
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const UserLogin = lazy(() => import('./pages/user-login'));
const UserRegistration = lazy(() => import('./pages/user-registration'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
const AuditLog = lazy(() => import('./pages/audit-log'));
const ContributionHistory = lazy(() => import('./pages/contribution-history'));
const GroupAnalytics = lazy(() => import('./pages/group-analytics'));
const GroupCreation = lazy(() => import('./pages/group-creation'));
const GroupManagement = lazy(() => import('./pages/group-management'));
const LoanRequest = lazy(() => import('./pages/loan-request'));
const MemberDashboard = lazy(() => import('./pages/member-dashboard'));
const NotificationsCenter = lazy(() => import('./pages/notifications-center'));
const PaymentProcessing = lazy(() => import('./pages/payment-processing'));
const PublicGroups = lazy(() => import('./pages/public-groups'));
const RecordContribution = lazy(() => import('./pages/record-contribution'));
const RecordRepayment = lazy(() => import('./pages/record-repayment'));
const RepaymentHistory = lazy(() => import('./pages/repayment-history'));
const ReportGeneration = lazy(() => import('./pages/report-generation'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));

function AppRoutes() {
  // Create authorized components
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
        <AuthNavigator />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
              <LoadingSpinner size="lg" className="text-blue-600" />
              <p className="mt-4 text-slate-600 font-medium">Loading application...</p>
            </div>
          </div>
        }>
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