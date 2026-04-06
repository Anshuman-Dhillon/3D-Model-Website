import React, { useState } from 'react';
import "../component design/NavBar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const categories = ["Sci-Fi", "Fantasy", "Architecture", "Weapons", "Vehicles"];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      {/* ── Primary Nav ── */}
      <nav className="navbar navbar-expand-lg navbar-dark primary-nav px-3">
        <a className="navbar-brand brand-logo" onClick={() => navigate("/home")} style={{ cursor: 'pointer' }}>
          3DModeller
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* Spacer to push everything right */}
          <div className="me-auto"></div>

          {/* Nav links — right-aligned with other controls */}
          <ul className="navbar-nav mb-2 mb-lg-0 me-3">
            <li className="nav-item">
              <button className={`nav-link nav-btn ${isActive('/home') || isActive('/') ? 'active-link' : ''}`} onClick={() => navigate("/home")}>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link nav-btn ${isActive('/catalog') ? 'active-link' : ''}`} onClick={() => navigate("/catalog")}>
                Marketplace
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link nav-btn ${isActive('/users') ? 'active-link' : ''}`} onClick={() => navigate("/users")}>
                Creators
              </button>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <button className={`nav-link nav-btn ${isActive('/mymodels') ? 'active-link' : ''}`} onClick={() => navigate("/mymodels")}>
                    My Models
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link nav-btn ${isActive('/transactions') ? 'active-link' : ''}`} onClick={() => navigate("/transactions")}>
                    Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link nav-btn ${isActive('/messages') ? 'active-link' : ''}`} onClick={() => navigate("/messages")}>
                    Messages
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className={`nav-link nav-btn ${isActive('/support') ? 'active-link' : ''}`} onClick={() => navigate("/support")}>
                Support
              </button>
            </li>
          </ul>

          {/* Right section */}
          <div className="d-flex align-items-center gap-2 nav-right">
            {/* Compact search */}
            <form className="nav-search-form" onSubmit={handleNavSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
              <button type="submit" className="nav-search-btn" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>

            {user && (
              <button className="nav-icon-btn" onClick={() => navigate("/managemodel")} title="Upload Model">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            )}

            <button className="nav-icon-btn" onClick={() => navigate("/cart")} title="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>

            {!user ? (
              <>
                <button className="btn btn-nav-outline" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-nav-solid" onClick={() => navigate("/signup")}>Sign Up</button>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn user-menu-btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt=""
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginRight: '6px' }}
                    />
                  ) : (
                    <span className="user-avatar">{user.username?.charAt(0).toUpperCase()}</span>
                  )}
                  <span className="user-name d-none d-xl-inline">{user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end user-dropdown">
                  <li><button className="dropdown-item" onClick={() => navigate("/profile")}>Profile Settings</button></li>
                  <li><button className="dropdown-item" onClick={() => navigate("/settings")}>Settings</button></li>
                  <li><button className="dropdown-item" onClick={() => navigate("/settings/notifications")}>Notifications</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Secondary Category Bar ── */}
      <div className="secondary-nav">
        <div className="secondary-nav-inner">
          <button className={`cat-link ${!location.search && isActive('/catalog') ? 'cat-active' : ''}`} onClick={() => navigate("/catalog")}>
            All Models
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-link ${location.search?.includes(cat) ? 'cat-active' : ''}`}
              onClick={() => navigate(`/catalog?q=&category=${cat}`)}
            >
              {cat}
            </button>
          ))}
          <span className="cat-divider" />
          <button className="cat-link cat-highlight" onClick={() => navigate("/catalog?sort=newest")}>
            New Releases
          </button>
          <button className="cat-link cat-highlight" onClick={() => navigate("/catalog?sort=popular")}>
            Trending
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
