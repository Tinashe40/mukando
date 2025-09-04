import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { getAuditLogs } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="ClipboardList" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-warm">
              <ul className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <li key={log.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-foreground">{log.action} on {log.entity_type} {log.entity_id}</p>
                        <p className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">User: {log.user_id}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuditLog;
