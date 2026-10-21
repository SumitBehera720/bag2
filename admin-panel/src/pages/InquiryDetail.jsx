import React, { useState, useEffect } from 'react';
import { api, STATUS_COLORS, STATUS_LABELS } from '../api';
import {
  ArrowLeft, MessageCircle, Send, Plus, CheckCircle, Clock,
  Calendar, Phone, Mail, Building, Package, FileText, User
} from 'lucide-react';

export default function InquiryDetail() {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Extract ID from URL hash e.g. #/inquiries/5
  const getInquiryId = () => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    return parts[parts.length - 1];
  };

  const loadData = async () => {
    try {
      const id = getInquiryId();
      const data = await api.get(`/admin/inquiries/${id}`);
      setInquiry(data);
    } catch (err) {
      console.error(err);
      alert('Error loading inquiry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!inquiry) return;
    setUpdatingStatus(true);
    try {
      await api.post(`/admin/inquiries/${inquiry.id}/status`, { status: newStatus });
      setInquiry(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !inquiry) return;
    setSubmittingNote(true);
    try {
      await api.post(`/admin/inquiries/${inquiry.id}/notes`, { note: newNote });
      setNewNote('');
      loadData();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  const openWhatsApp = () => {
    if (!inquiry?.phone) return;
    const phone = inquiry.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${inquiry.name}, thank you for contacting ASKMEBAG regarding your inquiry #${inquiry.inquiry_id || inquiry.id} for ${inquiry.product_name || 'custom bags'}.\n\nOrder Quantity: ${inquiry.quantity || 'N/A'}\n\nWe are preparing your custom quote. Could you please share any specific artwork/logo files or color codes you prefer?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!inquiry) return <div style={{ padding: 40, textAlign: 'center' }}>Inquiry not found. <a href="#/inquiries">Back to list</a></div>;

  const statusColor = STATUS_COLORS[inquiry.status] || '#94a3b8';

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="#/inquiries" className="btn btn-secondary btn-sm btn-icon">
            <ArrowLeft size={16} />
          </a>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>Inquiry #{inquiry.inquiry_id || inquiry.id}</h2>
              <span
                className="badge-status"
                style={{
                  color: statusColor,
                  background: statusColor + '1a',
                  border: `1px solid ${statusColor}44`,
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                {STATUS_LABELS[inquiry.status] || inquiry.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              Submitted on {new Date(inquiry.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {inquiry.phone && (
            <button
              onClick={openWhatsApp}
              className="btn btn-secondary btn-sm"
              style={{ color: '#25D366', borderColor: '#25D36644', background: '#25D36615', fontWeight: 600 }}
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </button>
          )}

          <select
            value={inquiry.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            className="form-control"
            style={{
              height: 36,
              width: 160,
              fontSize: 13,
              fontWeight: 600,
              borderColor: statusColor,
              color: statusColor,
              background: statusColor + '10'
            }}
          >
            {Object.entries(STATUS_LABELS).map(([k, label]) => (
              <option key={k} value={k} style={{ color: '#000', backgroundColor: '#fff' }}>
                Status: {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Left Column: Client & Inquiry Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Customer Information Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={16} color="var(--accent)" /> Customer Profile
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{inquiry.name}</div>
              </div>

              {inquiry.company && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Company / Organization</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building size={14} color="var(--text-secondary)" /> {inquiry.company}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone / WhatsApp</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                    {inquiry.phone ? (
                      <a href={`tel:${inquiry.phone}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {inquiry.phone}
                      </a>
                    ) : '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                    {inquiry.email ? (
                      <a href={`mailto:${inquiry.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {inquiry.email}
                      </a>
                    ) : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product & Requirement Details */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={16} color="var(--accent)" /> Order & Customization Specs
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Product Requested</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', marginTop: 2 }}>
                    {inquiry.product_name || 'General Inquire'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quantity</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
                    {inquiry.quantity ? `${inquiry.quantity} Units` : 'Not specified'}
                  </div>
                </div>
              </div>

              {inquiry.required_date && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Delivery Date</div>
                  <div style={{ fontSize: 14, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--text-secondary)" /> {inquiry.required_date}
                  </div>
                </div>
              )}

              {inquiry.customization_notes && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customization / Branding Notes</div>
                  <div style={{ fontSize: 13, background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 8, marginTop: 4, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {inquiry.customization_notes}
                  </div>
                </div>
              )}

              {inquiry.notes && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Additional Requirements</div>
                  <div style={{ fontSize: 13, background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 8, marginTop: 4, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {inquiry.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: CRM Activity & Internal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Notes Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="var(--accent)" /> Internal CRM Notes & Follow-ups
              </span>
            </div>
            <div className="card-body">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Log a client conversation, quote details, material sample updates, or follow-up note..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={submittingNote || !newNote.trim()}>
                    <Plus size={14} /> Add Note
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(!inquiry.notes_list || inquiry.notes_list.length === 0) ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                    No internal notes yet. Add one above to keep team in sync.
                  </p>
                ) : (
                  inquiry.notes_list.map((n, idx) => (
                    <div
                      key={n.id || idx}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 8,
                        borderLeft: '3px solid var(--accent)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {n.user_name || 'Admin'}
                        </span>
                        <span>{new Date(n.created_at).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                        {n.note}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
