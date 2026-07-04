"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/cartSlice";
import { useSession } from "next-auth/react";
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
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // track favorited product ids (loaded from server, not just optimistic)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // simple toast/alert state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    getProducts();
    loadCart();
    loadFavorites();
  }, [status]); // re-run when auth status resolves/changes

  // 🛒 GET PRODUCTS
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

  const loadCart = async () => {
    try {
      if (status !== "authenticated") return;

      const { data } = await axios.post("/api/user/cart/get");

      dispatch(setCart(data));
    } catch (error) {
      console.log(error);
    }
  };

  // load which products are already favorited, so the button
  // shows red on page load/refresh, not just after clicking it.
  const loadFavorites = async () => {
    try {
      if (status !== "authenticated") return;

      const { data } = await axios.post("/api/user/favorites/get", {
        userId: session?.user?.id, // ✅ route requires this in the body
      });

      // ⚠️ ASSUMPTION: adjust if your favorites array shape differs.
      // Handles: data = [{ _id }] (full product objects, populated)
      // or data = [{ product: { _id } }] or [{ productId }]
      const items = data ?? [];
      const ids = items.map(
        (i: any) => i.product?._id || i.productId || i._id
      );
      setFavorites(new Set(ids));
    } catch (error) {
      console.log(error);
    }
  };

  // 🛒 ADD TO CART (PROTECTED)
  const addToCart = async (productId: string) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      await axios.post("/api/user/cart", {
        productId,
      });

      loadCart();
      showToast("✅ Product added to cart");
    } catch (error) {
      console.log(error);
      showToast("❌ Failed to add product");
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/favorites/toggle", {
        userId: session?.user?.id,
        productId,
      });

      console.log(data.message);

      // flip local favorite state optimistically
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-slate-50 px-8 py-12 relative overflow-hidden">
      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Latest Products
            </h1>
            <p className="text-slate-500 mt-1">
              Discover our newest tech collection
            </p>
          </div>

          <Link href="/view-products">
            <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
              View All
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </motion.div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-60 w-full rounded-xl bg-slate-200" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
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
          {filteredProducts.slice(0, 4).map((product) => {
            const isFavorite = favorites.has(product._id);

            return (
              <motion.div
                key={product._id}
                variants={item}
                whileHover={{ y: -6 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
              >
                <Link href={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 w-full object-cover transition group-hover:scale-105"
                  />
                </Link>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <h2 className="truncate font-semibold text-slate-800">
                      {product.name}
                    </h2>

                    <span className="font-bold text-green-600">
                      ${product.price}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product._id)}
                      className="flex-1 rounded-xl bg-blue-600 py-2 text-white text-sm hover:bg-blue-700"
                    >
                      🛒 Add
                    </button>

                    <button
                      onClick={() => toggleFavorite(product._id)}
                      className={`flex-1 rounded-xl py-2 text-sm transition ${
                        isFavorite
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      ❤️ {isFavorite ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}