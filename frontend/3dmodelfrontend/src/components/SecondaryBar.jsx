import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../component design/NavBar.css'

function SecondaryBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 secondary_nav">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    {/* Marketplace */}
                    <li className="nav-item">
                        <a className="nav-link nav_text" href="#">
                            Marketplace
                        </a>
                    </li>

                    {/* Dropdown: Categories */}
                    <li className="nav-item dropdown dropdown-hover">
                        <a
                            className="nav-link dropdown-toggle nav_text"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Categories
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Characters</a></li>
                            <li><a className="dropdown-item" href="#">Vehicles</a></li>
                            <li><a className="dropdown-item" href="#">Architecture</a></li>
                            <li><a className="dropdown-item" href="#">Weapons</a></li>
                            <li><a className="dropdown-item" href="#">Props</a></li>
                        </ul>
                    </li>

                    {/* Dropdown: Use Cases */}
                    <li className="nav-item dropdown dropdown-hover">
                        <a
                            className="nav-link dropdown-toggle nav_text"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Use Cases
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Game Dev</a></li>
                            <li><a className="dropdown-item" href="#">Animation</a></li>
                            <li><a className="dropdown-item" href="#">3D Printing</a></li>
                            <li><a className="dropdown-item" href="#">AR/VR</a></li>
                        </ul>
                    </li>

                    {/* New Releases */}
                    <li className="nav-item">
                        <a className="nav-link nav_text" href="#">New Releases</a>
                    </li>

                    {/* Trending */}
                    <li className="nav-item">
                        <a className="nav-link nav_text" href="#">Trending</a>
                    </li>

                    {/* Top Creators */}
                    <li className="nav-item">
                        <a className="nav-link nav_text" href="#">Top Creators</a>
                    </li>

                    {/* My Profile Dropdown */}
                    <li className="nav-item dropdown dropdown-hover">
                        <a
                            className="nav-link dropdown-toggle nav_text"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            My Profile
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">View Profile</a></li>
                            <li><a className="dropdown-item" href="#">Posts</a></li>
                            <li><a className="dropdown-item" href="#">Upload New Model</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#">Account Settings</a></li>
                        </ul>
                    </li>

                    {/* Disabled Example */}
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">
                            Sign Up
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
  

export default SecondaryBar;