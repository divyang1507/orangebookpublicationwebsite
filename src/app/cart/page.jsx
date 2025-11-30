'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Script from 'next/script'; // Import Next.js Script
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CartPage = () => {
  const { cartItems, loading, error, removeFromCart, updateCartQuantity, cartTotal, fetchCartItems } = useCart();
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false); // <--- NEW STATE
  const router = useRouter();

  // --- MOCK ORDER HANDLER (Dev Only) ---
  const handleMockOrder = async () => {
    // ... (Your mock logic remains the same)
    try {
      const response = await fetch('/api/dev/mock-order', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      toast.success(`Mock order ${result.orderId} created!`);
      await fetchCartItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --- RAZORPAY HANDLER ---
  const handleCheckout = async () => {
    // 1. Check if user has address
    if (!profile?.address) {
      toast.error("Please add a shipping address in your profile first.");
      router.push('/user/profile');
      return;
    }

    // 2. Check if Razorpay SDK is loaded
    if (!isRazorpayLoaded) {
      toast.warn("Payment SDK is still loading. Please wait a moment...");
      return;
    }

    setIsProcessing(true);

    try {
      // 3. Create Order on Server
      const response = await fetch('/api/razorpay/create-order', { method: 'POST' });
      const orderData = await response.json();

      if (!response.ok) throw new Error(orderData.error);

      // 4. Initialize Razorpay Options
      const options = {
        // FIX: Must use NEXT_PUBLIC_ prefix
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Orange Book Publication",
        description: "Book Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          // 5. Verify Payment on Server
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) throw new Error(verifyData.error);

            toast.success("Payment Successful! Order placed.");
            await fetchCartItems();
            router.push(`/user/orders/${verifyData.orderId}`);

          } catch (err) {
            console.error("Verification Error:", err);
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: profile?.name || "",
          email: user?.email || "",
          contact: profile?.mobile || "",
        },
        theme: {
          color: "#f97316",
        },
      };

      // 6. Open Modal safely
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err.message || "Failed to initiate checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-60"><p>Loading...</p></div>;
  if (error) return <div className="text-center py-10 px-4 text-red-600">{error}</div>;
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products">
          <Button className="bg-orange-500 text-white">Continue Shopping 🛒</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="w-[90%] max-w-4xl mx-auto py-12 px-2">
      {/* ✅ SCRIPT WITH ONLOAD HANDLER */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
        onError={() => toast.error("Razorpay SDK failed to load. Check your connection.")}
      />

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Shopping Cart 🛍️</h1>

      <div className="space-y-6 mb-10">
        {cartItems.map((item) => {
           const itemPrice = Number(item.price) || 0;
           const itemQuantity = Number(item.quantity) || 0;
           const itemTotal = (itemPrice * itemQuantity).toFixed(2);
           
           return (
            <div key={item.cartItemId} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex items-center gap-4 w-full md:w-2/5 lg:w-1/2">
                <img src={item.images?.[0]?.url || '/placeholder-book.png'} alt={item.name} className="rounded w-20 h-24 object-cover border" />
                <div>
                  <Link href={`/product/${item.id}`} className="text-lg font-semibold hover:text-orange-600 line-clamp-2">{item.name}</Link>
                  <p className="text-sm text-gray-500">Unit: ₹{itemPrice}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 w-full md:w-3/5">
                <div className="flex border rounded">
                  <Button variant="ghost" size="icon-sm" onClick={() => updateCartQuantity(item.cartItemId, itemQuantity - 1)} disabled={itemQuantity <= 1}><FaMinus size={10} /></Button>
                  <span className="px-3 text-sm flex items-center">{itemQuantity}</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => updateCartQuantity(item.cartItemId, itemQuantity + 1)}><FaPlus size={10} /></Button>
                </div>
                <p className="font-semibold w-20 text-right">₹{itemTotal}</p>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.cartItemId)} className="text-red-500"><FaTrash /></Button>
              </div>
            </div>
           );
        })}
      </div>

      <div className="border-t pt-6 flex flex-col items-end space-y-3">
        <p className="text-xl font-bold">Subtotal: <span className="text-orange-600">₹{cartTotal.toFixed(2)}</span></p>
        
        <Button
          onClick={handleCheckout}
          disabled={isProcessing || !isRazorpayLoaded}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : (isRazorpayLoaded ? 'Proceed to Pay' : 'Loading Payment...')}
        </Button>

        {process.env.NODE_ENV === 'development' && (
          <Button variant="outline" onClick={handleMockOrder} className="text-blue-500 border-blue-500">
            DEV: Create Mock Order
          </Button>
        )}
      </div>
    </section>
  );
};

export default CartPage;