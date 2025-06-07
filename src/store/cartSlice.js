
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === newItem.id && 
               item.selectedSize === newItem.selectedSize && 
               item.selectedColor === newItem.selectedColor
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += newItem.price;
      } else {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          selectedSize: newItem.selectedSize,
          selectedColor: newItem.selectedColor,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }
      
      state.totalQuantity += 1;
      state.totalAmount += newItem.price;
    },
    removeFromCart: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      const existingItem = state.items.find(
        item => item.id === id && 
               item.selectedSize === selectedSize && 
               item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter(
          item => !(item.id === id && 
                   item.selectedSize === selectedSize && 
                   item.selectedColor === selectedColor)
        );
      }
    },
    updateQuantity: (state, action) => {
      const { id, selectedSize, selectedColor, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.id === id && 
               item.selectedSize === selectedSize && 
               item.selectedColor === selectedColor
      );
      
      if (existingItem && quantity > 0) {
        const quantityDiff = quantity - existingItem.quantity;
        const priceDiff = quantityDiff * existingItem.price;
        
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += priceDiff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
