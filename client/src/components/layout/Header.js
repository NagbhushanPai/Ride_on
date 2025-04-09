import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContext;

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const onLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const authLinks = (
    <>
      <li>
        <Link to="/dashboard" className="rb-nav-item">Dashboard</Link>
      </li>
      <li>
        <Link to="/bookings" className="rb-nav-item">My Bookings</Link>
      </li>
      <li>
        <Link to="/profile" className="rb-nav-item">Profile</Link>
      </li>
      <li>
        <a href="#!" onClick={onLogout} className="rb-nav-item">
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/login" className="rb-nav-item">Login</Link>
      </li>
      <li>
        <Link to="/register" className="rb-nav-item">Register</Link>
      </li>
    </>
  );

  return (
    <header className="rb-header">
      <div className="rb-container">
        <div className="rb-header-top">
          <div className="rb-contact">
            <div className="rb-contact-item">
              <i className="fas fa-phone-alt"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="rb-contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@cyclepathrentals.com</span>
            </div>
          </div>
          <div className="rb-social">
            <a href="#!" className="rb-social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#!" className="rb-social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#!" className="rb-social-icon"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="rb-header-main">
          <Link to="/" className="rb-logo">
            <i className="fas fa-bicycle"></i>
            <span>CyclePath</span>
          </Link>
          <nav className={`rb-nav ${isMobileMenuOpen ? 'rb-nav-active' : ''}`}>
            <Link to="/" className="rb-nav-item">Home</Link>
            <Link to="/cycles" className="rb-nav-item">Cycles</Link>
            <Link to="/about" className="rb-nav-item">About Us</Link>
            {isAuthenticated ? authLinks : guestLinks}
          </nav>
          <div className="rb-buttons">
            {isAuthenticated ? (
              <Link to="/bookings" className="rb-btn rb-btn-primary">My Bookings</Link>
            ) : (
              <Link to="/login" className="rb-btn rb-btn-outline">Login</Link>
            )}
          </div>
          <div className="rb-mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 