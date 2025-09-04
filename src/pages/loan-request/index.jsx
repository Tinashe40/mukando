import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoanApplicationForm from './components/LoanApplicationForm';
import EligibilityPanel from './components/EligibilityPanel';
import LoanCalculator from './components/LoanCalculator';
import ApplicationStatus from './components/ApplicationStatus';
import { useAuth } from '../../contexts/AuthContext';
import { getLoanRequestData, submitLoanApplication } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoanRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loanRequestData, setLoanRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('application');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (user) {
        setIsLoading(true);
        const data = await getLoanRequestData(user.id);
        setLoanRequestData(data);
        setIsLoading(false);
      }
    };
    fetchLoanData();
  }, [user]);

  const handleApplicationSubmit = async (applicationData) => {
    setIsSubmitting(true);
    try {
      const newApplication = await submitLoanApplication({ ...applicationData, user_id: user.id });
      if (newApplication) {
        setLoanRequestData(prev => ({ ...prev, applications: [newApplication[0], ...prev.applications] }));
        setActiveTab('status');
        alert('Loan application submitted successfully!');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!loanRequestData) {
      return (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Could not load loan request data.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {activeTab === 'application' && (
            <LoanApplicationForm
              onSubmit={handleApplicationSubmit}
              eligibilityData={loanRequestData.eligibility}
              isLoading={isSubmitting}
            />
          )}
          {activeTab === 'calculator' && (
            <LoanCalculator eligibilityData={loanRequestData.eligibility} />
          )}
          {activeTab === 'status' && (
            <ApplicationStatus applications={loanRequestData.applications || []} />
          )}
        </div>
        <div className="space-y-6">
          <EligibilityPanel eligibilityData={loanRequestData.eligibility} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole="member"
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16 pb-20 lg:pb-6`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Loan Request
            </h1>
            <p className="text-muted-foreground">
              Apply for loans with transparent eligibility assessment and real-time tracking
            </p>
          </div>
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                <button onClick={() => setActiveTab('application')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'application' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
                  <Icon name="FileText" size={16} />
                  New Application
                </button>
                <button onClick={() => setActiveTab('calculator')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'calculator' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
                  <Icon name="Calculator" size={16} />
                  Loan Calculator
                </button>
                <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'status' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
                  <Icon name="Clock" size={16} />
                  My Applications
                </button>
              </nav>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default LoanRequest;
