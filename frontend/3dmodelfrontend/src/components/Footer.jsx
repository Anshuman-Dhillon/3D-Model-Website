import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Footer() {
  return (
    <footer className="footer bg-darkblue text-white py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} 3D Model Marketplace</p>
        <small>
          <a href="#" className="text-white mx-2">Privacy Policy</a>|
          <a href="#" className="text-white mx-2">Terms of Service</a>|
          <a href="#" className="text-white mx-2">Contact</a>
        </small>
      </div>
    </footer>
  );
}

export default Footer;
