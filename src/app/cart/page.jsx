// src/app/cart/page.jsx
'use client';

import React from 'react';
import { useCart } from '@/context/CartContext'; // Ensure this path is correct
import { Button } from '@/components/ui/button'; // Ensure this path is correct
import Link from 'next/link';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
// Removed 'import Image from 'next/image';' as we are using the standard img tag

const CartPage = () => {
  // Destructure all necessary values from the CartContext
  const { cartItems, loading, error, removeFromCart, updateCartQuantity, cartTotal } = useCart();

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        {/* Optional: Add a spinner component here */}
        <p className="text-lg text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-lg text-red-600">Error loading cart: {error}</p>
        <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  // Handle empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Your Cart is Empty</h1>
        <Link href="/products">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
            Continue Shopping 🛒
          </Button>
        </Link>
      </div>
    );
  }

  // Render the cart items if not loading, no error, and cart is not empty
  return (
    <section className="w-[90%] max-w-4xl mx-auto py-12 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Shopping Cart 🛍️</h1>

      {/* Cart Items List */}
      <div className="space-y-6 mb-10">
        {cartItems.map((item) => {
          // Calculate item total, ensuring values are numbers
          const itemPrice = Number(item.price) || 0;
          const itemQuantity = Number(item.quantity) || 0;
          const itemTotal = (itemPrice * itemQuantity).toFixed(2);

          return (
            <div
              key={item.cartItemId}
              className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
            >
              {/* Image & Name Section */}
              <div className="flex items-center gap-4 w-full md:w-2/5 lg:w-1/2">
                <img
                  src={item.images?.[0]?.url || '/placeholder-book.png'} // Use a placeholder if no image
                  alt={item.name || 'Book cover'}
                  width="80"
                  height="100" // Maintain aspect ratio if possible
                  className="rounded object-cover flex-shrink-0 w-[80px] h-[100px] border" // Added border
                />
                <div className="flex-grow">
                  <Link href={`/product/${item.id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {item.name || 'Unnamed Book'}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Unit Price: ₹{itemPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Control, Price & Remove Section */}
              <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-3/5 lg:w-1/2">
                {/* Quantity Adjuster */}
                <div className="flex items-center border border-gray-300 rounded">
                  <Button
                    variant="ghost"
                    size="icon-sm" // Use appropriate size from your button variants
                    onClick={() => updateCartQuantity(item.cartItemId, itemQuantity - 1)}
                    className="px-2 py-1 rounded-r-none text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                    disabled={itemQuantity <= 1} // Disable if quantity is 1
                  >
                    <FaMinus size={12} />
                  </Button>
                  <span className="px-3 text-center w-10 text-sm font-medium text-gray-700">
                    {itemQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateCartQuantity(item.cartItemId, itemQuantity + 1)}
                    className="px-2 py-1 rounded-l-none text-gray-600 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={12} />
                  </Button>
                </div>

                {/* Item Total */}
                <p className="font-semibold text-gray-800 w-20 text-right text-sm sm:text-base">
                  ₹{itemTotal}
                </p>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon" // Standard icon size
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded" // Added hover background
                  aria-label="Remove item"
                >
                  <FaTrash size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary Section */}
      <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col items-end space-y-3">
        <p className="text-xl font-bold text-gray-800">
          Subtotal: <span className="text-orange-600">₹{cartTotal.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-500">
          Shipping & taxes calculated at checkout.
        </p>
        <Button
          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-base font-semibold transition-colors duration-200"
          // Add onClick handler for checkout later
          // onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </section>
  );
};

export default CartPage;