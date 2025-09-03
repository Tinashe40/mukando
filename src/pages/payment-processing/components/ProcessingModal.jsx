import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import usePesePayment from '../../../hooks/usePesePayment';

const ProcessingModal = ({ 
  isOpen, 
  onClose, 
  transactionData, 
  onConfirm,
  step = 'verification' // verification, processing, success, error
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentStep, setCurrentStep] = useState(step);
  const [paymentResult, setPaymentResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showConnectionHelp, setShowConnectionHelp] = useState(false);

  const {
    processPayment,
    checkStatus,
    cancelPayment,
    isLoading,
    error: paymentError,
    paymentData,
    clearError,
    connectionStatus,
    isConnected,
    isDisconnected,
    testConnection,
    retry
  } = usePesePayment();

  // Helper function to safely format currency amounts
  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) ? numAmount?.toFixed(2) : '0.00';
  };

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  // Check connection status when modal opens
  useEffect(() => {
    if (isOpen && isDisconnected) {
      setShowConnectionHelp(true);
    }
  }, [isOpen, isDisconnected]);

  useEffect(() => {
    if (isOpen && currentStep === 'verification') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, currentStep]);

  // Poll for payment status when processing
  useEffect(() => {
    let statusInterval;
    
    if (currentStep === 'processing' && paymentData?.transactionId) {
      statusInterval = setInterval(async () => {
        const statusResult = await checkStatus(
          paymentData?.transactionId, 
          paymentData?.pollUrl
        );
        
        if (statusResult?.success) {
          const status = statusResult?.status?.toLowerCase();
          
          if (status === 'successful' || status === 'completed') {
            setCurrentStep('success');
            setPaymentResult(statusResult?.data);
            clearInterval(statusInterval);
          } else if (status === 'failed' || status === 'cancelled') {
            setCurrentStep('error');
            setError('Payment was not successful. Please try again.');
            clearInterval(statusInterval);
          }
          // Continue polling for 'pending', 'processing', etc.
        } else if (statusResult?.type === 'NETWORK_ERROR') {
          // Stop polling on network errors
          setCurrentStep('error');
          setError('Network connection lost during payment processing.');
          clearInterval(statusInterval);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [currentStep, paymentData, checkStatus]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleVerificationSubmit = async (e) => {
    e?.preventDefault();
    
    // Check connection first
    if (isDisconnected) {
      setError('No internet connection. Please check your network and try again.');
      setShowConnectionHelp(true);
      return;
    }

    // For mobile money, skip verification and process directly
    const isMobileMoney = ['ecocash', 'onemoney', 'telecash']?.includes(transactionData?.method?.type);
    
    if (isMobileMoney) {
      setCurrentStep('processing');
      await processPaymentTransaction();
    } else {
      // For other payment methods, verify code first
      if (verificationCode?.length >= 4) {
        setCurrentStep('processing');
        await processPaymentTransaction();
      } else {
        setError('Please enter a valid verification code.');
      }
    }
  };

  const processPaymentTransaction = async () => {
    clearError();
    
    const paymentPayload = {
      amount: transactionData?.amount,
      phoneNumber: transactionData?.phoneNumber,
      customerName: transactionData?.customerName || 'Group Member',
      customerEmail: transactionData?.customerEmail || 'member@mukando.com',
      reference: transactionData?.reference,
      purpose: transactionData?.purpose,
      method: transactionData?.method
    };

    const result = await processPayment(paymentPayload);
    
    if (!result?.success) {
      setCurrentStep('error');
      setError(result?.error || 'Payment processing failed');
      setRetryCount(prev => prev + 1);
      
      // Show connection help for network errors
      if (result?.type === 'NETWORK_ERROR' || result?.type === 'TIMEOUT_ERROR') {
        setShowConnectionHelp(true);
      }
    }
    // Success/failure will be handled by the status polling effect
  };

  const handleResendCode = () => {
    setTimeLeft(300);
    setError('');
    console.log('Resending verification code...');
  };

  const handleCancel = async () => {
    if (paymentData?.transactionId && currentStep === 'processing') {
      await cancelPayment(paymentData?.transactionId);
    }
    onClose();
  };

  const handleRetry = async () => {
    setError('');
    setShowConnectionHelp(false);
    
    // Test connection first
    if (isDisconnected) {
      await testConnection();
    }
    
    if (currentStep === 'error') {
      // Reset to verification step for full retry
      setCurrentStep('verification');
      setVerificationCode('');
      clearError();
    } else {
      // Retry current operation
      await retry('payment', transactionData);
    }
  };

  const handleTestConnection = async () => {
    setError('');
    await testConnection();
    setShowConnectionHelp(false);
  };

  if (!isOpen) return null;

  // Connection help component
  const renderConnectionHelp = () => (
    <div className="bg-warning/10 rounded-lg p-4 mb-4 border border-warning/20">
      <div className="flex items-start gap-3">
        <Icon name="Wifi" size={20} className="text-warning mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-warning mb-1">Connection Issue</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Cannot connect to payment server. Please check:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 mb-3">
            <li>• Internet connection is active</li>
            <li>• No firewall blocking the connection</li>
            <li>• Try switching to mobile data if on WiFi</li>
          </ul>
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestConnection}
            loading={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Test Connection
          </Button>
        </div>
        <button
          onClick={() => setShowConnectionHelp(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );

  const renderVerificationStep = () => {
    const isMobileMoney = ['ecocash', 'onemoney', 'telecash']?.includes(transactionData?.method?.type);
    
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Smartphone" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isMobileMoney ? 'Confirm Mobile Payment' : 'Verify Your Payment'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isMobileMoney 
            ? `You will receive a prompt on ${transactionData?.phoneNumber} to authorize this payment`
            : `We've sent a verification code to your ${transactionData?.method?.type === 'bank' ? 'registered email' : 'mobile number'}`
          }
        </p>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : isDisconnected ? 'bg-error' : 'bg-warning'}`} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Connected' : isDisconnected ? 'Disconnected' : 'Connecting...'}
          </span>
        </div>

        {showConnectionHelp && renderConnectionHelp()}

        {/* Transaction Summary */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">${formatAmount(transactionData?.amount)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Method:</span>
            <span className="font-medium">{transactionData?.method?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Phone:</span>
            <span className="font-medium font-mono">{transactionData?.phoneNumber}</span>
          </div>
        </div>

        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          {!isMobileMoney && (
            <>
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e?.target?.value);
                  setError('');
                }}
                error={error}
                maxLength={6}
                className="text-center text-lg font-mono"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Code expires in: <span className="font-mono text-warning">{formatTime(timeLeft)}</span>
                </span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0}
                  className="text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  Resend Code
                </button>
              </div>
            </>
          )}

          {error && !showConnectionHelp && (
            <div className="bg-error/10 rounded-lg p-3 border border-error/20">
              <p className="text-sm text-error flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={(!isMobileMoney && verificationCode?.length < 4) || isDisconnected}
              loading={isLoading}
            >
              {isMobileMoney ? 'Process Payment' : 'Verify & Pay'}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="Loader" size={32} className="text-primary animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Processing Payment</h2>
      <p className="text-muted-foreground mb-6">
        {['ecocash', 'onemoney', 'telecash']?.includes(transactionData?.method?.type)
          ? 'Please check your phone and enter your PIN to complete the payment.' :'Please wait while we process your payment through PesePay.'
        }
      </p>

      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Amount:</span>
          <span className="font-medium">${formatAmount(transactionData?.amount)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Method:</span>
          <span className="font-medium">{transactionData?.method?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Reference:</span>
          <span className="font-medium font-mono">
            {paymentData?.reference || `TXN${Date.now()?.toString()?.slice(-8)}`}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          onClick={handleCancel}
        >
          Cancel Payment
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Do not close this window. Payment status is being monitored automatically.
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Payment Successful!</h2>
      <p className="text-muted-foreground mb-6">
        Your payment has been processed successfully through PesePay.
      </p>

      <div className="bg-success/10 rounded-lg p-4 mb-6 border border-success/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-success">Amount Paid:</span>
          <span className="font-semibold text-success">${formatAmount(paymentResult?.amount || transactionData?.totalAmount || transactionData?.amount)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-success">Transaction ID:</span>
          <span className="font-mono text-sm text-success">{paymentResult?.transactionId || paymentData?.transactionId}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-success">Reference:</span>
          <span className="font-mono text-sm text-success">{paymentResult?.reference || paymentData?.reference}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-success">Status:</span>
          <span className="font-medium text-success">Completed</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          iconName="Download"
          iconPosition="left"
        >
          Download Receipt
        </Button>
        <Button
          variant="default"
          fullWidth
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="XCircle" size={32} className="text-error" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Payment Failed</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't process your payment through PesePay. Please try again.
      </p>

      {showConnectionHelp && renderConnectionHelp()}

      <div className="bg-error/10 rounded-lg p-4 mb-6 border border-error/20">
        <p className="text-sm text-error">
          <Icon name="AlertCircle" size={16} className="inline mr-2" />
          {error || paymentError || 'Payment processing failed. Please check your details and try again.'}
        </p>
        
        {retryCount > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Retry attempt: {retryCount}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          fullWidth
          iconName="RefreshCw"
          iconPosition="left"
          onClick={handleRetry}
          loading={isLoading}
        >
          Try Again
        </Button>
      </div>

      {retryCount >= 3 && (
        <p className="text-xs text-muted-foreground mt-4">
          Having trouble? Try switching to a different network or contact support.
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full p-6 shadow-warm-lg">
        {currentStep === 'verification' && renderVerificationStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'success' && renderSuccessStep()}
        {currentStep === 'error' && renderErrorStep()}
      </div>
    </div>
  );
};

export default ProcessingModal;