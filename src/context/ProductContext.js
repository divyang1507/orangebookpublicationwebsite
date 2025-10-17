// src/app/context/ProductContext.jsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";




const ProductContext = createContext();
const ProductProvider = ({ children }) => {
  const supabase = createClient();
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------
  // Fetch all books
  // ----------------------------
  const getBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("books").select("*");
      if (error) throw error;
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  // ----------------------------
  // Fetch single book by ID
  // ----------------------------
  const fetchBook = async (id) => {
    setBook(null);
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setBook(data);
    } catch (err) {
      console.error("Error fetching book:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Upload images to Supabase Storage
  // ----------------------------
  const uploadImages = async (imageFiles) => {
    if (!imageFiles || imageFiles.length === 0) return [];

    const uploadedImages = [];

    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const baseName = file.name.replace(`.${ext}`, "").replace(/\s+/g, "-");
      const fileName = `${baseName}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from("bookimages").upload(fileName, file);
      if (error) throw error;

      uploadedImages.push({
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bookimages/${fileName}`,
        path: fileName,
      });
    }

    return uploadedImages;
  };

  // ----------------------------
  // Add new book
  // ----------------------------
  const addBook = async ({ name, details, price, inventory, instock, images }) => {
    setLoading(true);
    setError(null);
    try {
      const imageObjs = await uploadImages(images);
      const { data, error } = await supabase.from("books").insert([
        { name, details, price, inventory, instock, images: imageObjs },
      ]);
      if (error) throw error;
      await getBooks();
      return data;
    } catch (err) {
      console.error("Error adding book:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Update book
  // ----------------------------
  const editBook = async (id, updatedBook) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("books")
        .update(updatedBook)
        .eq("id", id)
        .select();
      if (error) throw error;
      setBook(data[0]);
      await getBooks();
      return { success: true };
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Delete book
  // ----------------------------
  const deleteBook = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
      await getBooks();
      return true;
    } catch (err) {
      console.error("Error deleting book:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Delete image from Supabase Storage
  // ----------------------------
  const deleteImage = async (filePath) => {
    try {
      const { error } = await supabase.storage.from("bookimages").remove([filePath]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting image:", err);
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        books,
        book,
        loading,
        error,
        getBooks,
        fetchBook,
        addBook,
        editBook,
        deleteBook,
        uploadImages,
        deleteImage,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);

export default ProductProvider;
