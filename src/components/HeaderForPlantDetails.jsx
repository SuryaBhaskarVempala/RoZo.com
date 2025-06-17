
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import Cart from './Cart';
import { Navigate } from 'react-router-dom';
import { CartContext } from '../store/CartContext';

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const {totalQuantity} = useContext(CartContext);

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
                            {/* <div className="logo-icon">🌿</div> */}
                            <h1 className="logo-text" style={{ cursor: 'pointer' }} onClick={() => {
                                window.location.href = '/';
                            }}>RoZo</h1>
                        </div>

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
