"use client";
import { FaFacebook, FaMinus, FaPlus, FaRegStar, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/context/ProductContext";
import { HashLoader } from "react-spinners";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Import toast for notifications

const Page = () => {
  const { fetchBook, book, loading } = useProduct();
  const { addToCart, loading: cartLoading } = useCart();
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchBook(id);
    }
  }, [id]);

  useEffect(() => {
    if (book?.images?.length > 0) {
      setActiveImage(book.images[0].url);
    }
  }, [book]);

  // --- UPDATED: Handle Quantity Change with Inventory Check ---
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      const maxInventory = Number(book?.inventory) || 1;

      // Prevent going below 1
      if (newQuantity < 1) return 1;

      // Prevent going above inventory
      if (newQuantity > maxInventory) {
        toast.warn(`Only ${maxInventory} items left in stock!`);
        return maxInventory;
      }

      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (book) {
      // Pass the full book object for the optimized CartContext
      addToCart(book, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  // Safe inventory check
  const inventoryCount = Number(book?.inventory) || 0;
  const isOutOfStock = inventoryCount === 0;

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12">
      {book && (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left - Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-6 w-full lg:w-1/2">
            <div className="flex lg:flex-col gap-3 justify-center items-center overflow-x-auto lg:overflow-y-auto">
              {book?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  width={70}
                  height={90}
                  alt={`Thumbnail ${index + 1}`}
                  className={`rounded-md cursor-pointer transition-all duration-300 border-2 ${
                    activeImage === image.url
                      ? "border-orange-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveImage(image.url)}
                />
              ))}
            </div>

            <div className="flex justify-center items-center w-full">
              <img
                className="rounded-xl max-h-[500px] object-contain"
                src={activeImage || book?.images?.[0]?.url}
                alt={book?.name}
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <h2 className="text-sm text-gray-500 uppercase tracking-widest">
                Orange Book Publication
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                {book?.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <FaRegStar className="text-yellow-400" />
                <span>{book?.rating ?? "4.5"} / 5</span>
              </div>
              <span className="text-gray-400">|</span>
              <span>{book?.review ?? "100"}+ Reviews</span>
              {/* Inventory Status Badge */}
              {isOutOfStock ? (
                <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Out of Stock</span>
              ) : (
                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">In Stock ({inventoryCount})</span>
              )}
              
              <div className="flex items-center gap-3 text-xl ml-auto">
                <FaFacebook className="hover:text-blue-600 transition" />
                <FaTwitter className="hover:text-sky-500 transition" />
                <Link
                  href="https://www.youtube.com/@orangebookpublication9051"
                  target="_blank">
                  <FaYoutube className="hover:text-red-600 transition" />
                </Link>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {book?.details}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-orange-600">
                ₹ {book?.price}
              </span>

              <div className="flex flex-col items-center gap-4">
                 {/* Quantity Adjuster */}
                 <div className="flex items-center border rounded">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(-1)}
                        className="rounded-r-none"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1 || isOutOfStock} 
                    >
                        <FaMinus/>
                    </Button>
                    <span className="px-4 text-center w-16">{quantity}</span>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(1)}
                        className="rounded-l-none"
                        aria-label="Increase quantity"
                        // Disable if out of stock OR if quantity reached inventory limit
                        disabled={isOutOfStock || quantity >= inventoryCount} 
                    >
                       <FaPlus/>
                     </Button>
                 </div>

                 {/* Add to Cart Button */}
                 <Button
                    onClick={handleAddToCart}
                    // Disable if loading OR out of stock
                    disabled={cartLoading || isOutOfStock} 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                 >
                    {isOutOfStock ? 'Out of Stock' : (cartLoading ? 'Adding...' : 'Add to Cart')}
                 </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;