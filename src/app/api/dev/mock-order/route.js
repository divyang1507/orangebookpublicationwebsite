// src/app/api/dev/mock-order/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Use server client for API routes

export async function POST(request) {
  // IMPORTANT: Add authentication/authorization check if needed,
  // even for a dev endpoint, to prevent accidental use.
  // For simplicity, this example assumes it's only accessible in dev.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This endpoint is only available in development mode.' }, { status: 403 });
  }

  const supabase = await createClient();

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    // 2. Fetch user profile for details
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, email, mobile, address')
      .eq('id', user.id)
      .single();

    if (profileError) throw new Error(`Failed to fetch profile: ${profileError.message}`);
    if (!profile?.address) throw new Error('User profile requires an address to create an order.'); // Example validation

    // 3. Fetch cart items for the user
    const { data: cartItemsData, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        books (
          id,
          name,
          price
        )
      `)
      .eq('user_id', user.id);

    if (cartError) throw new Error(`Failed to fetch cart items: ${cartError.message}`);
    if (!cartItemsData || cartItemsData.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 4. Calculate total amount (ensure prices and quantities are numbers)
    const totalAmount = cartItemsData.reduce((total, item) => {
      const price = Number(item.books?.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);

    // 5. Create the order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'paid', // Mock status
        payment_id: `mock_dev_${Date.now()}`, // Mock payment ID
        payment_method: 'mock_dev_payment', // Mock payment method
        user_name: profile.name,
        user_email: profile.email,
        user_mobile: profile.mobile,
        shipping_address: profile.address, // Use profile address for mock
      })
      .select('id') // Select the ID of the newly created order
      .single(); // Expecting a single row

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);
    if (!order) throw new Error('Order creation returned no data.');

    const orderId = order.id;

    // 6. Create order items records
    const orderItems = cartItemsData.map(item => ({
      order_id: orderId,
      book_id: item.books?.id,
      quantity: item.quantity,
      price_at_order: Number(item.books?.price) || 0, // Store price at time of order
      book_name: item.books?.name, // Store name snapshot
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      // Attempt to clean up the order if items fail
      await supabase.from('orders').delete().eq('id', orderId);
      throw new Error(`Failed to create order items: ${orderItemsError.message}`);
    }

    // 7. Clear the cart (delete items from cart_items)
    const cartItemIds = cartItemsData.map(item => item.id);
    const { error: deleteCartError } = await supabase
      .from('cart_items')
      .delete()
      .in('id', cartItemIds);

    if (deleteCartError) {
      // Log error but don't fail the whole process if cart clearing fails
      console.error("Error clearing cart after mock order:", deleteCartError.message);
    }

    // 8. Return success response
    return NextResponse.json({ success: true, orderId: orderId, message: 'Mock order created successfully!' });

  } catch (error) {
    console.error("Mock order creation failed:", error);
    return NextResponse.json({ error: error.message || 'Failed to create mock order' }, { status: 500 });
  }
}