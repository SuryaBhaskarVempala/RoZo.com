
import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

const Footer = () => {

  const [activeSection, setActiveSection] = useState('home');
  const { setUser } = useContext(AuthContext);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className='logo-section-footer'>
              <img className='footer-logo-img' src='https://w1.pngwing.com/pngs/523/470/png-transparent-green-leaf-logo-plants-garden-seedling-flower-garden-symbol-nursery-gardening.png'></img>
              <h3>RoZo</h3>
            </div>
            <p>Your trusted partner for beautiful plants and stylish pots.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Signup</NavLink>
              </li>
              <li>
                <NavLink to="#" onClick={(e) => {
                  e.preventDefault();
                  setUser(null); // Clear user context on logout
                  localStorage.removeItem('token'); // Clear user from local storage
                  window.location.href = '/'; // Redirect to home page
                }}>LogOut</NavLink>
              </li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Rojo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
