import React from 'react';
import "../component design/NavBar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <a className="navbar-brand title" href="#">Navbar</a>
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
              <a className="nav-link nav_text" href="#">
                Home <span className="visually-hidden">(current)</span>
              </a>
            </li>
            <li className="nav-item active">
            <a className="nav-link nav_text" href="#">
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

            <li className="nav-item">
              <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">
                Sign Up
              </a>
            </li>
          </ul>

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
      </nav>
    </>
  );
}

export default NavBar;
