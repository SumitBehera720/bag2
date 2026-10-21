import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import {
  Package, Plus, Search, Filter, Edit, Trash2, CheckCircle,
  XCircle, Star, Image, RefreshCw
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      let path = '/admin/products?per_page=100&';
      if (categoryFilter) path += `category=${encodeURIComponent(categoryFilter)}&`;
      if (search) path += `search=${encodeURIComponent(search)}&`;

      const [prodsData, catsData] = await Promise.all([
        api.get(path),
        api.get('/admin/categories')
      ]);

      setProducts(prodsData.data || prodsData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.post(`/admin/products/${id}/toggle-status`, {});
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, is_active: res.is_active } : p))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Products Catalog</h2>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                padding: '3px 10px',
                borderRadius: 20
              }}
            >
              {products.length} Products Available
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Manage customizable bag models, specifications, colors, and branding options
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
          <Link to="/products/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 260px', display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36, height: 38 }}
                placeholder="Search products by name, SKU, tag..."
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
              style={{ height: 38, width: 180 }}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <Package size={42} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p style={{ fontSize: 16, fontWeight: 500 }}>No products found</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Add your first product or clear filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Capacity / Fit</th>
                  <th>MOQ</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 6,
                          background: 'var(--bg-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {p.primary_image ? (
                          <img
                            src={p.primary_image}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <Image size={18} color="var(--text-muted)" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      {p.sku && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SKU: {p.sku}</div>}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: 4, color: 'var(--text-secondary)' }}>
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {p.capacity ? `${p.capacity}L` : ''} {p.laptop_fit ? `• Fits ${p.laptop_fit}"` : ''}
                      {!p.capacity && !p.laptop_fit && '—'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.min_order || 50} pcs</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle visibility"
                      >
                        {p.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      {p.is_featured ? (
                        <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                          <Star size={14} fill="#f59e0b" /> Featured
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link
                          to={`/products/${p.id}/edit`}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit product"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Delete product"
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
    </div>
  );
}
