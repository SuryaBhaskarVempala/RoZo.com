import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../store/CartContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

const Cart = ({ isOpen, onClose }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [availabilityMap, setAvailabilityMap] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }

    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchAllAvailabilities = async () => {
      const newMap = {};

      const apiUrl = import.meta.env.VITE_API_URL;
      await Promise.all(
        items.map(async (item) => {
          try {
            const res = await fetch(
              `${apiUrl}/plants/fetchPlant/${item.productId}/${item.selectedSize}/${item.selectedColor}`
            );
            const data = await res.json();
            const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
            newMap[key] = data.available;

            // Auto-correct quantity if it exceeds available stock
            if (item.quantity > data.available && data.available > 0) {
              updateQuantity({
                userId: user._id,
                id: item.productId,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                quantity: data.available,
              });
            }
          } catch (e) {
            const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
            newMap[key] = 0;
          }
        })
      );

      setAvailabilityMap(newMap);
    };

    if (items.length > 0 && user) fetchAllAvailabilities();
  }, [items, user]);

  const handleQuantityChange = (userId, id, size, color, newQty) => {
    if (newQty <= 0) {
      removeFromCart(userId, id, size, color);
      return;
    }

    updateQuantity({ userId, id, selectedSize: size, selectedColor: color, quantity: newQty });
  };

  if (!isOpen) return null;
  if (!user) {
    navigate('/login');
    return null;
  }

  const totalAmount = items.reduce((sum, item) => {
    const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
    const available = availabilityMap[key];
    if (available === 0) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => {
    const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
    const available = availabilityMap[key];
    if (available === 0) return sum;
    return sum + item.quantity;
  }, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {items?.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => {
                const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
                const available = availabilityMap[key];
                const isUnavailable = available === 0;
                const isMaxReached = item.quantity >= available;

                return (
                  <div
                    key={key}
                    className={`cart-item ${isUnavailable ? 'unavailable' : ''}`}
                    style={{ opacity: isUnavailable ? 0.5 : 1 }}
                  >
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className={`item-name ${isUnavailable ? 'strikethrough' : ''}`}>
                        {item.name}
                      </h3>
                      <p>Size: {item.selectedSize}</p>
                      <div className="cart-item-color">
                        <span>Color: </span>
                        <div
                          className="color-preview"
                          style={{ backgroundColor: item.selectedColor }}
                        ></div>
                      </div>
                      <p className={`cart-item-price ${isUnavailable ? 'strikethrough' : ''}`}>
                        ₹{item.price.toFixed(2)} each
                      </p>
                      {isUnavailable ? (
                        <p className="stock-warning">Out of Stock</p>
                      ) : (
                        <p className="stock-info">Only {available} available</p>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              user._id,
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="quantity-btn"
                          disabled={item.quantity <= 0 || isUnavailable}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              user._id,
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="quantity-btn"
                          disabled={isMaxReached || isUnavailable}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(user._id, item.productId, item.selectedSize, item.selectedColor)
                        }
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">
            <p>Total Items: {totalQuantity}</p>
            <p className="cart-total">Total: ₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="cart-actions">
            <button onClick={() => clearCart(user._id)} className="clear-cart-btn">
              Clear Cart
            </button>
            <button
              className="checkout-btn"
              onClick={() => {
                if (user) {
                  const filteredItems = items.filter((item) => {
                    const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
                    return availabilityMap[key] > 0;
                  });

                  const filteredTotal = filteredItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );

                  const filteredQuantity = filteredItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  if (filteredItems.length === 0) {
                    alert("No available items to checkout.");
                    return;
                  }

                  console.log(filteredTotal);
                  navigate('/checkout', {
                    state: {
                      cartItems: filteredItems,
                      totalAmount: filteredTotal,
                      totalQuantity: filteredQuantity,
                    },
                  });
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
