import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Package, Inbox, TrendingUp, Users, ArrowUpRight, Clock, CheckCircle, AlertCircle, XCircle, RefreshCw, ExternalLink, MessageCircle } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '../api';

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
    {Icon && <div className="stat-icon"><Icon size={48} /></div>}
  </div>
);

const statusIcon = (s) => {
  if (s === 'new') return <AlertCircle size={13} />;
  if (s === 'converted') return <CheckCircle size={13} />;
  if (s === 'lost') return <XCircle size={13} />;
  return <Clock size={13} />;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const refresh = () => { setRefreshing(true); load(); };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>ASKMEBAG business overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
          </button>
          <a href="https://askmebag.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            <ExternalLink size={14} /> View Website
          </a>
        </div>
      </div>

      {/* Product Stats */}
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 10 }}>Products</p>
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard label="Total Products" value={stats?.products?.total ?? 0} sub="In catalog" color="#f59e0b" icon={Package} />
        <StatCard label="Active" value={stats?.products?.active ?? 0} sub="Visible on website" color="#10b981" icon={Package} />
        <StatCard label="Inactive" value={stats?.products?.inactive ?? 0} sub="Hidden from website" color="#6b7280" icon={Package} />
      </div>

      {/* Inquiry Stats */}
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 10 }}>Inquiries</p>
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard label="Total Inquiries" value={stats?.inquiries?.total ?? 0} color="#3b82f6" icon={Inbox} />
        <StatCard label="New" value={stats?.inquiries?.new ?? 0} sub="Awaiting response" color="#f59e0b" icon={AlertCircle} />
        <StatCard label="Follow-up" value={stats?.inquiries?.contacted ?? 0} color="#f97316" icon={Clock} />
        <StatCard label="Quote Sent" value={stats?.inquiries?.quotation_sent ?? 0} color="#8b5cf6" icon={TrendingUp} />
        <StatCard label="Converted" value={stats?.inquiries?.converted ?? 0} color="#10b981" icon={CheckCircle} />
        <StatCard label="Lost" value={stats?.inquiries?.lost ?? 0} color="#ef4444" icon={XCircle} />
      </div>

      {/* Recent Inquiries Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Inquiries</span>
          <a href="#/inquiries" className="btn btn-secondary btn-sm">View All <ArrowUpRight size={13} /></a>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Company</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_inquiries?.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No inquiries yet</td></tr>
              )}
              {stats?.recent_inquiries?.map(inq => (
                <tr key={inq.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent)' }}>#{inq.inquiry_id}</span></td>
                  <td style={{ fontWeight: 500 }}>{inq.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inq.company || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.product_name || '—'}</td>
                  <td>{inq.quantity ? inq.quantity + ' units' : '—'}</td>
                  <td>
                    <span className="badge-status" style={{ color: STATUS_COLORS[inq.status], background: STATUS_COLORS[inq.status] + '1a', border: `1px solid ${STATUS_COLORS[inq.status]}44` }}>
                      {statusIcon(inq.status)} {STATUS_LABELS[inq.status] || inq.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(inq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`#/inquiries/${inq.id}`} className="btn btn-secondary btn-sm btn-icon" title="View"><ArrowUpRight size={13} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
