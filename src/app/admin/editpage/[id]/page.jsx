"use client";
import { useProduct } from "@/context/ProductContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

const page = () => {
  const { fetchBook, editBook, book, uploadImages, deleteImage } =
    useProduct();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router for navigation
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    images: [], // unified array
    inventory: "",
    instock: false,
  });

  // Fetch book
  useEffect(() => {
    if (id && typeof id === "string") fetchBook(id);
  }, [id]);

  // Populate form when book is fetched
  useEffect(() => {
    if (book && Object.keys(book).length > 0) {
      const existingImages = (book.images || []).map((img) => ({
        url: img.url,
        path: img.path,
        isNew: false,
      }));

      setFormData({
        name: book.name || "",
        details: book.details || "",
        price: book.price || "",
        images: existingImages,
        inventory: book.inventory || "",
        instock: book.instock || false,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (checked) => {
    setFormData((prev) => ({ ...prev, instock: checked }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = async (index) => {
    const target = formData.images[index];

    if (!target.isNew && target.path) {
      // delete from Supabase bucket
      await deleteImage(target.path);
    }

    setFormData((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload only new files
      const newFiles = formData.images
        .filter((img) => img.isNew)
        .map((img) => img.file);
      const newImageUrls = await uploadImages(newFiles);

      // Keep old ones
      const oldImages = formData.images.filter((img) => !img.isNew);

      const allImages = [
        ...oldImages.map(({ url, path }) => ({ url, path })),
        ...newImageUrls,
      ];

      const payload = {
        name: formData.name,
        details: formData.details,
        price: formData.price,
        inventory: formData.inventory,
        instock: formData.instock,
        images: allImages,
      };

      await editBook(id, payload);
      alert("Book updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!book || Object.keys(book).length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <HashLoader color="#f97316" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 py-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mx-auto w-full max-w-md">
        <div>
          <Label htmlFor="name">Book Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="details">Details</Label>
          <Input
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="images">Upload Images</Label>
          <Input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {/* Unified Image Preview */}
        <div className="flex gap-2 flex-wrap mt-2">
          {formData.images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.isNew ? img.preview : img.url}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="inventory">Inventory</Label>
          <Input
            id="inventory"
            name="inventory"
            type="text"
            value={formData.inventory}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="stock">In Stock</Label>
          <Switch
            id="stock"
            checked={formData.instock}
            onCheckedChange={handleStockChange}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Book"}
        </Button>
      </form>
    </div>
  );
};

export default page;
