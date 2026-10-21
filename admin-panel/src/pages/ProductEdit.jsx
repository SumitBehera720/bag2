import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import {
  ArrowLeft, Save, Plus, Trash2, Image, Check, AlertCircle,
  Upload, Star, RefreshCw
} from 'lucide-react';

const getTagLabel = (item) => {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object') {
    return item.name || item.title || item.label || JSON.stringify(item);
  }
  return String(item);
};

const getTagHex = (item) => {
  if (item && typeof item === 'object' && item.hex) return item.hex;
  return null;
};

export default function ProductEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState(id);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    category: '',
    tagline: '',
    description: '',
    capacity: '',
    laptop_fit: '',
    min_order: 50,
    lead_time: '7-10 Days',
    logo_position: 'Front Center',
    primary_image: '',
    is_active: true,
    is_featured: false,
    is_customizable: true,
    sort_order: 0,
    features: ['Water-resistant exterior', 'Padded ergonomic straps', 'Reinforced stitching'],
    color_options: ['Black', 'Navy Blue', 'Grey'],
    materials: ['900D Polyester', 'Waterproof PU coated fabric'],
    branding_options: ['Screen Printing', 'Embroidery', 'Metal Badge', 'Debossed Patch'],
  });

  const [images, setImages] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const galleryInputRef = useRef(null);
  const primaryInputRef = useRef(null);

  // Helpers for tag array inputs
  const [featureInput, setFeatureInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [materialInput, setMaterialInput] = useState('');
  const [brandingInput, setBrandingInput] = useState('');

  useEffect(() => {
    // Load categories
    api.get('/admin/categories').then(setCategories).catch(console.error);

    if (isNew) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setProductId(id);

    api.get(`/admin/products/${id}`)
      .then((prod) => {
        setForm({
          name: prod.name || '',
          slug: prod.slug || '',
          sku: prod.sku || '',
          category: prod.category || '',
          tagline: prod.tagline || '',
          description: prod.description || '',
          capacity: prod.capacity || '',
          laptop_fit: prod.laptop_fit || '',
          min_order: prod.min_order ?? 50,
          lead_time: prod.lead_time || '7-10 Days',
          logo_position: prod.logo_position || '',
          primary_image: prod.primary_image || '',
          is_active: Boolean(prod.is_active),
          is_featured: Boolean(prod.is_featured),
          is_customizable: Boolean(prod.is_customizable),
          sort_order: prod.sort_order ?? 0,
          features: Array.isArray(prod.features) ? prod.features : [],
          color_options: Array.isArray(prod.color_options) ? prod.color_options : [],
          materials: Array.isArray(prod.materials) ? prod.materials : [],
          branding_options: Array.isArray(prod.branding_options) ? prod.branding_options : [],
        });
        setImages(prod.images || []);
      })
      .catch((err) => {
        console.error('Failed to load product:', err);
        alert('Failed to load product: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = (field, value, setter) => {
    if (!value.trim()) return;
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter('');
  };

  const handleRemoveTag = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  // Direct Device Upload for Gallery
  const handleDeviceGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      alert('Please select valid image files (JPG, PNG, WEBP, etc.)');
      return;
    }

    setUploadingGallery(true);
    setUploadProgress({ current: 0, total: fileList.length });

    try {
      const uploadedImages = [];
      for (let i = 0; i < fileList.length; i++) {
        setUploadProgress({ current: i + 1, total: fileList.length });
        const file = fileList[i];
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'products');

        const res = await api.postForm('/admin/media', fd);
        const url = res.url || ('/storage/' + res.path);
        uploadedImages.push({
          id: res.id || Date.now() + i,
          path: url,
          is_primary: false,
        });
      }

      setImages(prev => {
        const next = [...prev, ...uploadedImages];
        if (!form.primary_image && next.length > 0) {
          const firstImgPath = typeof next[0] === 'string' ? next[0] : next[0].path;
          setForm(f => ({ ...f, primary_image: firstImgPath }));
        }
        return next;
      });
    } catch (err) {
      alert('Error uploading images from device: ' + err.message);
    } finally {
      setUploadingGallery(false);
      setUploadProgress({ current: 0, total: 0 });
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Direct Device Upload for Primary Image
  const handlePrimaryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingPrimary(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'products');
      const res = await api.postForm('/admin/media', fd);
      const url = res.url || ('/storage/' + res.path);
      setForm(f => ({ ...f, primary_image: url }));

      // Also ensure this image is in the images gallery
      setImages(prev => {
        const exists = prev.some(img => (typeof img === 'string' ? img : img.path) === url);
        if (exists) return prev;
        return [{ id: res.id || Date.now(), path: url, is_primary: true }, ...prev];
      });
    } catch (err) {
      alert('Failed to upload primary image: ' + err.message);
    } finally {
      setUploadingPrimary(false);
      if (primaryInputRef.current) primaryInputRef.current.value = '';
    }
  };

  const handleSetPrimaryImage = (path) => {
    setForm(f => ({ ...f, primary_image: path }));
  };

  const handleRemoveImage = async (img, idx) => {
    if (img.id && !isNew) {
      try {
        await api.delete(`/admin/product-images/${img.id}`);
      } catch (err) {
        console.warn('Could not delete image on server:', err);
      }
    }
    setImages(prev => prev.filter((_, i) => i !== idx));
    const targetPath = typeof img === 'string' ? img : img.path;
    if (form.primary_image === targetPath) {
      const remaining = images.filter((_, i) => i !== idx);
      const nextPath = remaining[0] ? (typeof remaining[0] === 'string' ? remaining[0] : remaining[0].path) : '';
      setForm(f => ({ ...f, primary_image: nextPath }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: images.map(img => (typeof img === 'string' ? img : img.path))
      };

      if (isNew) {
        const created = await api.post('/admin/products', payload);
        alert('Product created successfully!');
        window.location.hash = `#/products/${created.id}/edit`;
      } else {
        await api.post(`/admin/products/${productId}`, payload);
        alert('Product saved successfully!');
      }
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <form onSubmit={handleSubmit} className="product-edit-form" style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/products" className="btn btn-secondary btn-sm btn-icon" title="Back to catalog">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
              {isNew ? 'Create New Product' : `Edit: ${form.name || 'Product #' + id}`}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              Configure product details, bulk customization options, and media
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/products" className="btn btn-secondary btn-sm">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="product-edit-grid">
        {/* Main Details (Left Column) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {/* Basic Info */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Basic Information</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Apex Corporate Executive Backpack"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug || c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">SKU / Model Code</label>
                  <input
                    type="text"
                    name="sku"
                    className="form-control"
                    placeholder="e.g. AMB-BP-001"
                    value={form.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Marketing Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  className="form-control"
                  placeholder="e.g. Built for modern executive fleets and daily commutes"
                  value={form.tagline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="form-control"
                  placeholder="Detailed product story, craftsmanship, ergonomics, and enterprise applications..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Technical Specifications & OEM Ordering</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="text"
                    name="capacity"
                    className="form-control"
                    placeholder="e.g. 26 Liters"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Device Compartment</label>
                  <input
                    type="text"
                    name="laptop_fit"
                    className="form-control"
                    placeholder="e.g. Up to 16-inch MacBook Pro"
                    value={form.laptop_fit}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    name="min_order"
                    className="form-control"
                    value={form.min_order}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lead Time</label>
                  <input
                    type="text"
                    name="lead_time"
                    className="form-control"
                    placeholder="e.g. 2-3 Weeks"
                    value={form.lead_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Logo Placement</label>
                <input
                  type="text"
                  name="logo_position"
                  className="form-control"
                  placeholder="e.g. Front Center (Debossed or Metal Emblem)"
                  value={form.logo_position}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Customization Options (Tags) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Customization Specs & Swatches</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Materials */}
              <div className="form-group">
                <label className="form-label">Available Fabrics & Materials</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {(form.materials || []).map((m, idx) => (
                    <span key={idx} className="tag">
                      {getTagLabel(m)}
                      <button type="button" onClick={() => handleRemoveTag('materials', idx)} style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1000D Cordura Nylon"
                    value={materialInput}
                    onChange={e => setMaterialInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('materials', materialInput, setMaterialInput); } }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag('materials', materialInput, setMaterialInput)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Color Options */}
              <div className="form-group">
                <label className="form-label">Color Swatches / Trims</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {(form.color_options || []).map((c, idx) => {
                    const hex = getTagHex(c);
                    return (
                      <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {hex && (
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: hex, display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)' }} />
                        )}
                        {getTagLabel(c)}
                        <button type="button" onClick={() => handleRemoveTag('color_options', idx)} style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Olive Drab, Tactical Black"
                    value={colorInput}
                    onChange={e => setColorInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('color_options', colorInput, setColorInput); } }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag('color_options', colorInput, setColorInput)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Branding Options */}
              <div className="form-group">
                <label className="form-label">Branding Methods Supported</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {(form.branding_options || []).map((b, idx) => (
                    <span key={idx} className="tag">
                      {getTagLabel(b)}
                      <button type="button" onClick={() => handleRemoveTag('branding_options', idx)} style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Laser Engraved Metal Plaque"
                    value={brandingInput}
                    onChange={e => setBrandingInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('branding_options', brandingInput, setBrandingInput); } }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag('branding_options', brandingInput, setBrandingInput)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="form-group">
                <label className="form-label">Key Features</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {(form.features || []).map((f, idx) => (
                    <span key={idx} className="tag">
                      {getTagLabel(f)}
                      <button type="button" onClick={() => handleRemoveTag('features', idx)} style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. YKK Water-Resistant Zippers"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('features', featureInput, setFeatureInput); } }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddTag('features', featureInput, setFeatureInput)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Media & Image Manager - DIRECT DEVICE UPLOAD ONLY */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="card-title">Media & Product Images</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                  Direct device upload only (PNG, JPG, WEBP). Select multiple images at once.
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
              >
                <Upload size={14} /> {uploadingGallery ? 'Uploading...' : 'Upload From Device'}
              </button>
            </div>
            <div className="card-body">
              {/* Device File Input (Hidden) */}
              <input
                type="file"
                ref={galleryInputRef}
                multiple
                accept="image/*"
                onChange={e => handleDeviceGalleryUpload(e.target.files)}
                style={{ display: 'none' }}
              />

              {/* Dropzone Area */}
              <div
                className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer?.files) handleDeviceGalleryUpload(e.dataTransfer.files);
                }}
                onClick={() => galleryInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--accent)' : '2px dashed var(--border)',
                  background: isDragging ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  borderRadius: 8,
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: 16,
                  transition: 'all 0.2s ease',
                }}
              >
                <Upload size={28} style={{ color: 'var(--accent)', margin: '0 auto 8px', opacity: 0.9 }} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {uploadingGallery
                    ? `Uploading ${uploadProgress.current} of ${uploadProgress.total} images...`
                    : 'Tap or click to browse images directly from your device'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Select from phone camera, photo library, or drag & drop files here
                </div>
              </div>

              {images.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  <Image size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                  <p style={{ fontSize: 13 }}>No gallery images attached yet. Tap "Upload From Device" above.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                  {images.map((img, idx) => {
                    const imgPath = typeof img === 'string' ? img : img.path;
                    const isPrimary = form.primary_image === imgPath || (idx === 0 && !form.primary_image);
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          border: isPrimary ? '2px solid var(--accent)' : '1px solid var(--border)',
                          borderRadius: 8,
                          overflow: 'hidden',
                          background: 'var(--bg-secondary)',
                          padding: 4
                        }}
                      >
                        <img
                          src={imgPath}
                          alt="Product"
                          style={{ width: '100%', height: 110, objectFit: 'contain', display: 'block', borderRadius: 6, background: '#000' }}
                          onError={(e) => { e.target.style.opacity = '0.3'; }}
                        />

                        {isPrimary && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              background: 'var(--accent)',
                              color: '#000',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                            }}
                          >
                            <Star size={10} fill="#000" /> PRIMARY
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, padding: '2px 4px' }}>
                          {!isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(imgPath)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              Set Primary
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Main Display</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img, idx)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Controls (Right Column) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {/* Status & Visibility Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Publishing & Status</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Active on Website</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visible in customer catalog</div>
                </div>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Featured Product</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showcase on Homepage hero grid</div>
                </div>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Customizable</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Enable OEM branding badge</div>
                </div>
                <input
                  type="checkbox"
                  name="is_customizable"
                  checked={form.is_customizable}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
              </label>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  className="form-control"
                  value={form.sort_order}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Quick Primary Image Preview - DIRECT DEVICE UPLOAD ONLY */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Primary Display Image</span>
            </div>
            <div className="card-body">
              <div
                style={{
                  height: 190,
                  background: 'var(--bg-secondary)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                {form.primary_image ? (
                  <img
                    src={form.primary_image}
                    alt="Primary preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.opacity = '0.3'; }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: 16 }}>
                    <Image size={32} style={{ opacity: 0.4, margin: '0 auto 6px' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block' }}>No primary image selected</span>
                  </div>
                )}
              </div>

              {/* Direct Device Upload Controls - NO URL INPUT */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="file"
                  ref={primaryInputRef}
                  accept="image/*"
                  onChange={handlePrimaryUpload}
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => primaryInputRef.current?.click()}
                  disabled={uploadingPrimary}
                  style={{ justifyContent: 'center' }}
                >
                  <Upload size={14} /> {uploadingPrimary ? 'Uploading...' : 'Upload Primary From Device'}
                </button>

                {form.primary_image && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setForm(f => ({ ...f, primary_image: '' }))}
                    style={{ justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                  >
                    <Trash2 size={13} /> Remove Primary Image
                  </button>
                )}

                <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                  Direct device upload only. You can also tap "Set Primary" on any gallery image on the left.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile & Desktop */}
      <div className="product-edit-sticky-bar">
        <Link to="/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : (isNew ? 'Create Product' : 'Save Product')}
        </button>
      </div>
    </form>
  );
}
