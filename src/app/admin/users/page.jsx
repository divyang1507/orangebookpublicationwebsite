"use client";
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
import React, { useEffect, useState, useCallback } from "react";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaTrash, FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch users from our custom API
  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
      
      setUsers(data.users);
      setFilteredUsers(data.users); // Initial set
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Handle Filtering
  useEffect(() => {
    if (roleFilter === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === roleFilter));
    }
  }, [roleFilter, users]);

  // Handle Delete
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("User deleted successfully");
      getUsers(); // Refresh list
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    setUpdatingId(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("User role updated successfully");
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.warn("No users to export.");
      return;
    }

    const csvData = users.map(user => ({
      'ID': user.id,
      'Name': user.name,
      'Email': user.email,
      'Role': user.role,
      'Mobile': user.mobile,
      'Verified': user.verified ? 'Yes' : 'No',
      'Address': `"${user.address?.replace(/\n/g, ' ')}"`
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  const roles = ["all", "user", "admin", "superadmin", "staff"];

  return (
    <div className="p-6 md:p-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex flex-wrap gap-2">
          {/* Role Filter Buttons */}
          {roles.map((role) => (
            <Button
              key={role}
              size="sm"
              variant={roleFilter === role ? "default" : "outline"}
              onClick={() => setRoleFilter(role)}
              className={`capitalize ${roleFilter === role ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
            >
              {role}
            </Button>
          ))}
          {/* Export Button */}
          <Button onClick={handleExportCSV} size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-2">
            <FaDownload className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableCaption>List of registered users ({filteredUsers.length})</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
               <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No users found.</TableCell></TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FaCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <FaTimesCircle /> Unverified
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    {/* Role Dropdown */}
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updatingId === user.id || user.role === 'superadmin'}
                      className="text-sm border rounded p-1 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      // Disable if deleting, if superadmin, OR IF VERIFIED
                      disabled={deletingId === user.id || user.role === 'superadmin' || user.verified}
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 disabled:opacity-50"
                      title={user.verified ? "Cannot delete verified user" : "Delete User"}
                    >
                      {deletingId === user.id ? "..." : <FaTrash />}
                    </Button>
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

export default Page;