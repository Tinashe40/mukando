import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import GroupManagement from './pages/group-management';
import NotificationsCenter from './pages/notifications-center';
import LoanRequest from './pages/loan-request';
import GroupAnalytics from './pages/group-analytics';
import UserRegistration from './pages/user-registration';
import MemberDashboard from './pages/member-dashboard';
import PaymentProcessing from './pages/payment-processing';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<GroupAnalytics />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/group-management" element={<GroupManagement />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/loan-request" element={<LoanRequest />} />
        <Route path="/group-analytics" element={<GroupAnalytics />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
