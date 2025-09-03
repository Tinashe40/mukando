import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatus = ({ integrations, onTestConnection, onRefreshStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testingConnection, setTestingConnection] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'disconnected': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'testing': return 'Loader';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-error';
      case 'warning': return 'text-warning';
      case 'testing': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      connected: { color: 'bg-success/10 text-success', label: 'Connected' },
      disconnected: { color: 'bg-error/10 text-error', label: 'Disconnected' },
      warning: { color: 'bg-warning/10 text-warning', label: 'Issues' },
      testing: { color: 'bg-primary/10 text-primary', label: 'Testing' }
    };

    const config = statusConfig?.[status] || statusConfig?.disconnected;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleTestConnection = async (integrationId) => {
    setTestingConnection(integrationId);
    try {
      await onTestConnection(integrationId);
    } finally {
      setTestingConnection(null);
    }
  };

  const connectedCount = integrations?.filter(i => i?.status === 'connected')?.length;
  const hasIssues = integrations?.some(i => i?.status === 'disconnected' || i?.status === 'warning');

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Integration Status</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            hasIssues ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
          }`}>
            {connectedCount}/{integrations?.length} connected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            iconName="RefreshCw"
            onClick={onRefreshStatus}
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations?.map((integration) => (
              <div key={integration?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration?.status === 'connected' ? 'bg-success/10' : 
                      integration?.status === 'warning' ? 'bg-warning/10' : 'bg-error/10'
                    }`}>
                      <Icon 
                        name={integration?.icon} 
                        size={20} 
                        className={getStatusColor(integration?.status)}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{integration?.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(integration?.status)}
                    <Icon 
                      name={getStatusIcon(testingConnection === integration?.id ? 'testing' : integration?.status)} 
                      size={16} 
                      className={`${getStatusColor(testingConnection === integration?.id ? 'testing' : integration?.status)} ${
                        testingConnection === integration?.id ? 'animate-spin' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Check:</span>
                    <span className="text-foreground">
                      {new Date(integration.lastChecked)?.toLocaleString()}
                    </span>
                  </div>
                  {integration?.lastSuccess && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Success:</span>
                      <span className="text-foreground">
                        {new Date(integration.lastSuccess)?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {integration?.messagesSent && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Messages Sent (24h):</span>
                      <span className="text-foreground">{integration?.messagesSent}</span>
                    </div>
                  )}
                  {integration?.successRate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="text-foreground">{integration?.successRate}%</span>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {integration?.error && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-error">Connection Error</p>
                        <p className="text-xs text-error/80 mt-1">{integration?.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning Message */}
                {integration?.warning && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning">Warning</p>
                        <p className="text-xs text-warning/80 mt-1">{integration?.warning}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="TestTube"
                    iconPosition="left"
                    loading={testingConnection === integration?.id}
                    onClick={() => handleTestConnection(integration?.id)}
                  >
                    Test Connection
                  </Button>
                  {integration?.status === 'disconnected' && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Settings"
                      iconPosition="left"
                    >
                      Configure
                    </Button>
                  )}
                  {integration?.status === 'connected' && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="BarChart3"
                      iconPosition="left"
                    >
                      View Stats
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Troubleshooting Guide */}
          <div className="mt-6 bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="HelpCircle" size={16} />
              Troubleshooting Guide
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>SMS Issues:</strong> Check your SMS provider balance and API credentials</p>
              <p>• <strong>Email Problems:</strong> Verify SMTP settings and sender domain authentication</p>
              <p>• <strong>WhatsApp Errors:</strong> Ensure WhatsApp Business API is properly configured</p>
              <p>• <strong>Push Notifications:</strong> Check FCM/APNS certificates and device tokens</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              iconPosition="right"
              className="mt-3"
            >
              View Full Documentation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationStatus;