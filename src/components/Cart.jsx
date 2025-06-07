
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleRemoveItem = (id, selectedSize, selectedColor) => {
    dispatch(removeFromCart({ id, selectedSize, selectedColor }));
  };

  const handleQuantityChange = (id, selectedSize, selectedColor, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id, selectedSize, selectedColor);
    } else {
      dispatch(updateQuantity({ id, selectedSize, selectedColor, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>Size: {item.selectedSize}</p>
                      <div className="cart-item-color">
                        <span>Color: </span>
                        <div 
                          className="color-preview" 
                          style={{ backgroundColor: item.selectedColor }}
                        ></div>
                      </div>
                      <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-summary">
                  <p>Total Items: {totalQuantity}</p>
                  <p className="cart-total">Total: ${totalAmount.toFixed(2)}</p>
                </div>
                <div className="cart-actions">
                  <button onClick={handleClearCart} className="clear-cart-btn">
                    Clear Cart
                  </button>
                  <button className="checkout-btn">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
