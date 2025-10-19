// src/app/context/ProductContext.jsx
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
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

const page = () => {
  const supabase = createClient();
  const [users, setUsers] = useState([]);
  //   const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------
  // Fetch all books
  // ----------------------------
  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <div>
        <Table>
          <TableCaption>A list of Users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>address</TableHead>
              <TableHead>email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, id) => {
              return (
                <TableRow key={id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="">
                    <p className="w-[150px] truncate">{user.mobile}</p>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default page;
