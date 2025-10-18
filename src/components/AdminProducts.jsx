"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProduct } from "@/context/ProductContext";
import Link from "next/link";

const AdminProducts = () => {
  const { books, deletePost, getBook } = useProduct();

  return (
    <Table>
      <TableCaption>A list of Products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Derails</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books?.map((item, id) => {
          return (
            <TableRow key={id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell className="">
                <p className="w-[150px] truncate">{item.details}</p>
              </TableCell>
              <TableCell>{item.inventory}</TableCell>
              <TableCell>{item.instock ? "in Stock" : "Stopped"}</TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/editpage/${item.id}`}>Edit</Link>
              </TableCell>
              <TableCell
                className="text-right cursor-pointer text-red-600 hover:underline"
                onClick={async () => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete "${item.name}"?`
                    )
                  ) {
                    await deletePost(item.id);
                    getBook();
                  }
                }}>
                Delete
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminProducts;
