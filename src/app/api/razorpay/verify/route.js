import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  const { 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature 
  } = await request.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 1. Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
  }

  // 2. Payment Valid -> Create Order in Database
  try {
    // Get User Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get Cart Data for Total
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('quantity, books(price)')
      .eq('user_id', user.id);

    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (item.quantity * (Number(item.books?.price) || 0)), 0
    );

    // Call RPC to move cart -> orders
    const { data: result, error: rpcError } = await supabase.rpc('process_checkout', {
      p_user_id: user.id,
      p_total_amount: totalAmount,
      p_shipping_address: profile.address,
      p_payment_id: razorpay_payment_id,
      p_payment_method: 'razorpay',
      p_user_name: profile.name,
      p_user_email: profile.email,
      p_user_mobile: profile.mobile
    });

    if (rpcError) throw rpcError;

    return NextResponse.json({ success: true, orderId: result.order_id });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}