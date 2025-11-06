import { useState, useCallback, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Simpan perubahan cart ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cart]);

  const addToCart = useCallback((shoe) => {
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
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity, selectedSize = null) => {
    setCart(prev => {
      if (newQuantity <= 0) {
        return prev.filter(item =>
          !(item.id === itemId && (!selectedSize || item.selectedSize === selectedSize))
        );
      } else {
        return prev.map(cartItem =>
          cartItem.id === itemId && (!selectedSize || cartItem.selectedSize === selectedSize)
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId, selectedSize = null) => {
    setCart(prev =>
      prev.filter(item =>
        !(item.id === itemId && (!selectedSize || item.selectedSize === selectedSize))
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  /**
   * Simpan item yang akan di-checkout.
   * Kalau ada argumen `items`, itu yang akan disimpan.
   * Kalau `singleProduct` dikirim, maka hanya produk itu saja yang disimpan.
   * Kalau tidak ada argumen, default-nya semua isi cart disimpan.
   */
  const saveCheckoutItems = useCallback((items = null, singleProduct = null) => {
    let dataToSave = [];

    if (singleProduct) {
      dataToSave = [singleProduct]; // hanya simpan satu produk
    } else if (items) {
      dataToSave = items;
    } else {
      dataToSave = cart;
    }

    localStorage.setItem('checkoutItems', JSON.stringify(dataToSave));
  }, [cart]);

  const getCheckoutItems = useCallback(() => {
    try {
      const items = localStorage.getItem('checkoutItems');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  }, []);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveCheckoutItems,
    getCheckoutItems,
  };
};
