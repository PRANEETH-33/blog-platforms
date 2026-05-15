import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ToggleSwitch from './ToggleSwitch';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">B</span>
          Blog App
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/create" className={`nav-link nav-write ${isActive('/create') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Write
              </Link>
              <div className="nav-theme-toggle">
                <ToggleSwitch
                  checked={darkMode}
                  onChange={() => { toggleDarkMode(); setMenuOpen(false); }}
                />
              </div>
              <div className="nav-user">
                <Link to="/profile" className="nav-avatar" onClick={() => setMenuOpen(false)}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Start writing</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
