import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Settings as SettingsIcon, Save, RefreshCw, Phone, MessageCircle,
  Building, Globe, Shield, CheckCircle
} from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  const [form, setForm] = useState({
    business_name: 'ASKMEBAG',
    phone: '+91 90044 08854',
    secondary_phone: '+91 87576 01990',
    whatsapp_number: '919004408854',
    whatsapp_display: '+91 90044 08854',
    secondary_whatsapp: '918757601990',
    email: 'askmebag@gmail.com',
    address: 'Parasnath Complex, Bldg B-13, Gala No 108, First Floor, Dapode Road, Bhiwandi, Mumbai - 421302, Maharashtra, India',
    gst_no: '27AEOPI4410A1ZZ',
    min_order_qty: '50',
    lead_time: '7-10 Days',
    social_instagram: '',
    social_facebook: '',
    social_linkedin: '',
    seo_title: 'ASKMEBAG — Custom Bulk Bags & Corporate Gifting',
    seo_description: 'ASKMEBAG manufactures premium customized bulk bags for corporates, events, and institutions. Custom branding, embroidery, MOQ 50 units.',
    hero_eyebrow: 'DIRECT OEM BAG MANUFACTURER',
    hero_heading: 'Custom Bags. Built Around Your Idea.',
    hero_description: 'From boardroom briefcases to field-ready duffels — fully custom, MOQ 50 units, factory-direct pricing.',
    hero_cta_primary: 'GET A BULK QUOTE',
    hero_cta_secondary: 'VIEW CATALOG',
  });

  const loadSettings = async () => {
    try {
      const data = await api.get('/admin/settings');
      const loaded = {};
      Object.keys(data).forEach(k => {
        loaded[k] = data[k].value;
      });
      setForm(prev => ({ ...prev, ...loaded }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await api.post('/admin/settings', form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <form onSubmit={handleSave} style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Global Business Settings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Manage contact details, WhatsApp integration, default MOQ, and SEO
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {savedSuccess && (
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
              <CheckCircle size={16} /> Changes Saved!
            </span>
          )}
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {[
          { id: 'contact', label: 'Contact & Business', icon: Building },
          { id: 'whatsapp', label: 'WhatsApp & Communication', icon: MessageCircle },
          { id: 'ordering', label: 'MOQ & Lead Times', icon: SettingsIcon },
          { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 450,
                fontSize: 13,
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'all 0.15s'
              }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Contact & Business */}
      {activeTab === 'contact' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Company Profile & Contact Information</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label required">Business / Brand Name</label>
                <input
                  type="text"
                  name="business_name"
                  className="form-control"
                  value={form.business_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Tax ID</label>
                <input
                  type="text"
                  name="gst_no"
                  className="form-control"
                  value={form.gst_no}
                  onChange={handleChange}
                  placeholder="27AEOPI4410A1ZZ"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label required">Official Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Primary Calling Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Secondary / Direct Phone</label>
                <input
                  type="text"
                  name="secondary_phone"
                  className="form-control"
                  value={form.secondary_phone}
                  onChange={handleChange}
                  placeholder="+91 87576 01990"
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Additional direct calling hotline</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Factory / Office Address</label>
              <textarea
                name="address"
                rows={3}
                className="form-control"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: WhatsApp & Communication */}
      {activeTab === 'whatsapp' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">WhatsApp Quick Connect & Floating Button</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label required">WhatsApp Number (with Country Code, no symbols)</label>
                <input
                  type="text"
                  name="whatsapp_number"
                  className="form-control"
                  placeholder="919004408854"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  required
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Format: 919004408854</span>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Display Number</label>
                <input
                  type="text"
                  name="whatsapp_display"
                  className="form-control"
                  placeholder="+91 90044 08854"
                  value={form.whatsapp_display}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Secondary WhatsApp / Calling (no symbols)</label>
                <input
                  type="text"
                  name="secondary_whatsapp"
                  className="form-control"
                  placeholder="918757601990"
                  value={form.secondary_whatsapp}
                  onChange={handleChange}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Format: 918757601990</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ordering Defaults */}
      {activeTab === 'ordering' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Standard Ordering & Factory Parameters</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label required">Default Minimum Order Qty (MOQ)</label>
                <input
                  type="number"
                  name="min_order_qty"
                  className="form-control"
                  value={form.min_order_qty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Default Production Lead Time</label>
                <input
                  type="text"
                  name="lead_time"
                  className="form-control"
                  placeholder="2-3 Weeks"
                  value={form.lead_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SEO & Social */}
      {activeTab === 'seo' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Search Engine Optimization (SEO) & Social Profiles</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">SEO Meta Title</label>
              <input
                type="text"
                name="seo_title"
                className="form-control"
                value={form.seo_title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SEO Meta Description</label>
              <textarea
                name="seo_description"
                rows={3}
                className="form-control"
                value={form.seo_description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 8 }}>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="text"
                  name="social_instagram"
                  className="form-control"
                  placeholder="https://instagram.com/askmebag"
                  value={form.social_instagram}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="text"
                  name="social_linkedin"
                  className="form-control"
                  placeholder="https://linkedin.com/company/askmebag"
                  value={form.social_linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input
                  type="text"
                  name="social_facebook"
                  className="form-control"
                  placeholder="https://facebook.com/askmebag"
                  value={form.social_facebook}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
