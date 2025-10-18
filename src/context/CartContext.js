"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthContext'; // Import useAuth to get the user ID
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const supabase = createClient();
  const { user } = useAuth(); // Get the current user
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Cart Items for the logged-in user
  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems([]); // Clear cart if no user is logged in
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch cart items and join with books table to get book details
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
        .order('added_at', { ascending: false }); // Show newest items first

      if (error) throw error;

      // Map data to a more usable format
      const formattedItems = data.map(item => ({
        cartItemId: item.id,
        quantity: item.quantity,
        ...item.books // Spread book details directly
      }));
      setCartItems(formattedItems);

    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(err.message);
      toast.error("Could not load cart items.");
      setCartItems([]); // Clear cart on error
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Effect to fetch cart items when user logs in or out
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]); // fetchCartItems depends on 'user'

  // Add Item to Cart (Handles Insert and Update)
//   const addToCart = async (bookId, quantity = 1) => {
//     if (!user) {
//       toast.error("Please log in to add items to your cart.");
//       // Optionally redirect to login page: router.push('/login');
//       return;
//     }
//     if (quantity <= 0) {
//         toast.error("Quantity must be positive.");
//         return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//         // Use upsert to either insert a new row or update the quantity if the item already exists
//         // Supabase ON CONFLICT requires specifying the constraint name for UNIQUE constraints
//         // Find the constraint name in Supabase UI: Database -> Tables -> cart_items -> Constraints
//         // Or assume the default name convention: tablename_col1_col2_key
//         const { error } = await supabase
//         .from('cart_items')
//         .upsert(
//             { user_id: user.id, book_id: bookId, quantity: quantity },
//             { onConflict: 'user_id, book_id' } // Use the columns defined in UNIQUE constraint
//         );

//         if (error) {
//             // Check if it's a quantity update conflict (handled by upsert logic above if setup correctly)
//             // If the error is different, throw it.
//             // A more robust way might be needed if upsert doesn't automatically increment.
//             // Alternative: Fetch first, then decide Insert or Update.

//              // Simple Refetch approach after upsert attempt:
//              if (error.code === '23505') { // Unique violation potentially handled by upsert logic if it was meant to update
//                 // Attempt to update quantity explicitly if upsert logic needs help (less ideal)
//                 const existingItem = cartItems.find(item => item.id === bookId);
//                 if (existingItem) {
//                     const newQuantity = existingItem.quantity + quantity;
//                     const { error: updateError } = await supabase
//                         .from('cart_items')
//                         .update({ quantity: newQuantity })
//                         .match({ user_id: user.id, book_id: bookId });
//                     if (updateError) throw updateError;
//                 } else {
//                      throw error; // If not found, the original error was valid
//                 }
//              } else {
//                 throw error; // Throw other errors
//              }
//         }

//       toast.success("Item added to cart!");
//       await fetchCartItems(); // Refresh cart state

//     } catch (err) {
//       console.error("Error adding to cart:", err);
//       setError(err.message);
//       toast.error("Failed to add item to cart.");
//     } finally {
//       setLoading(false);
//     }
//   };


const addToCart = async (bookId, quantityToAdd = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    if (quantityToAdd <= 0) {
        toast.error("Quantity must be positive.");
        return;
    }

    setLoading(true);
    setError(null);
    try {
        // 1. Check if the item already exists in the cart for this user
        const { data: existingItems, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('book_id', bookId)
            .maybeSingle(); // Use maybeSingle to get one item or null

        if (fetchError) throw fetchError;

        if (existingItems) {
            // 2. If item exists, update its quantity
            const newQuantity = existingItems.quantity + quantityToAdd;
            const { error: updateError } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', existingItems.id); // Update using the specific cart item ID

            if (updateError) throw updateError;
            toast.success("Cart updated!");

        } else {
            // 3. If item doesn't exist, insert it
            const { error: insertError } = await supabase
                .from('cart_items')
                .insert({
                    user_id: user.id,
                    book_id: bookId,
                    quantity: quantityToAdd
                });

            if (insertError) throw insertError;
            toast.success("Item added to cart!");
        }

      await fetchCartItems(); // Refresh cart state after insert or update

    } catch (err) {
      console.error("Error adding/updating cart:", err);
      setError(err.message);
      toast.error("Failed to modify cart.");
    } finally {
      setLoading(false);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (cartItemId) => {
    if (!user) return; // Should not happen if item exists, but good practice

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id); // Ensure user owns the item

      if (error) throw error;

      toast.success("Item removed from cart.");
      // Optimistic update or refetch
      // setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
      await fetchCartItems(); // Or simply refetch

    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
      toast.error("Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  // Update Item Quantity in Cart
   const updateCartQuantity = async (cartItemId, newQuantity) => {
        if (!user) return;
        if (newQuantity <= 0) {
            // If quantity drops to 0 or less, remove the item
            await removeFromCart(cartItemId);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', cartItemId)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.info("Cart updated.");
            await fetchCartItems(); // Refresh cart state

        } catch (err) {
            console.error("Error updating cart quantity:", err);
            setError(err.message);
            toast.error("Failed to update cart.");
        } finally {
            setLoading(false);
        }
    };


  // Calculate Total Price
  const cartTotal = cartItems.reduce((total, item) => {
    // Ensure item.price and item.quantity are numbers
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, error, addToCart, removeFromCart, updateCartQuantity, cartTotal, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);