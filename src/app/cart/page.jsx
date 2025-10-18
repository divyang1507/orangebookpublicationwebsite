'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Image from 'next/image'; // Use Next.js Image for optimization

const CartPage = () => {
  const { cartItems, loading, error, removeFromCart, updateCartQuantity, cartTotal } = useCart();

  if (loading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error loading cart: {error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
        <Link href="/products">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="w-[90%] max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.cartItemId} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white">
             {/* Image & Name */}
            <div className="flex items-center gap-4 w-full md:w-1/2">
                <Image
                    src={item.images?.[0]?.url || '/placeholder-image.png'} // Provide a fallback image
                    alt={item.name}
                    width={80}  // Specify width
                    height={100} // Specify height based on aspect ratio
                    className="rounded object-cover"
                 />
              <div className="flex-grow">
                <Link href={`/product/${item.id}`}>
                  <h2 className="text-lg font-semibold hover:text-orange-600">{item.name}</h2>
                </Link>
                <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
              </div>
            </div>

            {/* Quantity Control & Price */}
            <div className="flex items-center justify-between gap-4 w-full md:w-auto">
               {/* Quantity Adjuster */}
               <div className="flex items-center border rounded">
                 <Button
                   variant="ghost"
                   size="icon-sm"
                   onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                   className="rounded-r-none"
                   aria-label="Decrease quantity"
                 >
                   <FaMinus/>
                 </Button>
                 <span className="px-3 text-center w-12">{item.quantity}</span>
                 <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                    className="rounded-l-none"
                    aria-label="Increase quantity"
                 >
                   <FaPlus/>
                 </Button>
               </div>

                {/* Item Total */}
                <p className="font-semibold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>

                {/* Remove Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                >
                    <FaTrash />
                </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 border-t pt-6 flex flex-col items-end">
        <p className="text-xl font-bold text-gray-800">
          Subtotal: <span className="text-orange-600">₹{cartTotal.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">Shipping & taxes calculated at checkout.</p>
        <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
          Proceed to Checkout
        </Button>
      </div>
    </section>
  );
};

export default CartPage;