import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import {
  Layers, Plus, Edit, Trash2, CheckCircle, RefreshCw, X,
  Upload, Image as ImageIcon
} from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image: '',
    display_order: 0,
    is_active: true,
  });

  const loadCategories = async () => {
    try {
      const data = await api.get('/admin/categories');
      // Sort by display_order ascending, then id
      const sorted = (data || []).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id);
      setCategories(sorted);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order ?? 0), 0);
    setForm({
      name: '',
      slug: '',
      description: '',
      cover_image: '',
      display_order: maxOrder + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      cover_image: cat.cover_image || cat.image || '',
      display_order: cat.display_order ?? 0,
      is_active: Boolean(cat.is_active),
    });
    setModalOpen(true);
  };

  const handleNameChange = (val) => {
    setForm(prev => {
      // Auto-generate slug if creating new and slug hasn't been manually set or matches old name
      const shouldAutoSlug = !editingCategory || !prev.slug;
      const slugVal = shouldAutoSlug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, name: val, slug: slugVal };
    });
  };

  // Direct Device Upload for Category Cover Image
  const handleDeviceImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'categories');
      const res = await api.postForm('/admin/media', fd);
      const url = res.url || ('/storage/' + res.path);
      setForm(prev => ({ ...prev, cover_image: url }));
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      display_order: parseInt(form.display_order, 10) || 0,
      is_active: Boolean(form.is_active),
    };

    try {
      if (editingCategory) {
        await api.post(`/admin/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      alert('Failed to save category: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category will keep their tags.`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Product Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Organize catalog models into clean customer-facing categories with custom sort order
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setRefreshing(true); loadCategories(); }}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <Layers size={40} style={{ opacity: 0.5, marginBottom: 12 }} />
            <p>No categories yet. Click "Add Category" above to create one.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Order</th>
                  <th style={{ width: 70 }}>Image</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>
                        #{c.display_order ?? 0}
                      </span>
                    </td>
                    <td>
                      {c.cover_image || c.image ? (
                        <img
                          src={c.cover_image || c.image}
                          alt={c.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', background: '#000' }}
                          onError={(e) => { e.target.style.opacity = '0.3'; }}
                        />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                          <Layers size={18} style={{ opacity: 0.3 }} />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>
                      {c.slug}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.description || '—'}
                    </td>
                    <td>
                      <span className={`badge ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => openEditModal(c)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
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

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ width: '100%', maxWidth: 520, animation: 'fadeIn 0.15s ease' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label required">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Executive Backpacks"
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slug (URL friendly key)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. executive-backpacks"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Auto-generated from name. Duplicates are resolved automatically.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Brief description of this product line"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Direct Device Upload for Cover Image - NO URL OPTION */}
                <div className="form-group">
                  <label className="form-label">Cover Image (Direct from Device)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleDeviceImageUpload}
                    style={{ display: 'none' }}
                  />

                  {form.cover_image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <img
                        src={form.cover_image}
                        alt="Category Cover"
                        style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 4, background: '#000' }}
                        onError={(e) => { e.target.style.opacity = '0.3'; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>Cover Image Attached</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {form.cover_image}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          title="Change image"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                          style={{ color: 'var(--danger)' }}
                          title="Remove image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{ width: '100%', justifyContent: 'center', padding: '10px 14px' }}
                    >
                      <Upload size={14} /> {uploadingImage ? 'Uploading Image...' : 'Upload Cover Image From Device'}
                    </button>
                  )}
                </div>

                {/* Order & Active Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
                  <div className="form-group">
                    <label className="form-label required">Display Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.display_order}
                      onChange={e => setForm({ ...form, display_order: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                      required
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lower numbers appear first (#1, #2...)</span>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={e => setForm({ ...form, is_active: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                      />
                      Active on Catalog
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--bg-card)' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : (editingCategory ? 'Save Changes' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
