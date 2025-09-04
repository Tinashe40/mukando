import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { createGroup } from '../../lib/supabase';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newGroup = await createGroup({ name: groupName, description, created_by: user.id });
      if (newGroup) {
        navigate(`/group-management`);
      } else {
        alert('Failed to create group. Please try again.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Users" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Create a New Group</h1>
          </div>
          <form onSubmit={handleCreateGroup} className="space-y-6">
            <Input
              label="Group Name"
              placeholder="Enter the name of your group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <Input
              label="Group Description"
              placeholder="Enter a brief description of your group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" loading={isLoading}>
              Create Group
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;
