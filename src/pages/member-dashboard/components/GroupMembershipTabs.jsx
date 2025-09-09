import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const GroupMembershipTabs = ({ groups }) => {
  const navigate = useNavigate();

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <AppIcon name="Users" size={40} className="text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold text-foreground">No Group Memberships</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">You are not a member of any group yet.</p>
        <Button onClick={() => navigate('/public-groups')}>Explore Public Groups</Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">My Groups</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/group-creation')}>
          <AppIcon name="Plus" className="mr-2" size={16} />
          New Group
        </Button>
      </div>
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-3 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => navigate(`/group-management/${group.id}`)} // Assuming a route like this exists
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <AppIcon name="Users" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{group.name}</p>
                <p className="text-sm text-muted-foreground">{group.members_count || 0} members</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembershipTabs;