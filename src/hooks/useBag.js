import { useState } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (shoe) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === shoe.id && item.selectedSize === shoe.selectedSize
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.id === shoe.id && item.selectedSize === shoe.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...shoe, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity, selectedSize = null) => {
    setCart(prev => {
      if (newQuantity <= 0) {
        // Remove item from cart if quantity <= 0
        if (selectedSize) {
          return prev.filter(item =>
            !(item.id === itemId && item.selectedSize === selectedSize)
          );
        } else {
          return prev.filter(item => item.id !== itemId);
        }
      } else {
        // Update quantity normally
        return prev.map(cartItem =>
          cartItem.id === itemId && (!selectedSize || cartItem.selectedSize === selectedSize)
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};