"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";


export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await axios.post("/api/upload", formData);

      const imageUrl = uploadRes.data.url;

      // Save product to MongoDB
      await axios.post("/api/products", {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        image: imageUrl,
      });

      alert("Product Added Successfully!");

      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
      });

      setImage(null);
      setPreview("");
    } catch (error: any) {
  console.error(error);

  if (error.response) {
    console.log(error.response.data);
    alert(error.response.data.message || JSON.stringify(error.response.data));
  } else {
    alert(error.message);
  }
}
  };

  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-lg border p-3"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        {/* Image Upload */}
        <div>
          <label className="mb-2 block font-medium">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-60 w-full rounded-lg object-cover"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}