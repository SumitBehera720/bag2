import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { MessageSquare, Plus, Edit, Trash2, Star, RefreshCw, X, CheckCircle } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    rating: 5,
    content: '',
    avatar: '',
    is_active: true,
    sort_order: 0,
  });

  const loadData = async () => {
    try {
      const data = await api.get('/admin/testimonials');
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      company: '',
      role: '',
      rating: 5,
      content: '',
      avatar: '',
      is_active: true,
      sort_order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      company: item.company || '',
      role: item.role || '',
      rating: item.rating ?? 5,
      content: item.content || '',
      avatar: item.avatar || '',
      is_active: Boolean(item.is_active),
      sort_order: item.sort_order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.post(`/admin/testimonials/${editingItem.id}`, form);
      } else {
        await api.post('/admin/testimonials', form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save testimonial: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Client Reviews & Testimonials</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Manage client quotes, corporate logos, and social proof on the website
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setRefreshing(true); loadData(); }}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Plus size={16} /> Add Review
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <MessageSquare size={40} style={{ opacity: 0.5, marginBottom: 12 }} />
            <p>No testimonials added yet. Click "Add Review" to create your first client feedback.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company & Role</th>
                  <th>Rating</th>
                  <th>Review / Quote</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {t.company} {t.role ? `• ${t.role}` : ''}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{t.content}"
                    </td>
                    <td>
                      <span className={`badge ${t.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {t.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => openEditModal(t)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Delete"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 520 }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title">{editingItem ? 'Edit Review' : 'Add Client Review'}</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label required">Client Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rajesh Sharma"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TechCorp India"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Designation / Role</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Procurement Head"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Star Rating (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className="form-control"
                      value={form.rating}
                      onChange={e => setForm({ ...form, rating: parseInt(e.target.value, 10) || 5 })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Testimonial Quote</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="What did they say about the bags, printing quality, stitching, and on-time delivery?"
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e => setForm({ ...form, is_active: e.target.checked })}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                    />
                    Display on website
                  </label>
                </div>
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
