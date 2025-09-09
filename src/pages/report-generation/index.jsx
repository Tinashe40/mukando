import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ReportGeneration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const reportOptions = [
    { value: 'financial_summary', label: 'Financial Summary' },
    { value: 'member_contributions', label: 'Member Contributions' },
    { value: 'loan_performance', label: 'Loan Performance' },
    { value: 'audit_log', label: 'Audit Log' },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Generating report with data:', data);
    setIsLoading(false);
    // Add success message/download logic here
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Report Generation</h1>
        <p className="text-muted-foreground mt-1">Generate and export detailed reports for your records.</p>
      </header>

      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            label="Report Type"
            {...register('reportType', { required: 'Please select a report type' })}
            options={reportOptions}
            error={errors.reportType?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              error={errors.startDate?.message}
            />
            <Input
              label="End Date"
              type="date"
              {...register('endDate', { required: 'End date is required' })}
              error={errors.endDate?.message}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>
              <AppIcon name="FileText" className="mr-2" />
              Generate Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportGeneration;