import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoanApplicationForm = ({ onSubmit, eligibilityData, isLoading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    repaymentPeriod: '',
    description: '',
    collateral: '',
    guarantor1: '',
    guarantor2: '',
    agreeToTerms: false,
    agreeToInterest: false
  });

  const [errors, setErrors] = useState({});
  const [calculatedData, setCalculatedData] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  const loanPurposes = [
    { value: 'business', label: 'Business Investment' },
    { value: 'education', label: 'Education/Training' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'agriculture', label: 'Agricultural Activities' },
    { value: 'home', label: 'Home Improvement' },
    { value: 'emergency', label: 'Emergency Expenses' },
    { value: 'other', label: 'Other' }
  ];

  const repaymentPeriods = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '18', label: '18 Months' },
    { value: '24', label: '24 Months' }
  ];

  useEffect(() => {
    if (formData?.amount && formData?.repaymentPeriod) {
      calculateLoanDetails();
    }
  }, [formData?.amount, formData?.repaymentPeriod]);

  const calculateLoanDetails = () => {
    const amount = parseFloat(formData?.amount) || 0;
    const months = parseInt(formData?.repaymentPeriod) || 1;
    const interestRate = eligibilityData?.interestRate || 0.15; // 15% annual rate
    
    const monthlyInterestRate = interestRate / 12;
    const totalInterest = amount * interestRate * (months / 12);
    const totalAmount = amount + totalInterest;
    const monthlyPayment = totalAmount / months;

    setCalculatedData({
      monthlyPayment,
      totalInterest,
      totalAmount
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid loan amount';
    } else if (parseFloat(formData?.amount) > (eligibilityData?.maxLoanAmount || 0)) {
      newErrors.amount = `Maximum loan amount is ${eligibilityData?.currency || 'USD'} ${eligibilityData?.maxLoanAmount?.toLocaleString() || '0'}`;
    }
    
    if (!formData?.purpose) {
      newErrors.purpose = 'Please select a loan purpose';
    }
    
    if (!formData?.repaymentPeriod) {
      newErrors.repaymentPeriod = 'Please select a repayment period';
    }
    
    if (!formData?.description?.trim()) {
      newErrors.description = 'Please provide a description for your loan request';
    }
    
    if (!formData?.guarantor1?.trim()) {
      newErrors.guarantor1 = 'Please provide at least one guarantor';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData?.agreeToInterest) {
      newErrors.agreeToInterest = 'You must agree to the interest rate and repayment terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        calculatedData,
        submittedAt: new Date()?.toISOString()
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: eligibilityData?.currency || 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Loan Application</h2>
            <p className="text-sm text-muted-foreground">Complete the form below to submit your loan request</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Loan Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Loan Amount"
            type="number"
            placeholder="Enter amount"
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            error={errors?.amount}
            required
            description={`Maximum: ${formatCurrency(eligibilityData?.maxLoanAmount || 0)}`}
          />
          
          <Select
            label="Repayment Period"
            placeholder="Select period"
            options={repaymentPeriods}
            value={formData?.repaymentPeriod}
            onChange={(value) => handleInputChange('repaymentPeriod', value)}
            error={errors?.repaymentPeriod}
            required
          />
        </div>

        {/* Loan Purpose */}
        <Select
          label="Loan Purpose"
          placeholder="Select the purpose of your loan"
          options={loanPurposes}
          value={formData?.purpose}
          onChange={(value) => handleInputChange('purpose', value)}
          error={errors?.purpose}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Loan Description <span className="text-accent">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
            placeholder="Provide detailed information about how you plan to use this loan..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
          />
          {errors?.description && (
            <p className="mt-1 text-sm text-error">{errors?.description}</p>
          )}
        </div>

        {/* Calculation Summary */}
        {formData?.amount && formData?.repaymentPeriod && (
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Loan Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Monthly Payment</span>
                <p className="font-semibold text-foreground font-data">
                  {formatCurrency(calculatedData?.monthlyPayment)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Interest</span>
                <p className="font-semibold text-warning font-data">
                  {formatCurrency(calculatedData?.totalInterest)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Amount</span>
                <p className="font-semibold text-foreground font-data">
                  {formatCurrency(calculatedData?.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guarantors */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Guarantors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Guarantor"
              type="text"
              placeholder="Full name of guarantor"
              value={formData?.guarantor1}
              onChange={(e) => handleInputChange('guarantor1', e?.target?.value)}
              error={errors?.guarantor1}
              required
            />
            
            <Input
              label="Secondary Guarantor (Optional)"
              type="text"
              placeholder="Full name of second guarantor"
              value={formData?.guarantor2}
              onChange={(e) => handleInputChange('guarantor2', e?.target?.value)}
            />
          </div>
        </div>

        {/* Collateral */}
        <Input
          label="Collateral (Optional)"
          type="text"
          placeholder="Describe any collateral you can provide"
          value={formData?.collateral}
          onChange={(e) => handleInputChange('collateral', e?.target?.value)}
          description="Providing collateral may improve your approval chances"
        />

        {/* Terms and Conditions */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Checkbox
            label="I agree to the terms and conditions"
            checked={formData?.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            required
          />
          
          <Checkbox
            label={`I agree to the ${((eligibilityData?.interestRate || 0.15) * 100)?.toFixed(1)}% annual interest rate and repayment schedule`}
            checked={formData?.agreeToInterest}
            onChange={(e) => handleInputChange('agreeToInterest', e?.target?.checked)}
            error={errors?.agreeToInterest}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Send"
            iconPosition="right"
            className="flex-1 md:flex-none"
          >
            Submit Application
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history?.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;