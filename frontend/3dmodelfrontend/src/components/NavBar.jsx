import React from 'react';
import "../component design/NavBar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <a className="navbar-brand title" href="#" onClick={() => navigate("/home")}>3DModeller</a>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <a className="nav-link nav_text" href="#" onClick={() => navigate("/home")}>
                Home <span className="visually-hidden">(current)</span>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link nav_text" href="#" onClick={() => navigate("/catalog")}>
                Marketplace <span className="visually-hidden">(current)</span>
              </a>
            </li>

            {/* Hover-based Dropdown */}
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
          </ul>

          <div className="d-flex align-items-center">
            {/* Login & Sign Up Buttons */}
            <button className="btn btn-outline-light me-2" type="button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn btn-light me-4" type="button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>

            {/* Search Form */}
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn search_button" type="submit">
                Search
              </button>
            </form>
          </div>



        </div>
      </nav>
    </>
  );
}

export default NavBar;
