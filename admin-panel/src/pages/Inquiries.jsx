import React, { useState, useEffect } from 'react';
import { api, STATUS_COLORS, STATUS_LABELS } from '../api';
import {
  Inbox, Search, Filter, ArrowUpRight, MessageCircle,
  RefreshCw, CheckCircle, Clock, AlertCircle, XCircle, ChevronRight, Trash2
} from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadInquiries = async () => {
    try {
      let path = '/admin/inquiries?';
      if (statusFilter) path += `status=${statusFilter}&`;
      if (search) path += `search=${encodeURIComponent(search)}&`;
      const data = await api.get(path);
      setInquiries(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadInquiries();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.post(`/admin/inquiries/${id}/status`, { status: newStatus });
      setInquiries(prev =>
        prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id, inquiryId) => {
    if (!window.confirm(`Delete inquiry #${inquiryId}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err) {
      alert('Failed to delete inquiry: ' + err.message);
    }
  };

  const openWhatsApp = (inquiry) => {
    const phone = inquiry.phone?.replace(/[^0-9]/g, '');
    const cleanPhone = phone?.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${inquiry.name}, thank you for contacting ASKMEBAG regarding your inquiry for ${inquiry.product_name || 'custom bags'} (Qty: ${inquiry.quantity || 'N/A'}). How can we assist you with customization & quote today?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Inquiry Management (CRM)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Track, qualify, and convert customer bulk bag inquiries
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setRefreshing(true); loadInquiries(); }}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 260px', display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36, height: 38 }}
                placeholder="Search name, company, phone, email, product..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" style={{ height: 38 }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ height: 38, width: 170 }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <Inbox size={42} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p style={{ fontSize: 16, fontWeight: 500 }}>No inquiries found</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Try clearing your search or status filter</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Info</th>
                  <th>Product Requested</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => {
                  const statusColor = STATUS_COLORS[inq.status] || '#94a3b8';
                  return (
                    <tr key={inq.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                          #{inq.inquiry_id || inq.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{inq.name}</div>
                        {inq.company && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🏢 {inq.company}</div>}
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {inq.phone && <span>📞 {inq.phone}</span>}
                          {inq.email && <span style={{ marginLeft: 8 }}>✉️ {inq.email}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {inq.product_name || 'General Inquiry'}
                        </div>
                        {inq.customization_notes && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inq.customization_notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{inq.quantity ? `${inq.quantity} pcs` : '—'}</span>
                      </td>
                      <td>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className="form-control"
                          style={{
                            height: 30,
                            padding: '2px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                            color: statusColor,
                            borderColor: statusColor + '55',
                            backgroundColor: statusColor + '15',
                            cursor: 'pointer',
                          }}
                        >
                          {Object.entries(STATUS_LABELS).map(([k, label]) => (
                            <option key={k} value={k} style={{ color: '#000', backgroundColor: '#fff' }}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(inq.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          {inq.phone && (
                            <button
                              onClick={() => openWhatsApp(inq)}
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Chat on WhatsApp"
                              style={{ color: '#25D366' }}
                            >
                              <MessageCircle size={15} />
                            </button>
                          )}
                          <a
                            href={`#/inquiries/${inq.id}`}
                            className="btn btn-secondary btn-sm"
                            title="View Full CRM Details"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            Details <ChevronRight size={14} />
                          </a>
                          <button
                            onClick={() => handleDelete(inq.id, inq.inquiry_id || inq.id)}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Delete Inquiry"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
