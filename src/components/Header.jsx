
import React from 'react';

const Header = () => {
  return (
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
            <button className="cart-btn">
              Cart (0)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
