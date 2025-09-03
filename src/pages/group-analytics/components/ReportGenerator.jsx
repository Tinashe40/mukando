import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ReportGenerator = ({ onGenerateReport, isGenerating = false }) => {
  const [reportConfig, setReportConfig] = useState({
    type: 'comprehensive',
    format: 'pdf',
    includeCharts: true,
    includeMemberDetails: true,
    includeRiskAnalysis: true,
    includeFinancialSummary: true,
    timeRange: '1M',
    customTitle: '',
    recipientEmail: ''
  });

  const reportTypeOptions = [
    { value: 'comprehensive', label: 'Comprehensive Report' },
    { value: 'financial', label: 'Financial Summary' },
    { value: 'member-analysis', label: 'Member Analysis' },
    { value: 'risk-assessment', label: 'Risk Assessment' },
    { value: 'loan-performance', label: 'Loan Performance' },
    { value: 'savings-growth', label: 'Savings Growth' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'json', label: 'JSON Data' }
  ];

  const timeRangeOptions = [
    { value: '1M', label: 'Last Month' },
    { value: '3M', label: 'Last 3 Months' },
    { value: '6M', label: 'Last 6 Months' },
    { value: '1Y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateReport = () => {
    onGenerateReport(reportConfig);
  };

  const getReportDescription = (type) => {
    const descriptions = {
      'comprehensive': 'Complete overview including all metrics, charts, and member analysis',
      'financial': 'Focus on savings, loans, and financial performance indicators',
      'member-analysis': 'Detailed breakdown of member engagement and contribution patterns',
      'risk-assessment': 'Risk analysis with credit scores and default probability metrics',
      'loan-performance': 'Loan distribution, repayment rates, and outstanding balances',
      'savings-growth': 'Savings trends, growth patterns, and contribution analysis'
    };
    return descriptions?.[type] || '';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Generate Report</h3>
          <p className="text-sm text-muted-foreground">Create detailed analytics reports for stakeholders</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <Select
            label="Report Type"
            description={getReportDescription(reportConfig?.type)}
            options={reportTypeOptions}
            value={reportConfig?.type}
            onChange={(value) => handleConfigChange('type', value)}
          />
        </div>

        {/* Format and Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Export Format"
            options={formatOptions}
            value={reportConfig?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
          
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={reportConfig?.timeRange}
            onChange={(value) => handleConfigChange('timeRange', value)}
          />
        </div>

        {/* Custom Title */}
        <Input
          label="Custom Report Title (Optional)"
          placeholder="e.g., Monthly Group Performance Report - December 2024"
          value={reportConfig?.customTitle}
          onChange={(e) => handleConfigChange('customTitle', e?.target?.value)}
        />

        {/* Report Sections */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Include Sections</h4>
          <div className="space-y-3">
            <Checkbox
              label="Charts and Visualizations"
              description="Include all charts and graphs in the report"
              checked={reportConfig?.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Member Details"
              description="Individual member performance and contribution data"
              checked={reportConfig?.includeMemberDetails}
              onChange={(e) => handleConfigChange('includeMemberDetails', e?.target?.checked)}
            />
            
            <Checkbox
              label="Risk Analysis"
              description="Credit scores, default risks, and member risk assessment"
              checked={reportConfig?.includeRiskAnalysis}
              onChange={(e) => handleConfigChange('includeRiskAnalysis', e?.target?.checked)}
            />
            
            <Checkbox
              label="Financial Summary"
              description="Key financial metrics and performance indicators"
              checked={reportConfig?.includeFinancialSummary}
              onChange={(e) => handleConfigChange('includeFinancialSummary', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Email Delivery */}
        <Input
          label="Email Report To (Optional)"
          type="email"
          placeholder="admin@mukando.com"
          description="Leave empty to download directly"
          value={reportConfig?.recipientEmail}
          onChange={(e) => handleConfigChange('recipientEmail', e?.target?.value)}
        />

        {/* Generate Button */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={handleGenerateReport}
            loading={isGenerating}
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
            className="flex-1 md:flex-none"
          >
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
          </Button>
          
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
          >
            Preview
          </Button>
        </div>

        {/* Report History */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Recent Reports</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Comprehensive Report - Nov 2024</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">PDF</span>
                <Button variant="ghost" size="icon">
                  <Icon name="Download" size={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Assessment - Nov 2024</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Excel</span>
                <Button variant="ghost" size="icon">
                  <Icon name="Download" size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;