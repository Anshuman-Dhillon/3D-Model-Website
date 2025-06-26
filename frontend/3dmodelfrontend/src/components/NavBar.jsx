import React from 'react';
import "../component design/NavBar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  // Control visibility of My Profile dropdown
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

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light me-2"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-light me-4"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
