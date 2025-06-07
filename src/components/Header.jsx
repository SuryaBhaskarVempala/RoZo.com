
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Cart from './Cart';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1 className="logo-text">Rojo</h1>
            </div>
            <nav className="nav">
              <ul className="nav-list">
                <li><a href="#" className="nav-link">Home</a></li>
                <li><a href="#" className="nav-link">Plants</a></li>
                <li><a href="#" className="nav-link">About</a></li>
                <li><a href="#" className="nav-link">Contact</a></li>
              </ul>
            </nav>
            <div className="header-actions">
              <button 
                className="cart-btn"
                onClick={() => setIsCartOpen(true)}
              >
                <span className="cart-icon">🛒</span>
                Cart ({totalQuantity})
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
