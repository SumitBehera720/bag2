import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import {
  Layout, Edit3, Eye, EyeOff, Save, RefreshCw, X,
  CheckCircle, ChevronRight, ChevronDown, Film, Type,
  Upload, Trash2
} from 'lucide-react';

// Default chapter data (mirrors HeroExperience.jsx)
const DEFAULT_CHAPTERS = [
  {
    id: 1, num: '01',
    phase: 'RAW WEAVE CUTTING',
    headline: 'BUILT AROUND\nYOUR IDEA.',
    title: 'Precision Pattern Geometry & Ballistic Weaves',
    description: 'Every bespoke fleet commission starts with hand-calibrated pattern cutting. Industrial 1000D ballistic weaves are sliced to 0.2mm tolerance for unmatched structural integrity.',
    badge: 'STAGE 01 // CORDURA® 1000D / 45° BIAS'
  },
  {
    id: 2, num: '02',
    phase: 'HARDWARE INTEGRATION',
    headline: 'HEAVY HARDWARE.\nZERO COMPROMISE.',
    title: 'Reinforced Zips & Stress Anchoring',
    description: 'Main luggage gussets fitted with high-gauge matte industrial zipper tracks, bar-tacked with 42-stitch stress reinforcement to withstand 15,000 continuous opening cycles.',
    badge: 'STAGE 02 // INDUSTRIAL NO. 8 SBS HARDWARE'
  },
  {
    id: 3, num: '03',
    phase: 'BRAND EMBLEM ALIGNMENT',
    headline: 'YOUR EMBLEM.\nFLAWLESSLY CRAFTED.',
    title: 'Bespoke Corporate Insignia Debossing',
    description: 'Watch the atelier production floor personalize each unit with corporate identity. Debossed badges, dual logo placements, and pantone-matched embroidery created for modern enterprise teams.',
    badge: 'STAGE 03 // PMS COLOR EMBLEM & DEBOSS'
  },
  {
    id: 4, num: '04',
    phase: 'ATELIER PRESENTATION',
    headline: 'EXECUTIVE TIER\nGIFT PRESENTATION.',
    title: 'Custom VIP Onboarding Kitting',
    description: 'Bespoke bags nestled inside rigid presentation packaging, paired with matching debossed leather executive journals and weighted aluminum writing instruments for immediate gifting.',
    badge: 'STAGE 04 // 680G RIGID GIFT PRESENTATION'
  },
  {
    id: 5, num: '05',
    phase: 'ENTERPRISE PALLETIZATION',
    headline: 'FLEET SCALE.\nGLOBAL DISPATCH.',
    title: 'Volume Deployment & QC Verification',
    description: 'Mass scale completed fleet units stacked and sealed for international corporate deployment. Full inventory tracking, batch QC audit certificates, and direct desk delivery.',
    badge: 'STAGE 05 // MOQ 50 UNITS • GLOBAL FREIGHT'
  }
];

export default function Sections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(0);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_text: '',
    cta_url: '',
    bg_image: '',
    is_visible: true,
  });

  const [uploadingBg, setUploadingBg] = useState(false);
  const bgFileInputRef = useRef(null);

  const handleDeviceBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setUploadingBg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'sections');
      const res = await api.postForm('/admin/media', fd);
      const url = res.url || ('/storage/' + res.path);
      setForm(prev => ({ ...prev, bg_image: url }));
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingBg(false);
      if (bgFileInputRef.current) bgFileInputRef.current.value = '';
    }
  };

  const [heroChapters, setHeroChapters] = useState(DEFAULT_CHAPTERS);

  const loadSections = async () => {
    try {
      const data = await api.get('/admin/sections?page=homepage');
      setSections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleToggle = async (sectionKey) => {
    try {
      const res = await api.post(`/admin/sections/${sectionKey}/toggle-visibility`, {});
      setSections(prev =>
        prev.map(s => (s.section_key === sectionKey ? { ...s, is_visible: res.is_visible } : s))
      );
    } catch (err) {
      alert('Failed to toggle visibility: ' + err.message);
    }
  };

  const openEditor = (sec) => {
    setEditingSection(sec);
    setForm({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      description: sec.description || '',
      cta_text: sec.cta_text || '',
      cta_url: sec.cta_url || '',
      bg_image: sec.bg_image || '',
      is_visible: Boolean(sec.is_visible),
    });

    if (sec.section_key === 'hero') {
      // Load existing chapters from DB content or use defaults
      const existingChapters =
        sec.content && Array.isArray(sec.content.chapters) && sec.content.chapters.length === 5
          ? sec.content.chapters.map((ch, i) => ({
              id: i + 1,
              num: String(i + 1).padStart(2, '0'),
              phase: ch.phase || DEFAULT_CHAPTERS[i].phase,
              headline: ch.headline || DEFAULT_CHAPTERS[i].headline,
              title: ch.title || DEFAULT_CHAPTERS[i].title,
              description: ch.description || DEFAULT_CHAPTERS[i].description,
              badge: ch.badge || DEFAULT_CHAPTERS[i].badge,
            }))
          : DEFAULT_CHAPTERS.map(c => ({ ...c }));
      setHeroChapters(existingChapters);
      setExpandedChapter(0);
    }
  };

  const updateHeroChapter = (index, field, value) => {
    setHeroChapters(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (editingSection.section_key === 'hero') {
        payload.content = { chapters: heroChapters };
      }
      await api.post(`/admin/sections/${editingSection.section_key}`, payload);
      setEditingSection(null);
      loadSections();
    } catch (err) {
      alert('Failed to update section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const SECTION_LABELS = {
    hero: { icon: '🎬', label: 'Hero Scroll Story', color: '#6366f1' },
    bags: { icon: '🎒', label: 'Product Catalog', color: '#f59e0b' },
    customization: { icon: '🎨', label: 'Customization', color: '#10b981' },
    industries: { icon: '🏭', label: 'Industries', color: '#3b82f6' },
    process: { icon: '⚙️', label: 'Process Timeline', color: '#8b5cf6' },
    portfolio: { icon: '🖼️', label: 'Portfolio', color: '#ec4899' },
    comfort: { icon: '✨', label: 'Comfort & Style Banner', color: '#06b6d4' },
    testimonials: { icon: '💬', label: 'Testimonials', color: '#f97316' },
    scale: { icon: '📊', label: 'Scale Stats', color: '#84cc16' },
    tiers: { icon: '💰', label: 'Volume Pricing Tiers', color: '#eab308' },
    instagram: { icon: '📸', label: 'Instagram Gallery', color: '#e1306c' },
    cta: { icon: '🚀', label: 'Call to Action', color: '#ef4444' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>CMS Website Sections</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Manage homepage copy, hero scroll chapters, OEM process, and feature blocks
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setRefreshing(true); loadSections(); }}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
          </button>
          <a href="https://askmebag.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            Live Preview ↗
          </a>
        </div>
      </div>

      {/* Sections Grid / List */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : sections.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No homepage sections found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Section</th>
                  <th>Heading / Title</th>
                  <th>Subtitle</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, idx) => {
                  const meta = SECTION_LABELS[sec.section_key] || {};
                  return (
                    <tr key={sec.id || idx}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{meta.icon || '📄'}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{meta.label || sec.section_key}</div>
                            <span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4, color: meta.color || 'var(--accent)' }}>
                              {sec.section_key}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: 14 }}>
                        {sec.title || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No title</span>}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sec.subtitle || sec.description || '—'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggle(sec.section_key)}
                          className={`badge ${sec.is_visible ? 'badge-success' : 'badge-danger'}`}
                          style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Click to toggle visibility on website"
                        >
                          {sec.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                          {sec.is_visible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => openEditor(sec)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          {sec.section_key === 'hero' ? (
                            <><Film size={14} /> Edit 5 Scroll Stages</>
                          ) : (
                            <><Edit3 size={14} /> Edit Content</>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== EDITOR MODAL ===== */}
      {editingSection && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: editingSection.section_key === 'hero' ? 780 : 640,
            maxHeight: '92vh', overflowY: 'auto'
          }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 2, borderBottom: '1px solid var(--border)' }}>
              <div>
                <span className="card-title">
                  {editingSection.section_key === 'hero' ? '🎬 Edit Hero Scroll Story (5 Stages)' : `Edit Section: ${editingSection.section_key}`}
                </span>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {editingSection.section_key === 'hero'
                    ? 'Edit each stage text that appears as the user scrolls the atelier video'
                    : `Page: ${editingSection.page}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* ===== HERO CHAPTERS EDITOR ===== */}
                {editingSection.section_key === 'hero' && (
                  <div>
                    {/* Info banner */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}>
                      <Film size={18} style={{ color: '#6366f1', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#a5b4fc', marginBottom: 2 }}>Hero Scroll Story</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          As visitors scroll the atelier production video, 5 stages are revealed one by one.
                          Edit the text for each stage below. Changes are live on the website after saving.
                        </div>
                      </div>
                    </div>

                    {/* 5 Chapter Accordion */}
                    {heroChapters.map((ch, i) => (
                      <div key={ch.id} style={{
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        marginBottom: 10,
                        overflow: 'hidden',
                        background: expandedChapter === i ? 'var(--bg-secondary)' : 'transparent',
                        transition: 'all 0.2s',
                      }}>
                        {/* Accordion Header */}
                        <button
                          type="button"
                          onClick={() => setExpandedChapter(expandedChapter === i ? -1 : i)}
                          style={{
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                          }}>
                            {ch.num}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{ch.phase}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{ch.badge}</div>
                          </div>
                          <ChevronDown
                            size={16}
                            style={{
                              color: 'var(--text-muted)',
                              transform: expandedChapter === i ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>

                        {/* Accordion Body */}
                        {expandedChapter === i && (
                          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366f1' }}>
                                  Phase Label
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ch.phase}
                                  onChange={e => updateHeroChapter(i, 'phase', e.target.value)}
                                  placeholder="e.g. RAW WEAVE CUTTING"
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366f1' }}>
                                  Stage Badge
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ch.badge}
                                  onChange={e => updateHeroChapter(i, 'badge', e.target.value)}
                                  placeholder="e.g. STAGE 01 // CORDURA® 1000D"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366f1' }}>
                                Main Headline <span style={{ color: 'var(--text-muted)', textTransform: 'none' }}>(use \n for line break)</span>
                              </label>
                              <textarea
                                rows={2}
                                className="form-control"
                                value={ch.headline}
                                onChange={e => updateHeroChapter(i, 'headline', e.target.value)}
                                placeholder="e.g. BUILT AROUND\nYOUR IDEA."
                                style={{ fontFamily: 'monospace', fontSize: 13 }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366f1' }}>
                                Sub-headline / Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={ch.title}
                                onChange={e => updateHeroChapter(i, 'title', e.target.value)}
                                placeholder="e.g. Precision Pattern Geometry & Ballistic Weaves"
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366f1' }}>
                                Narrative Description
                              </label>
                              <textarea
                                rows={3}
                                className="form-control"
                                value={ch.description}
                                onChange={e => updateHeroChapter(i, 'description', e.target.value)}
                                placeholder="Detailed paragraph copy shown during this scroll stage"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                      Standard section fields (hero section title / subtitle for CMS reference only):
                    </p>
                  </div>
                )}

                {/* ===== STANDARD FIELDS ===== */}
                <div className="form-group">
                  <label className="form-label">Heading / Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Section headline"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle / Eyebrow Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Small tagline above or below headline"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Body Content</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed paragraph copy"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">CTA Button Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.cta_text}
                      onChange={e => setForm({ ...form, cta_text: e.target.value })}
                      placeholder="e.g. GET A BULK QUOTE"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Button Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.cta_url}
                      onChange={e => setForm({ ...form, cta_url: e.target.value })}
                      placeholder="e.g. #contact or /catalog"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Background / Cover Image (Direct from Device)</label>
                  <input
                    type="file"
                    ref={bgFileInputRef}
                    accept="image/*"
                    onChange={handleDeviceBgUpload}
                    style={{ display: 'none' }}
                  />

                  {form.bg_image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <img
                        src={form.bg_image}
                        alt="Section Cover"
                        style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, background: '#000' }}
                        onError={(e) => { e.target.style.opacity = '0.3'; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>Cover Image Attached</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {form.bg_image}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => bgFileInputRef.current?.click()}
                          disabled={uploadingBg}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setForm(f => ({ ...f, bg_image: '' }))}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => bgFileInputRef.current?.click()}
                      disabled={uploadingBg}
                      style={{ width: '100%', justifyContent: 'center', padding: '10px 14px' }}
                    >
                      <Upload size={14} /> {uploadingBg ? 'Uploading Image...' : 'Upload Image From Device'}
                    </button>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={form.is_visible}
                      onChange={e => setForm({ ...form, is_visible: e.target.checked })}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                    />
                    Display this section on website
                  </label>
                </div>
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: 'var(--bg-card)' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingSection(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving...' : (editingSection.section_key === 'hero' ? 'Save All 5 Stages' : 'Save Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
