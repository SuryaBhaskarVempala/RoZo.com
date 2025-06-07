
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Cart from './Cart';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">🌿</div>
              <h1 className="logo-text">Rojo</h1>
              <div className="logo-leaves">
                <span className="leaf leaf-1">🍃</span>
                <span className="leaf leaf-2">🌱</span>
              </div>
            </div>
            <nav className="nav">
              <ul className="nav-list">
                <li>
                  <button 
                    className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                    onClick={() => scrollToSection('home')}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeSection === 'plants' ? 'active' : ''}`}
                    onClick={() => scrollToSection('plants')}
                  >
                    Plants
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                    onClick={() => scrollToSection('about')}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </nav>
            <div className="header-actions">
              <button 
                className="cart-btn"
                onClick={() => setIsCartOpen(true)}
              >
                <span className="cart-icon">🛒</span>
                <span className="cart-text">Cart</span>
                {totalQuantity > 0 && (
                  <span className="cart-badge">{totalQuantity}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
