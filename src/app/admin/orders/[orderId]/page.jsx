"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaPrint, FaDownload, FaArrowLeft } from "react-icons/fa";

const OrderDetailPage = () => {
  const supabase = createClient();
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { orderId } = useParams();
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Order Data with Joins
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch Order Info
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      // Fetch Order Items (with Book details for images/current names)
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
      toast.error("Could not load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId, supabase]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
      return;
    }
    if (orderId) fetchOrder();
  }, [orderId, isAdmin, authLoading, router, fetchOrder]);

  // 2. Handle Status Update
  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      toast.success(`Order marked as ${newStatus}`);
      setOrder((prev) => ({ ...prev, status: newStatus })); // Optimistic update
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // 3. Handle CSV Export
  const handleExportCSV = () => {
    if (!order || items.length === 0) return;

    // Flatten data for CSV
    const csvRows = items.map(item => ({
      OrderID: order.id,
      Date: new Date(order.created_at).toLocaleDateString(),
      Customer: order.user_name,
      Email: order.user_email,
      Mobile: order.user_mobile,
      Address: `"${order.shipping_address?.replace(/\n/g, ' ')}"`, // Handle newlines
      BookName: `"${item.book_name || item.books?.name}"`,
      Quantity: item.quantity,
      Price: item.price_at_order,
      Total: item.price_at_order * item.quantity,
      Status: order.status
    }));

    // Convert to CSV string
    const headers = Object.keys(csvRows[0]);
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => Object.values(row).join(','))
    ].join('\n');

    // Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Order-${orderId}-Details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 4. Handle Print
  const handlePrint = () => {
    window.print();
  };

  if (loading || authLoading) return <div className="h-96 flex items-center justify-center"><HashLoader color="#f97316" /></div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen print:bg-white print:p-0">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <FaArrowLeft /> Back to Orders
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2 border-green-600 text-green-600 hover:bg-green-50">
            <FaDownload /> Export CSV
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-gray-800 text-white hover:bg-gray-700">
            <FaPrint /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Order Header */}
        <div className="bg-orange-50 p-6 border-b border-orange-100 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-gray-500 text-sm">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
              ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
              {order.status}
            </span>
            
            {/* Admin Status Controls (Hidden in Print) */}
            <div className="print:hidden flex gap-1">
              {['shipped', 'delivered', 'cancelled'].map(status => (
                <Button 
                  key={status}
                  size="sm" 
                  variant="outline"
                  disabled={updating || order.status === status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`text-xs capitalize ${order.status === status ? 'opacity-50' : ''}`}
                >
                  Mark {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* User & Shipping Details */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-gray-500 w-24 inline-block">Name:</span> {order.user_name}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Email:</span> {order.user_email}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Mobile:</span> {order.user_mobile || "N/A"}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">User ID:</span> {order.user_id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Shipping & Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-500 w-24 shrink-0">Address:</span> 
                <span className="whitespace-pre-line">{order.shipping_address}</span>
              </div>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Method:</span> {order.payment_method}</p>
              <p><span className="font-medium text-gray-500 w-24 inline-block">Payment ID:</span> {order.payment_id || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
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
                          alt="Book Cover" 
                          className="w-12 h-16 object-cover rounded shadow-sm border"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">No Img</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.book_name || item.books?.name}
                      <div className="text-xs text-gray-400">ID: {item.book_id}</div>
                    </TableCell>
                    <TableCell className="text-right">₹{item.price_at_order}</TableCell>
                    <TableCell className="text-right">x {item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{(item.price_at_order * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Total Calculation */}
          <div className="flex justify-end mt-6">
            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 border-gray-200">
                <span>Total Paid</span>
                <span className="text-orange-600">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;