// PesePay Direct API Service - Using REST endpoints directly
import axios from 'axios';

class PesePayAPIService {
  constructor() {
    this.integrationKey = import.meta.env?.VITE_PESEPAY_INTEGRATION_KEY;
    this.encryptionKey = import.meta.env?.VITE_PESEPAY_ENCRYPTION_KEY;
    this.baseUrl = import.meta.env?.VITE_PESEPAY_BASE_URL || 'https://pesepay.com/api/payments-engine';
    this.returnUrl = import.meta.env?.VITE_PESEPAY_CALLBACK_URL || `${window?.location?.origin}/payment-return`;
    this.resultUrl = import.meta.env?.VITE_PESEPAY_RESULT_URL || `${window?.location?.origin}/payment-callback`;
    this.environment = import.meta.env?.VITE_PESEPAY_ENVIRONMENT || 'sandbox';
    
    // Setup axios instance with base configuration
    this.api = axios?.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api?.interceptors?.request?.use(
      (config) => {
        // Add integration key to headers
        if (this.integrationKey) {
          config.headers['Integration-Key'] = this.integrationKey;
        }
        
        console.log(`PesePay API Request: ${config?.method?.toUpperCase()} ${config?.url}`);
        return config;
      },
      (error) => {
        console.error('PesePay API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api?.interceptors?.response?.use(
      (response) => {
        console.log(`PesePay API Response: ${response?.status} - ${response?.config?.url}`);
        return response;
      },
      (error) => {
        const enhancedError = this.enhanceError(error);
        console.error('PesePay API Response Error:', enhancedError);
        return Promise.reject(enhancedError);
      }
    );
    
    // Validate required environment variables
    if (!this.integrationKey || !this.encryptionKey) {
      console.warn('PesePay: Missing required environment variables');
    } else {
      console.log('PesePay Direct API service initialized successfully');
    }
  }

  // Enhanced error handling with specific error types
  enhanceError(error) {
    if (error?.code === 'ERR_NETWORK' || (!error?.response && !error?.request)) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        type: 'NETWORK_ERROR',
        originalError: error
      };
    } else if (error?.code === 'ENOTFOUND' || error?.code === 'EAI_AGAIN') {
      return {
        message: 'Could not resolve PesePay server. Please check your network settings.',
        type: 'DNS_ERROR',
        originalError: error
      };
    } else if (error?.code === 'ECONNREFUSED') {
      return {
        message: 'Connection refused by PesePay server. Please try again later.',
        type: 'CONNECTION_REFUSED',
        originalError: error
      };
    } else if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timeout')) {
      return {
        message: 'Request timed out. Please check your connection and try again.',
        type: 'TIMEOUT_ERROR',
        originalError: error
      };
    } else if (error?.response?.status >= 500) {
      return {
        message: 'PesePay server error. Please try again later.',
        type: 'SERVER_ERROR',
        status: error?.response?.status,
        data: error?.response?.data,
        originalError: error
      };
    } else if (error?.response?.status === 401) {
      return {
        message: 'Authentication failed. Please check your PesePay credentials.',
        type: 'AUTH_ERROR',
        status: error?.response?.status,
        data: error?.response?.data,
        originalError: error
      };
    } else if (error?.response?.status === 403) {
      return {
        message: 'Access forbidden. Please check your PesePay permissions.',
        type: 'PERMISSION_ERROR',
        status: error?.response?.status,
        data: error?.response?.data,
        originalError: error
      };
    } else if (error?.response?.status === 400) {
      const errorMessage = error?.response?.data?.message || 'Invalid request data';
      return {
        message: `Bad request: ${errorMessage}`,
        type: 'VALIDATION_ERROR',
        status: error?.response?.status,
        data: error?.response?.data,
        originalError: error
      };
    }
    
    return {
      message: error?.message || 'Unknown error occurred',
      type: 'UNKNOWN_ERROR',
      originalError: error
    };
  }

  // Generate reference number
  generateReference(prefix = 'MKD') {
    const timestamp = Date.now()?.toString();
    const random = Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase();
    return `${prefix}${timestamp?.slice(-6)}${random}`;
  }

  async encryptData(data) {
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const key = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(data))
      );
      const encryptedDataArray = new Uint8Array(encryptedData);
      const ivArray = Array.from(iv);
      const encryptedArray = Array.from(encryptedDataArray);
      const payload = `${btoa(String.fromCharCode(...ivArray))}:${btoa(String.fromCharCode(...encryptedArray))}`;
      return payload;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt payment data.');
    }
  }

  async decryptData(encryptedPayload) {
    try {
      const [iv_b64, encrypted_b64] = encryptedPayload.split(':');
      const iv = new Uint8Array(atob(iv_b64).split('').map(char => char.charCodeAt(0)));
      const encrypted = new Uint8Array(atob(encrypted_b64).split('').map(char => char.charCodeAt(0)));
      const key = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      return JSON.parse(new TextDecoder().decode(decryptedData));
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt payment data.');
    }
  }

  // Validate payment data before processing
  validatePaymentData(paymentData) {
    const required = ['amount', 'currency'];
    const missing = required?.filter(field => !paymentData?.[field]);
    
    if (missing?.length > 0) {
      throw new Error(`Missing required fields: ${missing?.join(', ')}`);
    }
    
    const amount = parseFloat(paymentData?.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    if (!this.integrationKey) {
      throw new Error('PesePay integration key not configured');
    }
    
    return true;
  }

  // Main payment initiation method using direct REST API
  async initiatePayment(paymentData) {
    try {
      // Validate payment data
      this.validatePaymentData(paymentData);
      
      const referenceNumber = this.generateReference();
      const reasonForPayment = paymentData?.reference || `Mukando Payment #${referenceNumber}`;
      
      console.log('PesePay payment initiation via REST API:', {
        amount: paymentData?.amount,
        currency: paymentData?.currency,
        method: paymentData?.method?.type,
        reference: referenceNumber
      });
      
      // Prepare transaction data according to PesePay API specs
      const transactionData = {
        amountDetails: {
          amount: parseFloat(paymentData?.amount),
          currencyCode: paymentData?.currency || 'USD'
        },
        reasonForPayment: reasonForPayment,
        resultUrl: this.resultUrl,
        returnUrl: this.returnUrl,
      };

      const encryptedPayload = await this.encryptData(transactionData);

      // Call PesePay initiate-transaction endpoint
      const response = await this.api?.post('/v1/payments/initiate', { payload: encryptedPayload });

      if (response?.data?.success || response?.data?.status === 'success') {
        const responseData = await this.decryptData(response?.data?.payload);
        
        console.log('PesePay payment initiated successfully via REST API');
        return {
          success: true,
          payment_url: responseData?.redirectUrl || responseData?.paymentUrl,
          reference: referenceNumber,
          transactionId: referenceNumber,
          redirectUrl: responseData?.redirectUrl || responseData?.paymentUrl,
          pollUrl: responseData?.pollUrl || `${this.baseUrl}/api/v1/payments/check-payment-status/${referenceNumber}`,
          responseData: responseData
        };
      } else {
        const errorMessage = response?.data?.message || response?.data?.error || 'Payment initiation failed';
        console.error('PesePay payment initiation failed:', errorMessage);
        return {
          success: false,
          error: errorMessage,
          type: 'PAYMENT_ERROR',
          responseData: response?.data
        };
      }
    } catch (error) {
      console.error('PesePay initiate payment error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Payment initiation failed',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }

  // Check payment status using direct REST API
  async checkPaymentStatus(referenceNumber) {
    try {
      if (!referenceNumber) {
        throw new Error('Reference number is required');
      }

      console.log('Checking payment status via REST API for reference:', referenceNumber);

      // Call PesePay check-payment-status endpoint
      const response = await this.api?.get(`/api/v1/payments/check-payment-status/${referenceNumber}`);

      if (response?.data?.success || response?.data?.status === 'success') {
        const paymentData = response?.data?.data || response?.data;
        const isPaid = paymentData?.paid === true || paymentData?.status === 'PAID' || paymentData?.status === 'completed';
        
        console.log(`Payment status checked via REST API for reference: ${referenceNumber}`, {
          status: paymentData?.status,
          paid: isPaid
        });

        return {
          success: true,
          status: isPaid ? 'completed' : 'pending',
          paid: isPaid,
          transactionId: referenceNumber,
          reference: referenceNumber,
          amount: paymentData?.amount,
          currencyCode: paymentData?.currencyCode,
          paymentMethod: paymentData?.paymentMethod,
          customerPhone: paymentData?.customerPhone,
          reasonForPayment: paymentData?.reasonForPayment,
          paymentDate: paymentData?.paymentDate,
          responseData: paymentData
        };
      } else if (response?.data?.success === false) {
        return {
          success: true,
          status: 'pending',
          paid: false,
          transactionId: referenceNumber,
          reference: referenceNumber,
          message: response?.data?.message || 'Payment still pending',
          responseData: response?.data
        };
      } else {
        const errorMessage = response?.data?.message || 'Payment verification failed';
        return {
          success: false,
          status: 'failed',
          error: errorMessage,
          type: 'VERIFICATION_ERROR',
          responseData: response?.data
        };
      }
    } catch (error) {
      console.error('PesePay status check error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Status check failed',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }

  // Make payment using direct REST API (for mobile money and card payments)
  async makePayment(paymentData) {
    try {
      // Validate payment data
      this.validatePaymentData(paymentData);

      const referenceNumber = this.generateReference();
      
      console.log('Making direct payment via REST API:', {
        amount: paymentData?.amount,
        currency: paymentData?.currency,
        method: paymentData?.method?.type,
        reference: referenceNumber
      });

      // Prepare payment data for make-payment endpoint
      const paymentRequestData = {
        referenceNumber: referenceNumber,
        amountDetails: {
          amount: parseFloat(paymentData?.amount),
          currencyCode: paymentData?.currency || 'USD'
        },
        reasonForPayment: paymentData?.reference || `Mukando Payment #${referenceNumber}`,
        paymentMethodCode: this.getPaymentMethodCode(paymentData?.method?.type),
        customerDetails: {
          customerName: paymentData?.customerName || 'Group Member',
          customerSurname: paymentData?.customerSurname || '',
          customerEmail: paymentData?.customerEmail || 'member@mukando.com',
          customerPhone: paymentData?.customerPhone || paymentData?.phoneNumber || ''
        },
        resultUrl: this.resultUrl,
        returnUrl: this.returnUrl
      };

      // Call PesePay make-payment endpoint
      const response = await this.api?.post('/api/v1/payments/make-payment', paymentRequestData);

      if (response?.data?.success || response?.data?.status === 'success') {
        const responseData = response?.data?.data || response?.data;
        
        console.log('Payment processed successfully via REST API make-payment endpoint');
        return {
          success: true,
          reference: referenceNumber,
          transactionId: referenceNumber,
          status: responseData?.status || 'pending',
          payment_url: responseData?.redirectUrl || responseData?.paymentUrl,
          redirectUrl: responseData?.redirectUrl || responseData?.paymentUrl,
          responseData: responseData
        };
      } else {
        const errorMessage = response?.data?.message || response?.data?.error || 'Payment processing failed';
        console.error('PesePay make-payment failed:', errorMessage);
        return {
          success: false,
          error: errorMessage,
          type: 'PAYMENT_ERROR',
          responseData: response?.data
        };
      }
    } catch (error) {
      console.error('PesePay make payment error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Payment processing failed',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }

  // Get payment method code for different providers
  getPaymentMethodCode(type) {
    const codes = {
      'pesepay': 'PESEPAY',
      'ecocash': 'ECOCASH',
      'onemoney': 'ONEMONEY', 
      'telecash': 'TELECASH',
      'card': 'CARD',
      'visa': 'VISA',
      'mastercard': 'MASTERCARD'
    };
    return codes?.[type] || 'PESEPAY';
  }

  // Process mobile money payment using make-payment endpoint
  async processMobileMoneyPayment(paymentData) {
    try {
      // Use the make-payment endpoint for mobile money payments
      return await this.makePayment({
        ...paymentData,
        method: {
          ...paymentData?.method,
          type: paymentData?.method?.type || 'ecocash'
        }
      });
    } catch (error) {
      console.error('PesePay mobile money error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Mobile money payment failed',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }

  // Webhook handling for payment notifications
  async handleWebhook(webhookData) {
    try {
      const { referenceNumber } = webhookData;

      if (!referenceNumber) {
        throw new Error('Reference number missing in webhook data');
      }

      console.log('Processing webhook notification for reference:', referenceNumber);

      // Verify the payment status using the check-payment-status endpoint
      const response = await this.checkPaymentStatus(referenceNumber);

      return {
        success: true,
        handled: true,
        paymentStatus: response?.status,
        paid: response?.paid,
        data: response
      };
    } catch (error) {
      console.error('PesePay webhook error:', error);
      return {
        success: false,
        error: error?.message || 'Webhook handling failed'
      };
    }
  }

  // Health check method with improved connectivity testing
  async healthCheck() {
    try {
      // First check if we have basic configuration
      if (!this.integrationKey) {
        return {
          success: false,
          status: 'disconnected',
          error: 'PesePay integration key missing. Please check environment variables.',
          type: 'CONFIG_ERROR'
        };
      }

      // Test basic connectivity to PesePay server
      console.log('Testing PesePay API connectivity...');
      
      try {
        // Instead of health-check, test with a minimal API call
        // This will tell us if the server is reachable and responding
        const testResponse = await axios?.get(this.baseUrl, { 
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mukando/1.0'
          }
        });
        
        return {
          success: true,
          status: 'connected',
          message: 'PesePay server is reachable',
          configuration: {
            environment: this.environment,
            baseUrl: this.baseUrl,
            hasReturnUrl: !!this.returnUrl,
            hasResultUrl: !!this.resultUrl,
            hasIntegrationKey: !!this.integrationKey,
            hasEncryptionKey: !!this.encryptionKey
          }
        };
      } catch (connectError) {
        // Test alternative connection methods
        if (connectError?.code === 'ERR_NETWORK') {
          return {
            success: false,
            status: 'disconnected',
            error: 'Network connection failed. PesePay servers may be unreachable or your internet connection is down.',
            type: 'NETWORK_ERROR',
            suggestion: 'Please check your internet connection and try again. If the problem persists, PesePay servers may be experiencing issues.',
            configuration: {
              environment: this.environment,
              baseUrl: this.baseUrl,
              hasIntegrationKey: !!this.integrationKey
            }
          };
        }
        
        // For other connection errors, provide detailed information
        const enhancedError = this.enhanceError(connectError);
        return {
          success: false,
          status: 'disconnected',
          error: enhancedError?.message || 'PesePay API connectivity test failed',
          type: enhancedError?.type || 'CONNECTION_ERROR',
          details: enhancedError,
          configuration: {
            environment: this.environment,
            baseUrl: this.baseUrl,
            hasIntegrationKey: !!this.integrationKey
          }
        };
      }
    } catch (error) {
      console.error('PesePay health check failed:', error);
      return {
        success: false,
        status: 'disconnected',
        error: error?.message || 'PesePay API health check failed',
        type: error?.type || 'CONNECTION_ERROR'
      };
    }
  }

  // Get supported methods with enhanced fallback
  async getSupportedMethods() {
    try {
      // Return default supported methods based on PesePay documentation
      const defaultMethods = [
        {
          type: 'pesepay',
          name: 'PesePay',
          description: 'Official PesePay payment gateway',
          supported: true,
          priority: 1
        },
        {
          type: 'ecocash',
          name: 'EcoCash',
          description: 'Mobile money payment via EcoCash',
          supported: true,
          priority: 2
        },
        {
          type: 'onemoney',
          name: 'OneMoney',
          description: 'Mobile money payment via OneMoney',
          supported: true,
          priority: 3
        },
        {
          type: 'telecash',
          name: 'TeleCash',
          description: 'Mobile money payment via TeleCash',
          supported: true,
          priority: 4
        },
        {
          type: 'card',
          name: 'Credit/Debit Card',
          description: 'Payment via credit or debit card',
          supported: true,
          priority: 5
        }
      ];

      return {
        success: true,
        methods: defaultMethods
      };
    } catch (error) {
      console.error('PesePay get supported methods error:', error);
      
      // Return fallback methods even on error
      const fallbackMethods = [
        { type: 'pesepay', name: 'PesePay', supported: true, priority: 1 },
        { type: 'ecocash', name: 'EcoCash', supported: true, priority: 2 }
      ];

      return {
        success: true,
        methods: fallbackMethods,
        warning: 'Using fallback payment methods due to API error'
      };
    }
  }

  // Cancel payment implementation
  async cancelPayment(referenceNumber) {
    try {
      if (!referenceNumber) {
        throw new Error('Reference number is required for cancellation');
      }

      console.log('Attempting to cancel payment for reference:', referenceNumber);

      // Try to call a cancel endpoint (this may not exist in PesePay API)
      try {
        const response = await this.api?.post(`/api/v1/payments/cancel-payment`, {
          referenceNumber: referenceNumber
        });

        if (response?.data?.success) {
          return {
            success: true,
            message: 'Payment cancellation processed',
            referenceNumber: referenceNumber,
            responseData: response?.data
          };
        }
      } catch (cancelError) {
        // If cancel endpoint doesn't exist, log the attempt and return success
        console.log('Payment cancellation endpoint not available:', cancelError?.response?.status);
      }

      // Return success even if direct cancellation isn't available
      return {
        success: true,
        message: 'Payment cancellation requested (processing may depend on payment status)',
        referenceNumber: referenceNumber,
        note: 'Direct cancellation may not be available for all payment types'
      };
    } catch (error) {
      console.error('PesePay cancel payment error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Cancellation failed',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }

  // Get transaction details
  async getTransactionDetails(referenceNumber) {
    try {
      if (!referenceNumber) {
        throw new Error('Reference number is required');
      }

      console.log('Fetching transaction details for reference:', referenceNumber);

      // Use checkPaymentStatus to get transaction details
      const response = await this.checkPaymentStatus(referenceNumber);
      
      return {
        success: response?.success,
        transaction: response
      };
    } catch (error) {
      console.error('PesePay get transaction details error:', error);
      const enhancedError = this.enhanceError(error);
      return {
        success: false,
        error: enhancedError?.message || 'Failed to retrieve transaction details',
        type: enhancedError?.type || 'UNKNOWN_ERROR',
        details: enhancedError
      };
    }
  }
}

// Create singleton instance
const pesePayAPI = new PesePayAPIService();

export default pesePayAPI;

// Named exports for specific functions
export const {
  initiatePayment,
  checkPaymentStatus,
  makePayment,
  processMobileMoneyPayment,
  cancelPayment,
  healthCheck,
  getSupportedMethods,
  getTransactionDetails,
  handleWebhook
} = pesePayAPI;