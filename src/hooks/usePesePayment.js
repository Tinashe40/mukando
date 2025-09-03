import { useState, useCallback, useRef, useEffect } from 'react';
import pesePayAPI from '../services/pesePayAPI';

const usePesePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [supportedMethods, setSupportedMethods] = useState([]);
  const abortControllerRef = useRef(null);

  // Test API connectivity and load supported methods on mount
  useEffect(() => {
    testConnection();
    loadSupportedMethods();
  }, []);

  // Load supported payment methods
  const loadSupportedMethods = useCallback(async () => {
    try {
      let result = await pesePayAPI?.getSupportedMethods?.();
      if (result?.success) {
        setSupportedMethods(result?.methods || []);
      }
    } catch (error) {
      console.warn('Failed to load supported payment methods:', error);
    }
  }, []);

  // Test connection to PesePay API
  const testConnection = useCallback(async () => {
    try {
      let result = await pesePayAPI?.healthCheck?.();
      setConnectionStatus(result?.success ? 'connected' : 'disconnected');
      
      if (!result?.success) {
        console.warn('PesePay connection test failed:', result?.error);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Connection test error:', error);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cancel current request
  const cancelCurrentRequest = useCallback(() => {
    if (abortControllerRef?.current) {
      abortControllerRef?.current?.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Enhanced error handling with user-friendly messages
  const handleError = useCallback((error, context = '') => {
    let userFriendlyMessage = '';
    
    switch (error?.type) {
      case 'NETWORK_ERROR':
        userFriendlyMessage = 'Network connection failed. Please check your internet connection and try again.';
        break;
      case 'DNS_ERROR':
        userFriendlyMessage = 'Could not connect to payment server. Please check your network settings.';
        break;
      case 'TIMEOUT_ERROR':
        userFriendlyMessage = 'Request timed out. Please check your connection and try again.';
        break;
      case 'CONNECTION_REFUSED':
        userFriendlyMessage = 'Payment server is currently unavailable. Please try again later.';
        break;
      case 'AUTH_ERROR':
        userFriendlyMessage = 'Payment authentication failed. Please contact support.';
        break;
      case 'SERVER_ERROR':
        userFriendlyMessage = 'Payment server error. Please try again later.';
        break;
      case 'PERMISSION_ERROR':
        userFriendlyMessage = 'Payment access denied. Please contact support.';
        break;
      case 'PAYMENT_ERROR':
        userFriendlyMessage = 'Payment processing failed. Please try again or use an alternative method.';
        break;
      case 'CONFIG_ERROR':
        userFriendlyMessage = 'Payment system configuration error. Please contact support.';
        break;
      case 'VALIDATION_ERROR':
        userFriendlyMessage = 'Invalid payment data. Please check your information and try again.';
        break;
      default:
        userFriendlyMessage = error?.message || 'Payment processing failed. Please try again.';
    }

    const errorMessage = context ? `${context}: ${userFriendlyMessage}` : userFriendlyMessage;
    setError(errorMessage);
    console.error('Payment error:', { context, error, userFriendlyMessage });
    
    return errorMessage;
  }, []);

  // Process payment through PesePay direct REST API
  const processPayment = useCallback(async (transactionData) => {
    // Cancel any existing request
    cancelCurrentRequest();
    
    setIsLoading(true);
    setError(null);

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Validate input data
      if (!transactionData?.amount) {
        throw new Error('Amount is required for payment processing');
      }

      // Test connection if status is unknown or disconnected
      if (connectionStatus !== 'connected') {
        await testConnection();
      }

      console.log('Processing payment with direct PesePay REST API:', {
        amount: transactionData?.amount,
        currency: transactionData?.currency,
        method: transactionData?.method?.type
      });

      // Determine which API endpoint to use based on payment method
      let result;
      if (transactionData?.method?.type && ['ecocash', 'onemoney', 'telecash']?.includes(transactionData?.method?.type)) {
        // Use make-payment endpoint for mobile money
        result = await pesePayAPI?.makePayment({
          amount: transactionData?.amount,
          currency: transactionData?.currency || 'USD',
          customerName: transactionData?.customerName || 'Group Member',
          customerSurname: transactionData?.customerSurname || '',
          customerEmail: transactionData?.customerEmail || 'member@mukando.com',
          customerPhone: transactionData?.customerPhone || transactionData?.phoneNumber,
          reference: transactionData?.reference,
          purpose: transactionData?.purpose,
          method: transactionData?.method
        });
      } else {
        // Use initiate-transaction endpoint for other payment methods
        result = await pesePayAPI?.initiatePayment({
          amount: transactionData?.amount,
          currency: transactionData?.currency || 'USD',
          customerName: transactionData?.customerName || 'Group Member',
          customerSurname: transactionData?.customerSurname || '',
          customerEmail: transactionData?.customerEmail || 'member@mukando.com',
          customerPhone: transactionData?.customerPhone || transactionData?.phoneNumber,
          reference: transactionData?.reference,
          purpose: transactionData?.purpose,
          method: transactionData?.method
        });
      }

      if (result?.success) {
        setPaymentData(result);
        setConnectionStatus('connected');
        
        console.log('Payment processed successfully with direct REST API:', {
          reference: result?.reference,
          payment_url: result?.payment_url
        });
        
        return {
          success: true,
          data: result,
          transactionId: result?.transactionId || result?.reference,
          reference: result?.reference,
          payment_url: result?.payment_url,
          redirectUrl: result?.redirectUrl || result?.payment_url
        };
      } else {
        const errorMsg = handleError(result, 'Payment initiation failed');
        return {
          success: false,
          error: errorMsg,
          type: result?.type
        };
      }
    } catch (err) {
      // Handle abort errors
      if (err?.name === 'AbortError') {
        const errorMessage = 'Payment request was cancelled';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          type: 'CANCELLED'
        };
      }

      const errorMessage = handleError(err, 'Payment processing');
      return {
        success: false,
        error: errorMessage,
        type: err?.type
      };
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [connectionStatus, handleError, testConnection, cancelCurrentRequest]);

  // Check payment status using direct REST API
  const checkStatus = useCallback(async (referenceNumber) => {
    if (!referenceNumber) {
      const errorMsg = 'Reference number is required for status check';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Checking payment status with direct REST API for reference:', referenceNumber);
      
      let result = await pesePayAPI?.checkPaymentStatus(referenceNumber);
      
      if (result?.success) {
        setPaymentData(prev => ({
          ...prev,
          status: result?.status,
          paid: result?.paid,
          ...result
        }));

        console.log('Payment status checked with direct REST API:', {
          reference: referenceNumber,
          status: result?.status,
          paid: result?.paid
        });

        return {
          success: true,
          status: result?.status,
          paid: result?.paid,
          data: result
        };
      } else {
        const errorMsg = handleError(result, 'Status check failed');
        return {
          success: false,
          error: errorMsg,
          type: result?.type
        };
      }
    } catch (err) {
      const errorMessage = handleError(err, 'Status check');
      return {
        success: false,
        error: errorMessage,
        type: err?.type
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Process mobile money payment using make-payment endpoint
  const processMobileMoneyPayment = useCallback(async (paymentData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing mobile money payment with direct REST API:', {
        amount: paymentData?.amount,
        method: paymentData?.method?.type
      });

      let result = await pesePayAPI?.processMobileMoneyPayment(paymentData);
      
      if (result?.success) {
        setPaymentData(result);
        setConnectionStatus('connected');
        
        return {
          success: true,
          data: result,
          transactionId: result?.transactionId || result?.reference,
          reference: result?.reference,
          status: result?.status
        };
      } else {
        const errorMsg = handleError(result, 'Mobile money payment failed');
        return {
          success: false,
          error: errorMsg,
          type: result?.type
        };
      }
    } catch (err) {
      const errorMessage = handleError(err, 'Mobile money payment');
      return {
        success: false,
        error: errorMessage,
        type: err?.type
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Get transaction details using direct REST API
  const getTransactionDetails = useCallback(async (transactionId) => {
    if (!transactionId) {
      const errorMsg = 'Transaction ID is required';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      let result = await pesePayAPI?.getTransactionDetails(transactionId);
      
      if (result?.success) {
        return {
          success: true,
          transaction: result?.transaction
        };
      } else {
        const errorMsg = handleError(result, 'Failed to get transaction details');
        return {
          success: false,
          error: errorMsg,
          type: result?.type
        };
      }
    } catch (err) {
      const errorMessage = handleError(err, 'Get transaction details');
      return {
        success: false,
        error: errorMessage,
        type: err?.type
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Cancel payment using direct REST API
  const cancelPayment = useCallback(async (transactionId) => {
    if (!transactionId) {
      const errorMsg = 'Transaction ID is required for cancellation';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      let result = await pesePayAPI?.cancelPayment(transactionId);
      
      if (result?.success) {
        setPaymentData(prev => ({
          ...prev,
          status: 'cancelled'
        }));
        return {
          success: true,
          message: result?.message
        };
      } else {
        const errorMsg = handleError(result, 'Payment cancellation failed');
        return {
          success: false,
          error: errorMsg,
          type: result?.type
        };
      }
    } catch (err) {
      const errorMessage = handleError(err, 'Payment cancellation');
      return {
        success: false,
        error: errorMessage,
        type: err?.type
      };
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Reset hook state
  const reset = useCallback(() => {
    cancelCurrentRequest();
    setIsLoading(false);
    setError(null);
    setPaymentData(null);
  }, [cancelCurrentRequest]);

  // Retry failed operation
  const retry = useCallback(async (operation, ...args) => {
    clearError();
    
    switch (operation) {
      case 'payment':
        return await processPayment(...args);
      case 'mobile-payment':
        return await processMobileMoneyPayment(...args);
      case 'status':
        return await checkStatus(...args);
      case 'cancel':
        return await cancelPayment(...args);
      case 'connection':
        return await testConnection();
      case 'methods':
        return await loadSupportedMethods();
      case 'details':
        return await getTransactionDetails(...args);
      default:
        throw new Error('Invalid retry operation');
    }
  }, [processPayment, processMobileMoneyPayment, checkStatus, cancelPayment, testConnection, loadSupportedMethods, getTransactionDetails, clearError]);

  return {
    // State
    isLoading,
    error,
    paymentData,
    connectionStatus,
    supportedMethods,
    
    // Actions
    processPayment,
    processMobileMoneyPayment,
    checkStatus,
    getTransactionDetails,
    cancelPayment,
    clearError,
    reset,
    retry,
    testConnection,
    loadSupportedMethods,
    
    // Status flags
    isConnected: connectionStatus === 'connected',
    isDisconnected: connectionStatus === 'disconnected',
    
    // Additional API methods
    handleWebhook: useCallback(async (webhookData) => {
      return await pesePayAPI?.handleWebhook(webhookData);
    }, [])
  };
};

export default usePesePayment;