"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HashLoader } from "react-spinners";
import { FaArrowLeft, FaMapMarkerAlt, FaReceipt } from "react-icons/fa";

const UserOrderDetailPage = () => {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!user || !orderId) return;
    setLoading(true);
    try {
      // 1. Fetch Order Details (RLS ensures user can only see their own)
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      // 2. Fetch Order Items with Book details
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          books (
            id,
            name,
            images
          )
        `)
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      setOrder(orderData);
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId, user, supabase]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else {
      fetchOrder();
    }
  }, [orderId, user, authLoading, router, fetchOrder]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-50">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h2 className="text-xl font-semibold text-gray-600">Order not found or access denied.</h2>
        <Button onClick={() => router.push("/user/orders")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-gray-600">
            <FaArrowLeft /> Back to Orders
          </Button>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize shadow-sm
            ${order.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
            Status: {order.status}
          </span>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaReceipt className="text-orange-500" /> Order Info
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Order ID:</span> #{order.id}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
              <p><span className="font-semibold">Total Amount:</span> ₹{Number(order.total_amount).toFixed(2)}</p>
              <p><span className="font-semibold">Payment Method:</span> {order.payment_method}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-orange-500" /> Shipping Details
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Name:</span> {order.user_name}</p>
              <p><span className="font-semibold">Phone:</span> {order.user_mobile || "N/A"}</p>
              <div className="flex gap-1">
                <span className="font-semibold shrink-0">Address:</span>
                <p className="whitespace-pre-line">{order.shipping_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 bg-orange-50 border-b border-orange-100">
            <h3 className="text-lg font-bold text-orange-800">Items Ordered</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Book</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.books?.images?.[0]?.url ? (
                      <img
                        src={item.books.images[0].url}
                        alt="cover"
                        className="w-10 h-14 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-200 rounded"></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">
                    {item.book_name || item.books?.name}
                  </TableCell>
                  <TableCell className="text-right">₹{item.price_at_order}</TableCell>
                  <TableCell className="text-right">x {item.quantity}</TableCell>
                  <TableCell className="text-right font-bold text-gray-800">
                    ₹{(item.price_at_order * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Footer Total */}
          <div className="p-6 flex justify-end bg-gray-50">
            <div className="text-right">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-2xl font-bold text-orange-600">₹{Number(order.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailPage;