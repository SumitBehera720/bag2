import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import {
  Save, RefreshCw, Plus, Trash2, Eye, EyeOff, Upload,
  ExternalLink, ArrowUp, ArrowDown, Heart, MessageCircle,
  CheckCircle, AlertCircle, Image as ImageIcon
} from 'lucide-react';

const InstagramIcon = ({ size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DEFAULT_POSTS = [
  {
    id: 1,
    img: '/media/process_cut.jpg',
    tag: 'STAGE 01 // TEXTILE CUT',
    likes: '2.4k',
    comments: '84',
    caption: 'Hand-calibrating 1000D ballistic weaves for corporate fleet run #AMB240. Precision cut to 0.2mm tolerance.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 2,
    img: '/media/process_stitch.jpg',
    tag: 'STAGE 02 // BAR-TACK',
    likes: '1.9k',
    comments: '42',
    caption: 'Heavy-gauge bonded nylon stitching with 42-stitch stress reinforcement on dual commuter harness points.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 3,
    img: '/media/process_banner_cover.jpg',
    tag: 'STAGE 03 // HARDWARE',
    likes: '3.1k',
    comments: '112',
    caption: 'Industrial matte black SBS zipper tracks & 3D laser-engraved metal insignia plaques fitted for enterprise clients.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 4,
    img: '/media/custom_page_cover.jpg',
    tag: 'STAGE 04 // CAD BLUEPRINT',
    likes: '2.8k',
    comments: '96',
    caption: 'Bespoke pattern geometry and physical pre-production material swatch proofing completed in 5 days.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 5,
    img: '/media/scale_banner_cover.jpg',
    tag: 'STAGE 05 // FLEET DISPATCH',
    likes: '4.5k',
    comments: '167',
    caption: 'Mass scale completed fleet units stacked and sealed for international corporate deployment. Zero defect QC.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 6,
    img: '/media/final_cta_banner.jpg',
    tag: 'STAGE 06 // VIP ONBOARDING',
    likes: '3.7k',
    comments: '128',
    caption: 'Executive tier rigid gift presentation boxes paired with weighted pens & matching debossed journals.',
    url: 'https://instagram.com/askmebag'
  }
];

export default function InstagramSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);

  // Form State
  const [handle, setHandle] = useState('@askmebag');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/askmebag');
  const [title, setTitle] = useState('Inside the Production Fleet.');
  const [subtitle, setSubtitle] = useState('ATELIER SOCIAL // @ASKMEBAG');
  const [description, setDescription] = useState('Follow our daily production runs, material tests, and bespoke fleet deliveries.');
  const [ctaText, setCtaText] = useState('FOLLOW @ASKMEBAG');
  const [isVisible, setIsVisible] = useState(true);
  const [posts, setPosts] = useState(DEFAULT_POSTS);

  const fileInputRefs = useRef({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/sections/instagram').catch(() => null);
      if (data) {
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.description) setDescription(data.description);
        if (data.cta_text) setCtaText(data.cta_text);
        if (data.cta_url) setInstagramUrl(data.cta_url);
        if (typeof data.is_visible === 'boolean') setIsVisible(data.is_visible);

        let parsed = data.content;
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch {}
        }
        if (parsed) {
          if (parsed.handle) setHandle(parsed.handle);
          if (parsed.url) setInstagramUrl(parsed.url);
          if (Array.isArray(parsed.posts) && parsed.posts.length > 0) {
            setPosts(parsed.posts);
          } else if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      page: 'homepage',
      section_key: 'instagram',
      section_type: 'gallery',
      title,
      subtitle: subtitle || `ATELIER SOCIAL // ${handle}`,
      description,
      cta_text: ctaText || `FOLLOW ${handle}`,
      cta_url: instagramUrl,
      is_visible: isVisible,
      content: {
        handle,
        url: instagramUrl,
        posts
      }
    };

    try {
      await api.post('/admin/sections/instagram', payload);
      setMessage({ type: 'success', text: 'Instagram section saved successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save section' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIdx(index);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'instagram');
      const res = await api.postForm('/admin/media', fd);
      const uploadedPath = res.url || res.path;
      if (uploadedPath) {
        updatePost(index, 'img', uploadedPath);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const updatePost = (index, field, value) => {
    const updated = [...posts];
    updated[index] = { ...updated[index], [field]: value };
    setPosts(updated);
  };

  const addPost = () => {
    const newId = posts.length > 0 ? Math.max(...posts.map(p => Number(p.id) || 0)) + 1 : 1;
    setPosts([
      ...posts,
      {
        id: newId,
        img: '/media/process_cut.jpg',
        tag: `STAGE 0${posts.length + 1} // PRODUCTION`,
        likes: '1.2k',
        comments: '34',
        caption: 'Bespoke corporate carry engineered to specification.',
        url: instagramUrl
      }
    ]);
  };

  const removePost = (index) => {
    if (posts.length <= 1) {
      alert('You must keep at least 1 post in the gallery.');
      return;
    }
    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
  };

  const movePost = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= posts.length) return;
    const updated = [...posts];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setPosts(updated);
  };

  const resetDefaults = () => {
    if (confirm('Reset Instagram section to factory defaults?')) {
      setHandle('@askmebag');
      setInstagramUrl('https://instagram.com/askmebag');
      setTitle('Inside the Production Fleet.');
      setSubtitle('ATELIER SOCIAL // @ASKMEBAG');
      setDescription('Follow our daily production runs, material tests, and bespoke fleet deliveries.');
      setCtaText('FOLLOW @ASKMEBAG');
      setIsVisible(true);
      setPosts(DEFAULT_POSTS);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw className="animate-spin" size={28} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'inline-flex', padding: 8, background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', borderRadius: 10, color: '#fff' }}>
              <InstagramIcon size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Instagram Section Manager</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '3px 0 0' }}>
                Manage your Instagram handle, headline, links, and live gallery cards.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetDefaults}
            style={{ fontSize: 13 }}
          >
            Reset Defaults
          </button>

          <a
            href="https://askmebag.com/#instagram"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: 13 }}
          >
            <ExternalLink size={14} /> View Live
          </a>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ minWidth: 120, justifyContent: 'center' }}
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={14} className="animate-spin" /> Saving...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save size={15} /> Save Changes
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {message && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 20,
          background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: message.type === 'success' ? 'var(--success, #22c55e)' : 'var(--danger, #ef4444)',
          fontSize: 14
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Handle & General Settings */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>1. Instagram Handle & Section Info</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Show on Homepage
            </label>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label required">Instagram Handle</label>
              <input
                type="text"
                className="form-control"
                value={handle}
                onChange={(e) => {
                  const val = e.target.value;
                  setHandle(val);
                  setSubtitle(`ATELIER SOCIAL // ${val}`);
                  setCtaText(`FOLLOW ${val}`);
                  if (val.startsWith('@')) {
                    setInstagramUrl(`https://instagram.com/${val.replace('@', '')}`);
                  }
                }}
                placeholder="@askmebag"
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Your public Instagram username (e.g. @askmebag)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label required">Instagram Profile URL</label>
              <input
                type="url"
                className="form-control"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/askmebag"
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Full URL opened when visitors click the follow button
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Section Heading</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Inside the Production Fleet."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Eyebrow / Subtitle Badge</label>
              <input
                type="text"
                className="form-control"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="ATELIER SOCIAL // @ASKMEBAG"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Button Label</label>
              <input
                type="text"
                className="form-control"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="FOLLOW @ASKMEBAG"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Section Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Follow our daily production runs, material tests, and bespoke fleet deliveries."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Gallery Cards Manager */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>2. Gallery Cards & Images ({posts.length} Posts)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '2px 0 0' }}>
              Upload authentic atelier photos, set hashtags/stages, likes, comments, and links.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addPost}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add Post Card
          </button>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {posts.map((post, index) => (
              <div
                key={post.id || index}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  background: 'var(--bg-secondary, rgba(255,255,255,0.02))',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative'
                }}
              >
                {/* Top Row: Index & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' }}>
                    POST #{index + 1}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 6px', height: 'auto' }}
                      disabled={index === 0}
                      onClick={() => movePost(index, -1)}
                      title="Move Left/Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 6px', height: 'auto' }}
                      disabled={index === posts.length - 1}
                      onClick={() => movePost(index, 1)}
                      title="Move Right/Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 6px', height: 'auto', color: 'var(--danger)' }}
                      onClick={() => removePost(index)}
                      title="Delete Post"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Image Preview & Upload */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      background: '#000',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    <img
                      src={post.img?.startsWith('http') || post.img?.startsWith('/') ? post.img : `https://askmebag.com/storage/${post.img}`}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/media/process_cut.jpg';
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', marginBottom: 6, fontSize: 12 }}
                      disabled={uploadingIdx === index}
                      onClick={() => fileInputRefs.current[index]?.click()}
                    >
                      {uploadingIdx === index ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RefreshCw size={12} className="animate-spin" /> Uploading...
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Upload size={12} /> Upload Image
                        </span>
                      )}
                    </button>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={post.img || ''}
                      onChange={(e) => updatePost(index, 'img', e.target.value)}
                      placeholder="/media/image.jpg"
                      style={{ fontSize: 11 }}
                    />
                  </div>
                </div>

                {/* Tag & Link */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>Stage Badge</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={post.tag || ''}
                      onChange={(e) => updatePost(index, 'tag', e.target.value)}
                      placeholder="STAGE 01 // TEXTILE CUT"
                      style={{ fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>Post URL</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={post.url || ''}
                      onChange={(e) => updatePost(index, 'url', e.target.value)}
                      placeholder="https://instagram.com/..."
                      style={{ fontSize: 11 }}
                    />
                  </div>
                </div>

                {/* Metrics: Likes & Comments */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>Likes Count</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={post.likes || ''}
                      onChange={(e) => updatePost(index, 'likes', e.target.value)}
                      placeholder="2.4k"
                      style={{ fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>Comments Count</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={post.comments || ''}
                      onChange={(e) => updatePost(index, 'comments', e.target.value)}
                      placeholder="84"
                      style={{ fontSize: 11 }}
                    />
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, display: 'block' }}>Caption</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    value={post.caption || ''}
                    onChange={(e) => updatePost(index, 'caption', e.target.value)}
                    placeholder="Describe this production run or material test..."
                    style={{ fontSize: 11 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div style={{
        position: 'sticky',
        bottom: 20,
        background: 'var(--bg-secondary, #1e293b)',
        padding: '12px 20px',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid var(--border)',
        zIndex: 100
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Changes will reflect immediately on <strong>askmebag.com</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ minWidth: 140, justifyContent: 'center' }}
        >
          {saving ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={14} className="animate-spin" /> Saving...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={15} /> Save Changes
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
