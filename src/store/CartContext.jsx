import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      if (!user) {
        setItems([]);
        setTotalQuantity(0);
        setTotalAmount(0);
      }
      else {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/cart/${user._id}`);
        console.log(res.data);
        setItems(res.data.items);
        setTotalQuantity(res.data.totalQuantity);
        setTotalAmount(res.data.totalAmount);
      }
    } catch (err) {
      console.error("Fetch cart failed:", err);
    }
  };

  const addToCart = async (item) => {
    console.log(item);
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${apiUrl}/cart/add`, { ...item });
      await fetchCart(); // sync with latest data
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async ({ userId, id, selectedSize, selectedColor, quantity }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${apiUrl}/cart/update`, { userId, id, selectedSize, selectedColor, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  const removeFromCart = async ( userId, id, selectedSize, selectedColor ) => {
    console.log( userId, id, selectedSize, selectedColor );
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/cart/remove`, {
        data: { userId, id, selectedSize, selectedColor },
      });
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const clearCart = async (userId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/cart/clear`, {
        data: { userId }
      });
      await fetchCart();
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart(); //fetch on mount
    } else {
      setItems([]);
      setTotalQuantity(0);
      setTotalAmount(0);
    }
  }, [user]);


  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// export const useCart = () => useContext(CartContext);


// import { useCart } from '../context/CartContext';
// import { AuthContext } from './AuthContext';

// const AddToCartButton = ({ plant, selectedSize, selectedColor }) => {
//   const { addToCart, loading } = useCart();

//   const handleAdd = () => {
//     addToCart({
//       id: plant.id,
//       name: plant.name,
//       image: plant.image,
//       price: plant.price,
//       selectedSize,
//       selectedColor,
//     });
//   };

//   return (
//     <button onClick={handleAdd} disabled={loading}>
//       {loading ? 'Adding...' : 'Add to Cart'}
//     </button>
//   );
// };
