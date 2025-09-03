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

const LoanRequest = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('application');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for member eligibility and status
  const [memberData] = useState({
    id: 'MEM001',
    name: 'Sarah Mwangi',
    email: 'sarah.mwangi@example.com',
    currentSavings: 25000,
    membershipMonths: 8,
    contributionStreak: 6,
    activeLoans: 0,
    totalContributions: 120000,
    groupId: 'GRP001',
    joinedDate: '2024-01-15'
  });

  const [eligibilityData] = useState({
    creditScore: 78,
    maxLoanAmount: 75000,
    interestRate: 0.15,
    currency: 'USD',
    approvalLikelihood: 'High',
    processingTime: '3-5 business days'
  });

  // Mock existing applications
  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      amount: 15000,
      currency: 'USD',
      purpose: 'business',
      repaymentPeriod: 12,
      status: 'pending',
      progress: 60,
      submittedAt: '2025-01-02T10:30:00Z',
      updatedAt: '2025-01-03T14:20:00Z',
      statusMessage: 'Your application is under review by the loan committee.',
      nextAction: 'Committee review scheduled for January 5th',
      expectedResponse: '2 business days',
      documents: ['id_copy.pdf', 'business_plan.pdf']
    },
    {
      id: 'APP002',
      amount: 8000,
      currency: 'USD',
      purpose: 'education',
      repaymentPeriod: 6,
      status: 'approved',
      progress: 100,
      submittedAt: '2024-12-15T09:15:00Z',
      updatedAt: '2024-12-20T16:45:00Z',
      statusMessage: 'Congratulations! Your loan has been approved.',
      nextAction: 'Accept loan terms and schedule disbursement'
    }
  ]);

  const tabs = [
    { id: 'application', label: 'New Application', icon: 'FileText' },
    { id: 'calculator', label: 'Loan Calculator', icon: 'Calculator' },
    { id: 'status', label: 'My Applications', icon: 'Clock', badge: applications?.filter(app => app?.status === 'pending')?.length }
  ];

  useEffect(() => {
    document.title = 'Loan Request - Mukando';
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleApplicationSubmit = async (applicationData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newApplication = {
        id: `APP${String(applications?.length + 1)?.padStart(3, '0')}`,
        ...applicationData,
        amount: parseFloat(applicationData?.amount),
        currency: eligibilityData?.currency,
        status: 'pending',
        progress: 25,
        submittedAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        statusMessage: 'Application submitted successfully. Initial review in progress.',
        nextAction: 'Document verification',
        expectedResponse: eligibilityData?.processingTime
      };
      
      setApplications(prev => [newApplication, ...prev]);
      setActiveTab('status');
      
      // Show success notification (would typically use a toast library)
      alert('Loan application submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewApplicationDetails = (applicationId) => {
    // Navigate to application details or show modal
    console.log('Viewing application:', applicationId);
  };

  const handleWithdrawApplication = (applicationId) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      setApplications(prev => 
        prev?.map(app => 
          app?.id === applicationId 
            ? { ...app, status: 'withdrawn', updatedAt: new Date()?.toISOString() }
            : app
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole="member"
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16 pb-20 lg:pb-6`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/member-dashboard')}
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Loan Request</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Loan Request
                </h1>
                <p className="text-muted-foreground">
                  Apply for loans with transparent eligibility assessment and real-time tracking
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/member-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  iconName="HelpCircle"
                  iconPosition="left"
                >
                  Help
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                    {tab?.badge && tab?.badge > 0 && (
                      <span className="bg-accent text-accent-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {tab?.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2">
              {activeTab === 'application' && (
                <LoanApplicationForm
                  onSubmit={handleApplicationSubmit}
                  eligibilityData={eligibilityData}
                  isLoading={isSubmitting}
                />
              )}
              
              {activeTab === 'calculator' && (
                <LoanCalculator eligibilityData={eligibilityData} />
              )}
              
              {activeTab === 'status' && (
                <ApplicationStatus
                  applications={applications}
                  onViewDetails={handleViewApplicationDetails}
                  onWithdraw={handleWithdrawApplication}
                />
              )}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <EligibilityPanel
                eligibilityData={eligibilityData}
                memberData={memberData}
              />
              
              {/* Quick Actions */}
              <div className="bg-card rounded-lg border border-border shadow-warm p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Users"
                    iconPosition="left"
                    onClick={() => navigate('/group-management')}
                  >
                    View Group Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BarChart3"
                    iconPosition="left"
                    onClick={() => navigate('/group-analytics')}
                  >
                    Financial Analytics
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Wallet"
                    iconPosition="left"
                    onClick={() => navigate('/payment-processing')}
                  >
                    Payment History
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Bell"
                    iconPosition="left"
                    onClick={() => navigate('/notifications-center')}
                  >
                    Notifications
                  </Button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="MessageCircle" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">Get assistance with your loan application</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Phone" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">+263 77 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">support@mukando.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">Mon-Fri, 8AM-6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanRequest;