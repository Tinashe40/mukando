import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

// Add toast declaration at the top level
const toast = {
  error: (message) => {
    console.error('Toast Error:', message);
    // You can replace this with your actual toast implementation
    alert(message);
  }
};

const TransactionForm = ({ 
  selectedMethod, 
  onSubmit, 
  isProcessing = false,
  userBalance = 0
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    phoneNumber: '',
    accountNumber: '',
    reference: '',
    purpose: 'contribution'
  });
  const [errors, setErrors] = useState({});
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const purposeOptions = [
    { value: 'contribution', label: 'Monthly Contribution' },
    { value: 'loan_repayment', label: 'Loan Repayment' },
    { value: 'penalty', label: 'Penalty Payment' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'other', label: 'Other' }
  ];

  const recipientOptions = [
    { value: 'group_account', label: 'Group Main Account' },
    { value: 'emergency_fund', label: 'Emergency Fund Account' },
    { value: 'member_transfer', label: 'Transfer to Member' }
  ];

  useEffect(() => {
    if (formData?.amount && selectedMethod) {
      const amount = parseFloat(formData?.amount) || 0;
      let fee = 0;
      
      if (selectedMethod?.feeType === 'percentage') {
        fee = (amount * selectedMethod?.fee) / 100;
      } else {
        fee = selectedMethod?.fee;
      }
      
      setCalculatedFee(fee);
      setTotalAmount(amount + fee);
    }
  }, [formData?.amount, selectedMethod]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (parseFloat(formData?.amount) > selectedMethod?.dailyLimit) {
      newErrors.amount = `Amount exceeds daily limit of $${selectedMethod?.dailyLimit?.toLocaleString()}`;
    }

    if (totalAmount > userBalance && !['ecocash', 'onemoney', 'telecash', 'pesepay']?.includes(selectedMethod?.type)) {
      newErrors.amount = 'Insufficient balance for this transaction';
    }

    if (!formData?.recipient) {
      newErrors.recipient = 'Please select a recipient';
    }

    if (['ecocash', 'onemoney', 'telecash']?.includes(selectedMethod?.type)) {
      if (!formData?.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required for mobile money payments';
      } else if (!/^(\+263|0)[0-9]{9}$/?.test(formData?.phoneNumber?.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid Zimbabwean phone number (+263xxxxxxxxx)';
      }
    }

    if (selectedMethod?.type === 'pesepay' && !formData?.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required for PesePay payments';
    }

    if (selectedMethod?.type === 'bank' && !formData?.accountNumber) {
      newErrors.accountNumber = 'Account number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form submission with enhanced API validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(formData.amount) > userBalance) {
      toast.error('Insufficient balance');
      return;
    }

    // Enhanced transaction data for direct API calls
    const transactionData = {
      amount: parseFloat(formData.amount),
      currency: formData.currency || 'USD',
      customerName: formData.customerName || 'Group Member',
      customerSurname: formData.customerSurname || '',
      customerEmail: formData.customerEmail || 'member@mukando.com',
      customerPhone: formData.phoneNumber || formData.customerPhone,
      reference: formData.reference || `Payment-${Date.now()}`,
      purpose: formData.purpose || 'contribution',
      method: selectedMethod,
      // Add return and result URLs for proper handling
      returnUrl: `${window.location.origin}/payment-return`,
      resultUrl: `${window.location.origin}/payment-callback`
    };

    console.log('Submitting transaction data with return/result URLs:', {
      amount: transactionData.amount,
      currency: transactionData.currency,
      method: selectedMethod.type,
      returnUrl: transactionData.returnUrl,
      resultUrl: transactionData.resultUrl
    });

    onSubmit?.(transactionData);
  };

  const getMethodSpecificFields = () => {
    switch (selectedMethod?.type) {
      case 'ecocash': 
      case 'onemoney': 
      case 'telecash':
        return (
          <div>
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="e.g., +263771234567 or 0771234567"
              value={formData?.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
              error={errors?.phoneNumber}
              required
              className="mb-4"
            />
            <div className="bg-info/10 rounded-lg p-3 border border-info/20 mb-4">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-info mt-0.5" />
                <div className="text-sm">
                  <p className="text-info font-medium">Mobile Money Payment</p>
                  <p className="text-info/80">
                    You'll receive a USSD prompt on your phone to authorize this payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'bank':
        return (
          <Input
            label="Account Number"
            type="text"
            placeholder="Enter account number"
            value={formData?.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
            error={errors?.accountNumber}
            required
            className="mb-4"
          />
        );
      
      case 'pesepay':
        return (
          <div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number for payment confirmation"
              value={formData?.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
              error={errors?.phoneNumber}
              required
              className="mb-4"
            />
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20 mb-4">
              <div className="flex items-start gap-2">
                <Icon name="Smartphone" size={16} className="text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="text-primary font-medium">PesePay Integration</p>
                  <p className="text-primary/80">
                    Secure payment processing through PesePay's platform with real-time status updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!selectedMethod) {
    return (
      <div className="text-center py-8">
        <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Please select a payment method to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Send" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
          <p className="text-sm text-muted-foreground">Complete your transaction with {selectedMethod?.name}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <Input
          label="Amount (USD)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={formData?.amount}
          onChange={(e) => handleInputChange('amount', e?.target?.value)}
          error={errors?.amount}
          required
          className="mb-4"
        />

        {/* Recipient Selection */}
        <Select
          label="Payment To"
          options={recipientOptions}
          value={formData?.recipient}
          onChange={(value) => handleInputChange('recipient', value)}
          error={errors?.recipient}
          required
          className="mb-4"
        />

        {/* Purpose Selection */}
        <Select
          label="Payment Purpose"
          options={purposeOptions}
          value={formData?.purpose}
          onChange={(value) => handleInputChange('purpose', value)}
          className="mb-4"
        />

        {/* Method-specific fields */}
        {getMethodSpecificFields()}

        {/* Reference */}
        <Input
          label="Reference (Optional)"
          type="text"
          placeholder="Payment reference or note"
          value={formData?.reference}
          onChange={(e) => handleInputChange('reference', e?.target?.value)}
          className="mb-4"
        />

        {/* Transaction Summary */}
        {formData?.amount && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-foreground mb-3">Transaction Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${parseFloat(formData?.amount || 0)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction Fee:</span>
              <span className="font-medium">${calculatedFee?.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">${totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Check */}
        <div className="flex items-center gap-2 text-sm">
          <Icon name="Wallet" size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">Available Balance:</span>
          <span className="font-medium">${userBalance?.toFixed(2)}</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isProcessing}
          disabled={!formData?.amount || !formData?.recipient || isProcessing}
          iconName="Send"
          iconPosition="left"
          className="mt-6"
        >
          {isProcessing ? 'Processing Payment...' : `Pay $${totalAmount?.toFixed(2)}`}
        </Button>
      </form>
      {/* Security Notice */}
      <div className="mt-6 p-3 bg-success/10 rounded-lg border border-success/20">
        <div className="flex items-start gap-2">
          <Icon name="Shield" size={16} className="text-success mt-0.5" />
          <div className="text-sm">
            <p className="text-success font-medium">Secure Transaction</p>
            <p className="text-success/80">Your payment is protected by 256-bit SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;