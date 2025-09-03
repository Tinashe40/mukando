import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberManagementTable = ({ members, onMemberAction, onBulkAction }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const statusOptions = [
    { value: 'all', label: 'All Members' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'contributions', label: 'Total Contributions' },
    { value: 'loans', label: 'Active Loans' }
  ];

  const filteredMembers = members?.filter(member => {
      const matchesSearch = member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           member?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = filterStatus === 'all' || member?.status === filterStatus;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'contributions':
          return b?.totalContributions - a?.totalContributions;
        case 'loans':
          return b?.activeLoans - a?.activeLoans;
        default:
          return 0;
      }
    });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMembers(filteredMembers?.map(member => member?.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId, checked) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers?.filter(id => id !== memberId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      suspended: { color: 'bg-error text-error-foreground', label: 'Suspended' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB');
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Member Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage group members, track contributions, and monitor activities
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Input
              type="search"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-full sm:w-32"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMembers?.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedMembers?.length} member{selectedMembers?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('suspend', selectedMembers)}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('activate', selectedMembers)}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('sendReminder', selectedMembers)}
              >
                Send Reminder
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedMembers?.length === filteredMembers?.length && filteredMembers?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Member</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Join Date</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Contributions</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Active Loans</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Last Activity</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers?.map((member) => (
              <tr key={member?.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedMembers?.includes(member?.id)}
                    onChange={(e) => handleSelectMember(member?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={member?.avatar}
                        alt={member?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member?.name}</p>
                      <p className="text-sm text-muted-foreground">{member?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(member?.status)}
                </td>
                <td className="p-4 text-sm text-foreground">
                  {formatDate(member?.joinDate)}
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground font-data">
                      {formatCurrency(member?.totalContributions)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member?.contributionCount} payments
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground font-data">
                      {formatCurrency(member?.activeLoanAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member?.activeLoans} loan{member?.activeLoans !== 1 ? 's' : ''}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(member?.lastActivity)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMemberAction('view', member?.id)}
                      title="View Profile"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMemberAction('edit', member?.id)}
                      title="Edit Member"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMemberAction('message', member?.id)}
                      title="Send Message"
                    >
                      <Icon name="MessageCircle" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMemberAction('more', member?.id)}
                      title="More Actions"
                    >
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredMembers?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No members found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'Start by inviting members to your group'
            }
          </p>
        </div>
      )}
      {/* Pagination */}
      {filteredMembers?.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMembers?.length} of {members?.length} members
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagementTable;