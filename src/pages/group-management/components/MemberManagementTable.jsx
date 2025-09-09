import React, { useMemo, useState } from 'react';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MemberManagementTable = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {selectedMembers.length > 0 && (
            <Button variant="outline">Actions ({selectedMembers.length})</Button>
          )}
          <Button><AppIcon name="UserPlus" className="mr-2" /> Invite</Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 w-4"><Checkbox onChange={handleSelectAll} /></th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Role</th>
              <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.map(member => (
              <tr key={member.id} className="hover:bg-muted/50">
                <td className="p-4"><Checkbox checked={selectedMembers.includes(member.id)} onChange={() => setSelectedMembers(prev => prev.includes(member.id) ? prev.filter(id => id !== member.id) : [...prev, member.id])} /></td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar_url} alt={member.full_name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">Active</span></td>
                <td className="p-4 text-sm text-muted-foreground">{member.role}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon"><AppIcon name="MoreHorizontal" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberManagementTable;