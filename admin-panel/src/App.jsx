import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import './admin.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inquiries from './pages/Inquiries';
import InquiryDetail from './pages/InquiryDetail';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import Categories from './pages/Categories';
import Sections from './pages/Sections';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';
import MediaLibrary from './pages/MediaLibrary';
import ActivityLogs from './pages/ActivityLogs';

// Icons
import {
  ShoppingBag, LayoutDashboard, Inbox, Package, Layers,
  Layout, MessageSquare, Image, Settings as SettingsIcon,
  Activity, LogOut, ExternalLink, Plus, User, Menu, X
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link to={to} className={`sidebar-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div
          className="sidebar-backdrop open"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            background: 'var(--accent)',
            borderRadius: 8,
            color: '#000'
          }}>
            <ShoppingBag size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="sidebar-logo-text">ASKMEBAG</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>B2B CMS & CRM</div>
          </div>
          <span className="sidebar-logo-badge" style={{ marginLeft: 'auto' }}>PRO</span>

          {/* Close button inside sidebar on mobile */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={closeMobileNav}
            aria-label="Close Navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-group">
            <div className="sidebar-group-label">OVERVIEW</div>
            <NavItem to="/" icon={LayoutDashboard} onClick={closeMobileNav}>Dashboard</NavItem>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">CRM & ORDERS</div>
            <NavItem to="/inquiries" icon={Inbox} onClick={closeMobileNav}>Inquiries (CRM)</NavItem>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">CATALOG</div>
            <NavItem to="/products" icon={Package} onClick={closeMobileNav}>Products Catalog</NavItem>
            <NavItem to="/categories" icon={Layers} onClick={closeMobileNav}>Categories</NavItem>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">WEBSITE CMS</div>
            <NavItem to="/sections" icon={Layout} onClick={closeMobileNav}>Page Sections</NavItem>
            <NavItem to="/testimonials" icon={MessageSquare} onClick={closeMobileNav}>Reviews / Proof</NavItem>
            <NavItem to="/media" icon={Image} onClick={closeMobileNav}>Media Assets</NavItem>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">CONFIGURATION</div>
            <NavItem to="/settings" icon={SettingsIcon} onClick={closeMobileNav}>Site Settings</NavItem>
            <NavItem to="/activity-logs" icon={Activity} onClick={closeMobileNav}>Audit Logs</NavItem>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: 13
            }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>

            <div className="admin-header-store-label">
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Store:</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>ASKMEBAG Official Production</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/products/new" className="btn btn-primary btn-sm">
              <Plus size={15} /> <span className="header-btn-text">New Product</span>
            </Link>
            <a
              href="https://askmebag.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm header-live-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ExternalLink size={14} /> <span className="header-btn-text">Live Site</span>
            </a>
          </div>
        </header>

        {/* Content Page */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="loader"><div className="spinner" /></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/inquiries/:id" element={<InquiryDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
