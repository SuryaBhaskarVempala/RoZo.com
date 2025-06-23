
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext.jsx';
import { CartContext } from '../store/CartContext.jsx';

const Header = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { totalQuantity } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="bx bx-menu" onClick={toggleMenu}></i>
               <div className="logo-icon">🌿</div> 
              <h1 className="logo-text" style={{ cursor: 'pointer' }} onClick={() => {
                window.location.href = '/';
              }}>RoZo</h1>
            </div>
            <nav className="nav">
              <ul className="nav-list">
                <li>
                  <button
                    className={`nav-link`}
                    onClick={() => scrollToSection('home')}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-link }`}
                    onClick={() => scrollToSection('plants')}
                  >
                    Plants
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-link`}
                    onClick={() => scrollToSection('about')}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-link`}
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  {user ? <button
                    className={`nav-link`}
                    id='account-btn'
                    onClick={() => navigate('/Account')}
                  >
                    <i class="fa-solid fa-user"></i>
                    <>Account</>
                  </button> : <button
                    className={`nav-link`}
                    id='account-btn'
                    onClick={() => navigate('/login')}
                  >
                    <>Login</>
                  </button>}

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

      <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
        <i className="bx bx-x" onClick={toggleMenu}></i>
        <button className='side-link' onClick={() => scrollToSection('home')}>Home</button>
        <button className='side-link' onClick={() => scrollToSection('plants')}>Plants</button>
        <button className='side-link' onClick={() => scrollToSection('about')}>About</button>
        <button className='side-link' onClick={() => scrollToSection('contact')}>Contact</button>
        {user ? (
          <button className='side-link' onClick={() => navigate('/Account')}>Account</button>
        ) : (
          <button className='side-link' onClick={() => navigate('/login')}>Login</button>
        )}
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
