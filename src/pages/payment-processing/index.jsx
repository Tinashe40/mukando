import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentMethodCard from './components/PaymentMethodCard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import SecurityNotice from './components/SecurityNotice';
import ProcessingModal from './components/ProcessingModal';
import usePesePayment from '../../hooks/usePesePayment';

const PaymentProcessing = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('verification');
  const [transactionData, setTransactionData] = useState(null);
  const [activeTab, setActiveTab] = useState('payment');

  // Use enhanced PesePay hook with official SDK
  const {
    isLoading,
    error,
    paymentData,
    connectionStatus,
    supportedMethods,
    processPayment,
    checkStatus,
    clearError,
    reset,
    isConnected,
    isDisconnected
  } = usePesePayment();

  // Mock user data
  const userBalance = 1250.75;
  const userInfo = {
    name: 'Sarah Mwangi',
    phone: '+263771234567',
    email: 'sarah@example.com'
  };

  // Enhanced payment methods with PesePay as main method
  const paymentMethods = [
    {
      id: 'pesepay',
      type: 'pesepay',
      name: 'PesePay',
      description: 'Main payment gateway - Fast & Secure',
      status: isConnected ? 'available' : 'unavailable',
      fee: 1.5,
      feeType: 'percentage',
      dailyLimit: 10000,
      processingTime: '2-5 minutes',
      isOfficial: true,
      isPrimary: true, // Mark as primary method
      features: ['Instant processing', 'Multiple currencies', 'Secure encryption', 'Primary method']
    },
    {
      id: 'ecocash',
      type: 'ecocash',
      name: 'EcoCash',
      description: 'Pay using your EcoCash mobile wallet via PesePay',
      status: isConnected ? 'available' : 'unavailable',
      fee: 2.5,
      feeType: 'percentage',
      dailyLimit: 5000,
      processingTime: 'Instant'
    },
    {
      id: 'onemoney',
      type: 'onemoney',
      name: 'OneMoney',
      description: 'NetOne mobile money service via PesePay',
      status: isConnected ? 'available' : 'unavailable',
      fee: 2.0,
      feeType: 'percentage',
      dailyLimit: 3000,
      processingTime: 'Instant'
    },
    {
      id: 'telecash',
      type: 'telecash',
      name: 'Telecash',
      description: 'Telecel mobile money platform via PesePay',
      status: isConnected ? 'available' : 'maintenance',
      fee: 2.2,
      feeType: 'percentage',
      dailyLimit: 2500,
      processingTime: 'Instant',
      maintenanceUntil: '15:00 today'
    },
    // Downgrade other methods as secondary
    {
      id: 'bank',
      type: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank account transfer (Alternative method)',
      status: 'available',
      fee: 5.0,
      feeType: 'fixed',
      dailyLimit: 50000,
      processingTime: '1-3 business days',
      isSecondary: true
    },
    {
      id: 'cash',
      type: 'cash',
      name: 'Cash Deposit',
      description: 'Deposit cash at authorized agents (Alternative method)',
      status: 'available',
      fee: 0,
      feeType: 'fixed',
      dailyLimit: 1000,
      processingTime: 'Manual verification',
      isSecondary: true
    }
  ];

  // Mock transaction history with PesePay transactions
  const transactionHistory = [
    {
      id: 'txn_001',
      amount: 50.00,
      fee: 1.25,
      method: 'EcoCash',
      recipient: 'Group Main Account',
      purpose: 'contribution',
      status: 'completed',
      date: '2025-01-02T14:30:00Z',
      reference: 'Monthly contribution Jan 2025',
      pesePayRef: 'PP_MKD123456'
    },
    {
      id: 'txn_002',
      amount: 200.00,
      fee: 5.00,
      method: 'Bank Transfer',
      recipient: 'Group Main Account',
      purpose: 'loan_repayment',
      status: 'completed',
      date: '2025-01-01T09:15:00Z',
      reference: 'Loan repayment #LN001'
    },
    {
      id: 'txn_003',
      amount: 25.00,
      fee: 0.50,
      method: 'OneMoney',
      recipient: 'Emergency Fund Account',
      purpose: 'emergency_fund',
      status: 'pending',
      date: '2025-01-01T16:45:00Z',
      reference: 'Emergency fund contribution',
      pesePayRef: 'PP_MKD789012'
    },
    {
      id: 'txn_004',
      amount: 75.00,
      fee: 1.88,
      method: 'EcoCash',
      recipient: 'Group Main Account',
      purpose: 'penalty',
      status: 'failed',
      date: '2024-12-30T11:20:00Z',
      reference: 'Late payment penalty',
      errorMessage: 'Insufficient funds in mobile wallet',
      pesePayRef: 'PP_MKD345678'
    },
    {
      id: 'txn_005',
      amount: 100.00,
      fee: 2.50,
      method: 'PesePay',
      recipient: 'Group Main Account',
      purpose: 'contribution',
      status: 'completed',
      date: '2024-12-28T13:10:00Z',
      reference: 'December contribution',
      pesePayRef: 'PP_MKD901234'
    }
  ];

  // Ensure all amounts are in USD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Force USD throughout the application
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  };

  // Handle method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    clearError(); // Clear any previous errors
  };

  // Handle transaction submission with PesePay integration
  const handleTransactionSubmit = async (data) => {
    setTransactionData(data);
    setShowModal(true);
    setModalStep('verification');
  };

  // Handle verification and process payment with enhanced error handling
  const handleVerificationConfirm = async (verificationCode) => {
    setModalStep('processing');

    try {
      // Enhanced payment processing following the working sample pattern
      const paymentPayload = {
        amount: transactionData?.amount,
        currency: transactionData?.currency || 'USD',
        customerName: transactionData?.customerName || userInfo?.name,
        customerEmail: transactionData?.customerEmail || userInfo?.email,
        customerPhone: transactionData?.phoneNumber || userInfo?.phone,
        reference: transactionData?.reference,
        purpose: transactionData?.purpose,
        method: selectedMethod
      };

      console.log('Processing payment with enhanced PesePay integration:', paymentPayload);

      const result = await processPayment(paymentPayload);
      
      if (result?.success) {
        setModalStep('success');
        
        // Enhanced redirect handling following the sample pattern
        if (result?.payment_url || result?.redirectUrl) {
          // Store payment data for later verification using the reference pattern
          const paymentInfo = {
            referenceNumber: result?.reference,
            transactionId: result?.reference,
            amount: paymentPayload?.amount,
            timestamp: new Date()?.toISOString()
          };
          
          localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
          
          // Redirect to payment page following the sample pattern
          const paymentUrl = result?.payment_url || result?.redirectUrl;
          console.log('Redirecting to PesePay payment URL:', paymentUrl);
          window.open(paymentUrl, '_blank');
        }
      } else {
        console.error('Payment processing failed:', result?.error);
        setModalStep('error');
      }
    } catch (err) {
      console.error('Payment processing failed:', err);
      setModalStep('error');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setModalStep('verification');
    setTransactionData(null);
    
    // Reset form if successful
    if (modalStep === 'success') {
      setSelectedMethod(null);
      reset();
    }
  };

  // Enhanced pending payment check following the sample pattern
  useEffect(() => {
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      try {
        const paymentInfo = JSON.parse(pendingPayment);
        console.log('Checking pending payment status:', paymentInfo);
        
        // Check status using reference number following the sample pattern
        if (paymentInfo?.referenceNumber) {
          checkStatus(paymentInfo?.referenceNumber);
        }
        
        localStorage.removeItem('pendingPayment');
      } catch (err) {
        console.error('Error checking pending payment:', err);
        localStorage.removeItem('pendingPayment');
      }
    }
  }, [checkStatus]);

  const tabs = [
    { id: 'payment', label: 'Make Payment', icon: 'Send' },
    { id: 'history', label: 'Transaction History', icon: 'History' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Enhanced Connection Status */}
      <div className="bg-card border-b border-border shadow-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">Payment Processing</h1>
                  {/* Enhanced Connection Status Indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-success' : isDisconnected ? 'bg-error' : 'bg-warning'
                  }`} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Powered by official PesePay integration
                  {isConnected && <span className="text-success ml-1">• Connected & Ready</span>}
                  {isDisconnected && <span className="text-error ml-1">• Connection Issue</span>}
                </p>
              </div>
            </div>

            {/* User Balance */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-lg font-semibold text-foreground font-data">${userBalance?.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Wallet" size={20} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-error/10 border-b border-error/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
              <p className="text-sm text-error flex-1">{error}</p>
              <button
                onClick={clearError}
                className="text-error hover:text-error/80 transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Balance Card */}
      <div className="sm:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-xl font-semibold text-foreground font-data">${userBalance?.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Wallet" size={24} className="text-secondary" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Choose Payment Method</h2>
                <p className="text-sm text-muted-foreground">
                  Select your preferred payment method. PesePay methods require active connection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {paymentMethods?.map((method) => (
                  <PaymentMethodCard
                    key={method?.id}
                    method={method}
                    isSelected={selectedMethod?.id === method?.id}
                    onSelect={handleMethodSelect}
                    isAvailable={method?.status === 'available'}
                  />
                ))}
              </div>
            </div>

            {/* Transaction Form */}
            <div className="lg:col-span-1">
              <TransactionForm
                selectedMethod={selectedMethod}
                onSubmit={handleTransactionSubmit}
                isProcessing={isLoading}
                userBalance={userBalance}
                connectionStatus={connectionStatus}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <TransactionHistory transactions={transactionHistory} />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-4xl mx-auto">
            <SecurityNotice />
          </div>
        )}
      </div>

      {/* Processing Modal with Enhanced PesePay Integration */}
      <ProcessingModal
        isOpen={showModal}
        onClose={handleModalClose}
        transactionData={transactionData}
        onConfirm={handleVerificationConfirm}
        step={modalStep}
        paymentData={paymentData}
        error={error}
      />

      {/* Quick Actions - Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full shadow-warm-lg"
          onClick={() => setActiveTab('payment')}
          disabled={isLoading}
        >
          {isLoading ? <Icon name="Loader2" size={24} className="animate-spin" /> : <Icon name="Plus" size={24} />}
        </Button>
      </div>
    </div>
  );
};

export default PaymentProcessing;