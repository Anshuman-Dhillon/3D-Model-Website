import React from 'react';
import "../component design/NavBar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";
import profilepic from "../assets/react.svg"

function NavBar() {
  const navigate = useNavigate();
  const showProfileDropdown = false;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar-gradient px-3">
        <div className="d-flex align-items-center">
          <a className="navbar-brand title me-4" href="#" style={{ whiteSpace: 'nowrap' }}>3DModeller</a>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-2 me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <button
                className="nav-link nav_text btn btn-link p-0"
                style={{ textDecoration: 'none' }}
                onClick={() => navigate("/home")}
              >
                Home <span className="visually-hidden">(current)</span>
              </button>
            </li>
            <li className="nav-item active">
              <button
                className="nav-link nav_text btn btn-link p-0"
                style={{ textDecoration: 'none' }}
                onClick={() => navigate("/catalog")}
              >
                Marketplace <span className="visually-hidden">(current)</span>
              </button>
            </li>
            <li className="nav-item active">
              <button
                className="nav-link nav_text btn btn-link p-0"
                style={{ textDecoration: 'none' }}
                onClick={() => navigate("/transactions")}
              >
                Orders & Transactions <span className="visually-hidden">(current)</span>
              </button>
            </li>

            {showProfileDropdown && (
              <li className="nav-item dropdown dropdown-hover nav_text">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  aria-expanded="false"
                >
                  My Profile
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">View Profile</a></li>
                  <li><a className="dropdown-item" href="#">Posts</a></li>
                  <li><a className="dropdown-item" href="#">Upload New Model</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Account Settings</a></li>
                </ul>
              </li>
            )}
          </ul>

          {/* Right-side buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              className="btn p-2"
              type="button"
              onClick={() => navigate("/cart")}
              title="Shopping Cart"
              style={{ border: 'none', background: 'transparent' }}
            >
              <img 
                src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f6d2.svg" 
                alt="Cart" 
                style={{ width: '32px', height: '32px' }}
              />
            </button>
            <button
              className="btn p-2"
              type="button"
              onClick={() => navigate("/settings")}
              title="Settings"
              style={{ borderColor: "#496ecc", background: 'transparent' }}
            >
              <img src={profilepic} alt="Icon" width="40" height="40" style={{paddingRight: "15px"}}/>
              <img 
                src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2699.svg" 
                alt="Settings" 
                style={{ width: '32px', height: '32px' }}
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
