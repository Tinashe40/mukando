import ErrorBoundary from "components/ErrorBoundary";
import ScrollToTop from "components/ScrollToTop";
import NotFound from "pages/NotFound";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import GroupAnalytics from './pages/group-analytics';
import GroupManagement from './pages/group-management';
import LoanRequest from './pages/loan-request';
import MemberDashboard from './pages/member-dashboard';
import NotificationsCenter from './pages/notifications-center';
import PaymentProcessing from './pages/payment-processing';
import UserLogin from './pages/user-login';
import UserRegistration from './pages/user-registration';
import AuthCallback from './pages/AuthCallback';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/dashboard" element={<GroupAnalytics />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/group-management" element={<GroupManagement />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/loan-request" element={<LoanRequest />} />
        <Route path="/group-analytics" element={<GroupAnalytics />} />
        <Route path="/" element={<UserRegistration />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
