import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Activity, RefreshCw, User, Clock } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = async () => {
    try {
      const data = await api.get('/admin/activity-logs');
      setLogs(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Admin Audit & Activity Logs</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Complete audit trail of all changes made across the CMS, products, and inquiries
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { setRefreshing(true); loadLogs(); }}
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 50, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Activity size={40} style={{ opacity: 0.4, marginBottom: 12 }} />
            <p>No activity logs recorded yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} color="var(--accent)" /> {log.user_name || 'System'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'uppercase', fontSize: 11 }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
