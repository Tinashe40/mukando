import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MemberInvitationSystem = ({ onInviteMember, inviteHistory }) => {
  const [inviteMethod, setInviteMethod] = useState('email');
  const [inviteData, setInviteData] = useState({
    email: '',
    phone: '',
    name: '',
    role: 'member',
    message: ''
  });
  const [inviteLink, setInviteLink] = useState('');
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);

  const inviteMethodOptions = [
    { value: 'email', label: 'Email Invitation' },
    { value: 'sms', label: 'SMS Invitation' },
    { value: 'whatsapp', label: 'WhatsApp Invitation' },
    { value: 'link', label: 'Shareable Link' }
  ];

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'moderator', label: 'Moderator' }
  ];

  const handleInputChange = (field, value) => {
    setInviteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateInviteLink = () => {
    const linkId = Math.random()?.toString(36)?.substring(2, 15);
    const baseUrl = window.location?.origin;
    const link = `${baseUrl}/join-group?invite=${linkId}&group=${encodeURIComponent('Mukando Savings Group')}`;
    setInviteLink(link);
    setShowLinkGenerator(true);
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard?.writeText(inviteLink);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSendInvite = () => {
    const invitePayload = {
      method: inviteMethod,
      ...inviteData,
      timestamp: new Date()?.toISOString()
    };
    
    onInviteMember(invitePayload);
    
    // Reset form
    setInviteData({
      email: '',
      phone: '',
      name: '',
      role: 'member',
      message: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      accepted: { color: 'bg-success text-success-foreground', label: 'Accepted' },
      expired: { color: 'bg-error text-error-foreground', label: 'Expired' },
      declined: { color: 'bg-muted text-muted-foreground', label: 'Declined' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Member Invitations</h3>
            <p className="text-sm text-muted-foreground">
              Invite new members to join your savings group
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={generateInviteLink}
            iconName="Link"
            iconPosition="left"
          >
            Generate Link
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Invite Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Invite Details */}
          <div className="space-y-4">
            <Select
              label="Invitation Method"
              options={inviteMethodOptions}
              value={inviteMethod}
              onChange={setInviteMethod}
            />

            {inviteMethod === 'email' && (
              <Input
                label="Email Address"
                type="email"
                value={inviteData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                placeholder="member@example.com"
                required
              />
            )}

            {(inviteMethod === 'sms' || inviteMethod === 'whatsapp') && (
              <Input
                label="Phone Number"
                type="tel"
                value={inviteData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                placeholder="+263 77 123 4567"
                required
              />
            )}

            <Input
              label="Member Name"
              value={inviteData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              placeholder="Full name of the member"
              required
            />

            <Select
              label="Role"
              options={roleOptions}
              value={inviteData?.role}
              onChange={(value) => handleInputChange('role', value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={inviteData?.message}
                onChange={(e) => handleInputChange('message', e?.target?.value)}
                placeholder="Add a personal message to the invitation..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <Button
              variant="default"
              onClick={handleSendInvite}
              disabled={!inviteData?.name || (!inviteData?.email && !inviteData?.phone)}
              iconName="Send"
              iconPosition="left"
              fullWidth
            >
              Send Invitation
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Invitation Preview</h4>
            
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Coins" size={16} color="white" />
                </div>
                <span className="font-semibold text-foreground">Mukando</span>
              </div>
              
              <h5 className="font-medium text-foreground mb-2">
                You're invited to join our savings group!
              </h5>
              
              <p className="text-sm text-muted-foreground mb-3">
                Hello {inviteData?.name || '[Member Name]'},
              </p>
              
              <p className="text-sm text-foreground mb-3">
                You've been invited to join "Mukando Savings Group" as a {inviteData?.role}. 
                Our group helps members save money together and access affordable loans.
              </p>
              
              {inviteData?.message && (
                <div className="bg-muted rounded p-3 mb-3">
                  <p className="text-sm text-foreground italic">
                    "{inviteData?.message}"
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" variant="default">Accept Invitation</Button>
                <Button size="sm" variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Shareable Link Generator */}
        {showLinkGenerator && (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Shareable Invitation Link</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLinkGenerator(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={copyInviteLink}
                iconName="Copy"
              >
                Copy
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              This link will expire in 7 days. Anyone with this link can join your group.
            </p>
          </div>
        )}

        {/* Invitation History */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Recent Invitations</h4>
          
          <div className="space-y-3">
            {inviteHistory?.map((invite) => (
              <div key={invite?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                    <Icon 
                      name={
                        invite?.method === 'email' ? 'Mail' :
                        invite?.method === 'sms' ? 'MessageSquare' :
                        invite?.method === 'whatsapp' ? 'MessageCircle' : 'Link'
                      } 
                      size={16} 
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invite?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {invite?.email || invite?.phone} • Sent {formatDate(invite?.sentDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(invite?.status)}
                  
                  <div className="flex gap-1">
                    {invite?.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Resend invitation"
                      >
                        <Icon name="RefreshCw" size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Cancel invitation"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {inviteHistory?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="UserPlus" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No invitations sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberInvitationSystem;