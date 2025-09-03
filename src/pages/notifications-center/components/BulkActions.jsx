import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedNotifications, 
  onSelectAll, 
  onDeselectAll, 
  onBulkMarkAsRead, 
  onBulkMarkAsUnread, 
  onBulkDelete,
  totalNotifications,
  filteredCount 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'mark_read', label: 'Mark as Read' },
    { value: 'mark_unread', label: 'Mark as Unread' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleBulkAction = (action) => {
    if (selectedNotifications?.length === 0) return;

    switch (action) {
      case 'mark_read':
        onBulkMarkAsRead(selectedNotifications);
        break;
      case 'mark_unread':
        onBulkMarkAsUnread(selectedNotifications);
        break;
      case 'delete':
        setShowConfirmDialog('delete');
        break;
      default:
        break;
    }
  };

  const confirmBulkDelete = () => {
    onBulkDelete(selectedNotifications);
    setShowConfirmDialog(null);
  };

  const isAllSelected = selectedNotifications?.length === filteredCount && filteredCount > 0;
  const isPartiallySelected = selectedNotifications?.length > 0 && selectedNotifications?.length < filteredCount;

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Selection Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    onSelectAll();
                  } else {
                    onDeselectAll();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                {selectedNotifications?.length > 0 
                  ? `${selectedNotifications?.length} selected`
                  : 'Select all'
                }
              </span>
            </div>

            {selectedNotifications?.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onDeselectAll}
                >
                  Clear Selection
                </Button>
                <div className="w-px h-4 bg-border"></div>
                <span className="text-xs text-muted-foreground">
                  {selectedNotifications?.length} of {filteredCount} notifications
                </span>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            {selectedNotifications?.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Check"
                  iconPosition="left"
                  onClick={() => handleBulkAction('mark_read')}
                >
                  Mark Read
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => handleBulkAction('mark_unread')}
                >
                  Mark Unread
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Trash2"
                  onClick={() => handleBulkAction('delete')}
                  className="text-error hover:text-error"
                >
                  Delete
                </Button>
              </>
            )}

            <Select
              options={bulkActionOptions}
              value=""
              onChange={(value) => value && handleBulkAction(value)}
              placeholder="Bulk actions..."
              className="min-w-40"
              disabled={selectedNotifications?.length === 0}
            />
          </div>
        </div>

        {/* Quick Stats */}
        {selectedNotifications?.length === 0 && (
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
            <span>Total: {totalNotifications} notifications</span>
            <span>Filtered: {filteredCount} notifications</span>
            <span>Select notifications to perform bulk actions</span>
          </div>
        )}
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog === 'delete' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Confirm Bulk Delete</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete {selectedNotifications?.length} selected notifications? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDialog(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={confirmBulkDelete}
              >
                Delete {selectedNotifications?.length} Notifications
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;