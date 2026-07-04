"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ✅ SEARCH STATE

  const router = useRouter();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER PRODUCTS BASED ON SEARCH
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-slate-50 px-8 py-12 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-160px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-[120px]" />
        <div className="absolute bottom-[-160px] right-1/2 h-[420px] w-[720px] translate-x-1/2 rounded-full bg-purple-200/30 blur-[120px]" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              Latest Products
            </h1>
            <p className="text-slate-500 mt-1">
              Discover our All tech collection
            </p>
          </div>

          {/* BACK BUTTON */}
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
          >
            ← Back
          </button>
        </div>

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </motion.div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-60 w-full rounded-xl bg-slate-200" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {/* ✅ FILTERED PRODUCTS */}
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
            >
              {/* IMAGE */}
              <Link href={`/products/${product._id}`}>
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* CONTENT */}
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="truncate text-base font-semibold text-slate-800">
                    {product.name}
                  </h2>

                  <span className="font-bold text-green-600">
                    ${product.price}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95">
                    🛒 Add
                  </button>

                  <button className="flex-1 cursor-pointer rounded-xl bg-slate-100 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95">
                    ❤️ Save
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}