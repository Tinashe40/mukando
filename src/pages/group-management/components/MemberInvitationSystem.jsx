import React from 'react';
import { useForm } from 'react-hook-form';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MemberInvitationSystem = ({ onInviteMember, inviteHistory }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    onInviteMember(data);
    reset();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Invite New Member</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" {...register('name', { required: true })} />
            <Input label="Email Address" type="email" {...register('email', { required: true })} />
          </div>
          <div className="flex justify-end">
            <Button type="submit"><AppIcon name="Send" className="mr-2" /> Send Invitation</Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">Invitation History</h3>
        <div className="mt-4 space-y-3">
          {inviteHistory?.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold text-foreground">{invite.name}</p>
                <p className="text-sm text-muted-foreground">{invite.email}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${invite.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {invite.status}
              </span>
            </div>
          ))}
          {inviteHistory?.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No invitations sent yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberInvitationSystem;
