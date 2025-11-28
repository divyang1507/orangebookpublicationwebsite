"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "react-toastify";
import Link from "next/link";

// Component to update status inside the table
const StatusUpdater = ({ orderId, currentStatus, onUpdate }) => {
  const supabase = createClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const possibleStatuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    if (!confirm(`Change order #${orderId} status to "${newStatus}"?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      onUpdate(); // Trigger refetch
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className={`p-1 border rounded text-sm disabled:opacity-50 font-medium ${
        currentStatus === "paid"
          ? "text-green-600 bg-green-50 border-green-200"
          : currentStatus === "pending"
          ? "text-yellow-600 bg-yellow-50 border-yellow-200"
          : currentStatus === "cancelled"
          ? "text-red-600 bg-red-50 border-red-200"
          : "text-gray-700 bg-white"
      }`}
    >
      {possibleStatuses.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
};

const AdminOrdersPage = () => {
  const supabase = createClient();
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Add state for the filter
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Start building the query
      let query = supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          user_name,
          user_email,
          total_amount,
          status,
          payment_method
        `
        )
        .order("created_at", { ascending: false });

      // 2. Apply filter if specific status is selected
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      toast.error("Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  }, [supabase, statusFilter]); // Add statusFilter dependency

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied.");
      router.push("/");
      return;
    }
    if (isAdmin || authLoading) {
      fetchOrders();
    }
  }, [authLoading, isAdmin, router, fetchOrders]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-10">
        Error loading orders: {error}
      </div>
    );
  }

  if (!isAdmin) return null;

  const statuses = ["all", "pending", "paid", "shipped", "delivered", "cancelled"];

  return (
    <div className="p-6 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        
        {/* 3. Filter Buttons UI */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
              className={`capitalize ${
                statusFilter === status 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "hover:bg-orange-50 hover:text-orange-600 border-orange-200"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableCaption>A list of customer orders.</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No {statusFilter !== 'all' ? statusFilter : ''} orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{order.user_name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.user_email}</div>
                  </TableCell>
                  <TableCell>₹{Number(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{order.payment_method || "N/A"}</TableCell>
                  <TableCell>
                    <StatusUpdater
                      orderId={order.id}
                      currentStatus={order.status}
                      onUpdate={fetchOrders}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
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
  );
};

export default AdminOrdersPage;