import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentMethodCard from './components/PaymentMethodCard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import SecurityNotice from './components/SecurityNotice';
import ProcessingModal from './components/ProcessingModal';
import usePesePayment from '../../hooks/usePesePayment';
import { useAuth } from '../../contexts/AuthContext';
import { getPaymentProcessingData } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PaymentProcessing = () => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('verification');
  const [transactionData, setTransactionData] = useState(null);
  const [activeTab, setActiveTab] = useState('payment');

  const {
    isLoading: isPesePaymentLoading,
    error: pesePaymentError,
    paymentData: pesePaymentResponse,
    processPayment,
    clearError: clearPesePaymentError,
  } = usePesePayment();

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (user) {
        setIsLoading(true);
        const data = await getPaymentProcessingData(user.id);
        setPaymentData(data);
        setIsLoading(false);
      }
    };
    fetchPaymentData();
  }, [user]);

  const handleTransactionSubmit = async (data) => {
    setTransactionData(data);
    setShowModal(true);
    setModalStep('verification');
  };

  const handleVerificationConfirm = async () => {
    setModalStep('processing');
    const result = await processPayment({ ...transactionData, method: selectedMethod });
    if (result?.success) {
      setModalStep('success');
      if (result.payment_url) {
        window.open(result.payment_url, '_blank');
      }
    } else {
      setModalStep('error');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalStep('verification');
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!paymentData) {
      return (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Could not load payment processing data.</p>
        </div>
      );
    }

    if (activeTab === 'payment') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Add PaymentMethodCard components here */}
            </div>
          </div>
          <div className="lg:col-span-1">
            <TransactionForm
              selectedMethod={selectedMethod}
              onSubmit={handleTransactionSubmit}
              isProcessing={isPesePaymentLoading}
              userBalance={paymentData.user_balance}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'history') {
      return <TransactionHistory transactions={paymentData.transaction_history || []} />;
    }

    if (activeTab === 'security') {
      return <SecurityNotice />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border shadow-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">Payment Processing</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button onClick={() => setActiveTab('payment')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
              Make Payment
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
              Transaction History
            </button>
            <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
              Security
            </button>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
      <ProcessingModal
        isOpen={showModal}
        onClose={handleModalClose}
        transactionData={transactionData}
        onConfirm={handleVerificationConfirm}
        step={modalStep}
        paymentData={pesePaymentResponse}
        error={pesePaymentError}
      />
    </div>
  );
};

export default PaymentProcessing;
