"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const supabase = createClient();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to find item in local state
  const findItem = (items, bookId) => items.find(item => item.id === bookId);

  // Fetch Cart Items
  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    // Only set loading on initial fetch if cart is empty to avoid flickering on re-fetches
    if (cartItems.length === 0) setLoading(true);
    
    setError(null);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          books (
            id,
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      // Map data: 'item.id' becomes 'cartItemId', and book details are spread at top level
      // Note: item.books.id becomes the 'id' of the item in our state
      const formattedItems = data.map(item => ({
        cartItemId: item.id,
        quantity: item.quantity,
        ...item.books 
      }));
      setCartItems(formattedItems);

    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(err.message);
      // toast.error("Could not load cart items."); // Optional: suppress on simple refreshes
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Initial Fetch
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // 1. Efficient Add/Update using SQL Upsert & Optimistic UI
  const addToCart = async (book, quantityToAdd = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // A. Optimistic UI Update: Update state immediately before DB call
    const previousCart = [...cartItems];
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      // Optimistically add new item. 
      // We give it a temporary cartItemId until we re-fetch the real one.
      return [{ ...book, quantity: quantityToAdd, cartItemId: 'temp-' + Date.now() }, ...prev];
    });

    try {
      // B. Database Call: Single Upsert Request
      // We calculate the final quantity based on previous state + addition
      const existingItem = findItem(previousCart, book.id);
      const finalQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd;

      const { error } = await supabase
        .from('cart_items')
        .upsert(
          { 
            user_id: user.id, 
            book_id: book.id, 
            quantity: finalQuantity 
          },
          { onConflict: 'user_id, book_id' } // Requires the UNIQUE constraint on DB
        );

      if (error) throw error;
      
      toast.success("Item added to cart!");
      
      // C. Re-fetch to sync IDs (replace temp IDs with real ones) and ensure data consistency
      await fetchCartItems(); 

    } catch (err) {
      // D. Rollback on error
      setCartItems(previousCart); 
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item. " + err.message);
    }
  };

  // 2. Optimized Update Quantity with Optimistic UI
  const updateCartQuantity = async (cartItemId, newQuantity) => {
    if (!user) return;
    
    // Snapshot for rollback
    const previousCart = [...cartItems];

    // Optimistic Update
    setCartItems(prev => prev.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ));

    try {
        if (newQuantity <= 0) {
            // If quantity is 0, delegate to remove function
            await removeFromCart(cartItemId);
            return;
        }

        // Direct Update by ID (Very fast)
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', cartItemId)
            .eq('user_id', user.id);

        if (error) throw error;
        // No need to re-fetch if update is successful, state is already correct.
    } catch (err) {
        setCartItems(previousCart); // Rollback
        console.error("Error updating cart quantity:", err);
        toast.error("Failed to update cart.");
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    // Snapshot for rollback
    const previousCart = [...cartItems];

    // Optimistic Remove
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success("Item removed from cart.");

    } catch (err) {
      setCartItems(previousCart); // Rollback
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item.");
    }
  };

  // Calculate Total Price
  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      error, 
      addToCart, 
      removeFromCart, 
      updateCartQuantity, 
      cartTotal, 
      fetchCartItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);