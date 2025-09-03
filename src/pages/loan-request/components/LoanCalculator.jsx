import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const LoanCalculator = ({ eligibilityData }) => {
  const [calculatorData, setCalculatorData] = useState({
    amount: '',
    period: '12',
    interestRate: (eligibilityData?.interestRate || 0.15) * 100
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalAmount: 0,
    schedule: []
  });

  const [showSchedule, setShowSchedule] = useState(false);

  const periodOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '18', label: '18 Months' },
    { value: '24', label: '24 Months' }
  ];

  useEffect(() => {
    if (calculatorData?.amount && calculatorData?.period) {
      calculateLoan();
    }
  }, [calculatorData]);

  const calculateLoan = () => {
    const principal = parseFloat(calculatorData?.amount) || 0;
    const months = parseInt(calculatorData?.period) || 1;
    const annualRate = parseFloat(calculatorData?.interestRate) / 100 || 0.15;
    
    // Simple interest calculation for microfinance
    const totalInterest = principal * annualRate * (months / 12);
    const totalAmount = principal + totalInterest;
    const monthlyPayment = totalAmount / months;

    // Generate repayment schedule
    const schedule = [];
    const monthlyPrincipal = principal / months;
    const monthlyInterestAmount = totalInterest / months;
    let remainingBalance = principal;

    for (let i = 1; i <= months; i++) {
      const paymentDate = new Date();
      paymentDate?.setMonth(paymentDate?.getMonth() + i);
      
      schedule?.push({
        month: i,
        date: paymentDate,
        payment: monthlyPayment,
        principal: monthlyPrincipal,
        interest: monthlyInterestAmount,
        balance: Math.max(0, remainingBalance - monthlyPrincipal)
      });
      
      remainingBalance -= monthlyPrincipal;
    }

    setResults({
      monthlyPayment,
      totalInterest,
      totalAmount,
      schedule
    });
  };

  const handleInputChange = (field, value) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: eligibilityData?.currency || 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calculator" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Loan Calculator</h2>
            <p className="text-sm text-muted-foreground">Calculate your loan repayments</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Calculator Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Loan Amount"
            type="number"
            placeholder="Enter amount"
            value={calculatorData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            description={`Max: ${formatCurrency(eligibilityData?.maxLoanAmount || 0)}`}
          />
          
          <Select
            label="Repayment Period"
            options={periodOptions}
            value={calculatorData?.period}
            onChange={(value) => handleInputChange('period', value)}
          />
        </div>

        <Input
          label="Interest Rate (% per annum)"
          type="number"
          step="0.1"
          value={calculatorData?.interestRate}
          onChange={(e) => handleInputChange('interestRate', e?.target?.value)}
          description="Group standard rate"
        />

        {/* Results */}
        {calculatorData?.amount && (
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="Calendar" size={20} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-xl font-bold text-foreground font-data">
                  {formatCurrency(results?.monthlyPayment)}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="Percent" size={20} className="text-warning" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                <p className="text-xl font-bold text-warning font-data">
                  {formatCurrency(results?.totalInterest)}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="DollarSign" size={20} className="text-secondary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-xl font-bold text-foreground font-data">
                  {formatCurrency(results?.totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSchedule(!showSchedule)}
                iconName={showSchedule ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
              >
                {showSchedule ? 'Hide' : 'Show'} Payment Schedule
              </Button>
              
              <Button
                variant="ghost"
                iconName="Download"
                iconPosition="left"
              >
                Export Schedule
              </Button>
            </div>
          </div>
        )}

        {/* Payment Schedule */}
        {showSchedule && results?.schedule?.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted border-b border-border">
              <h4 className="font-semibold text-foreground">Payment Schedule</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Month</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Payment</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Principal</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Interest</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.schedule?.map((payment, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {payment?.month}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(payment?.date)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground text-right font-data">
                        {formatCurrency(payment?.payment)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground text-right font-data">
                        {formatCurrency(payment?.principal)}
                      </td>
                      <td className="px-4 py-3 text-sm text-warning text-right font-data">
                        {formatCurrency(payment?.interest)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground text-right font-data">
                        {formatCurrency(payment?.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comparison Tool */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Quick Comparison</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-card rounded p-3">
              <p className="text-muted-foreground mb-1">6 Months</p>
              <p className="font-semibold text-foreground font-data">
                {formatCurrency((parseFloat(calculatorData?.amount) || 0) * 1.075 / 6)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="bg-card rounded p-3">
              <p className="text-muted-foreground mb-1">12 Months</p>
              <p className="font-semibold text-foreground font-data">
                {formatCurrency((parseFloat(calculatorData?.amount) || 0) * 1.15 / 12)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="bg-card rounded p-3">
              <p className="text-muted-foreground mb-1">24 Months</p>
              <p className="font-semibold text-foreground font-data">
                {formatCurrency((parseFloat(calculatorData?.amount) || 0) * 1.30 / 24)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;