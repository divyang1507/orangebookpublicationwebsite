"use client";
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";

const UserOrdersPage = () => {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // RLS policies automatically filter this to only show the user's orders
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    fetchOrders();
  }, [user, authLoading, router, fetchOrders]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-50">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader className="bg-orange-50">
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FaBoxOpen size={40} className="mb-2" />
                      <p>No orders found.</p>
                      <Link href="/products" className="text-orange-500 hover:underline mt-2">
                        Start Shopping
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{order.payment_method}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/user/orders/${order.id}`}>
                        <Button size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserOrdersPage;