"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center mt-10 text-gray-600">
        Loading...
      </h2>
    );
  }

  if (!product) {
    return (
      <h2 className="text-center mt-10 text-red-500">
        Product not found
      </h2>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 rounded-lg bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
      >
        ← Go Back
      </button>

      {/* Product Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-4">
            {product.description}
          </p>

          <p className="text-2xl font-semibold text-orange-600 mt-4">
            ${product.price}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Stock: {product.stock}
          </p>

          <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
