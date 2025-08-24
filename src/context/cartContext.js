// context/cartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import { isAuthenticated, handleApiError } from '../utils/apiHelpers';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const deliveryFee = 50; // Example delivery fee
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping cart fetch');
        setCartItems([]);
        return;
      }

      const res = await API.get('/cart');
      const items = res.data.items.map(item => ({
        ...item,
        total: item.price * item.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // If it's an auth error, clear the cart
      if (err.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + deliveryFee);
  }, [cartItems, deliveryFee]);

  const updateCart = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping cart update');
        return;
      }

      const res = await API.get('/cart');
      const items = res.data.items.map(item => ({
        ...item,
        total: item.price * item.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      console.error('Error updating cart:', err);
      // Don't show alert for auth errors
      if (err.response?.status !== 401) {
        alert(handleApiError(err, 'Failed to update cart. Please try again.'));
      }
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        alert('Please login to manage your cart');
        return;
      }

      const item = cartItems.find(item => item.medicineId._id === itemId);
      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        await API.post('/cart/remove', { medicineId: itemId });
      } else {
        await API.post('/cart/add', {
          medicineId: itemId,
          quantity: change,
        });
      }
      await updateCart();
    } catch (err) {
      console.error('Error updating cart:', err);
      alert(handleApiError(err, 'Failed to update cart. Please try again.'));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        alert('Please login to manage your cart');
        return;
      }

      await API.post('/cart/remove', { medicineId: itemId });
      await updateCart();
    } catch (err) {
      console.error('Error removing item:', err);
      alert(handleApiError(err, 'Failed to remove item. Please try again.'));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        setSubtotal,
        total,
        setTotal,
        deliveryFee,
        loading,
        handleQuantityChange,
        handleRemoveItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};