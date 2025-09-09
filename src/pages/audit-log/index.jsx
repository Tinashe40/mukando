import React, { useEffect, useState } from 'react';
import AppIcon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAuditLogs } from '../../lib/supabase';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setIsLoading(true);
      const data = await getAuditLogs();
      setAuditLogs(data || []);
      setIsLoading(false);
    };
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and changes.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Action</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Entity</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">User</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="p-4 font-medium text-foreground">{log.action}</td>
                    <td className="p-4 text-muted-foreground">{log.entity_type} #{log.entity_id}</td>
                    <td className="p-4 text-muted-foreground">{log.user_id}</td>
                    <td className="p-4 text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;