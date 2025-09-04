import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const ReportGeneration = () => {
  const [reportType, setReportType] = useState('financial_summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reportOptions = [
    { value: 'financial_summary', label: 'Financial Summary' },
    { value: 'member_contributions', label: 'Member Contributions' },
    { value: 'loan_performance', label: 'Loan Performance' },
    { value: 'audit_log', label: 'Audit Log' },
  ];

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Generating ${reportType} report from ${startDate} to ${endDate}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="FileText" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Report Generation</h1>
          </div>
          <form onSubmit={handleGenerateReport} className="space-y-6">
            <Select
              label="Report Type"
              options={reportOptions}
              value={reportType}
              onChange={setReportType}
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <Button type="submit" loading={isLoading}>
              Generate Report
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReportGeneration;
