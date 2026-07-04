"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";

interface FavouriteItem {
  _id: string;
  name: string;
  image: string;
  price: number;
}

export default function Favourites() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [favorites, setFavorites] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getFavorites = async () => {
    if (!userId) return;

    try {
      const { data } = await axios.post("/api/user/favorites/get", {
        userId,
      });

      // Guard against null entries (e.g. deleted products left in the array)
      setFavorites((data || []).filter(Boolean));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (productId: string) => {
    if (!userId) return;

    try {
      await axios.post("/api/user/favorites/remove", {
        userId,
        productId,
      });

      setFavorites((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!userId) return;

    try {
      await axios.post("/api/user/cart/add", {
        userId,
        productId,
        quantity: 1,
      });

      alert("Added to cart!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getFavorites();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, userId]);

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 rounded-xl border bg-white px-4 py-2 shadow-sm hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-bold">
              <Heart className="fill-red-500 text-red-500" />
              My Favorites
            </h1>

            <p className="mt-2 text-gray-500">
              {favorites.length} saved products
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow">
            <Heart size={60} className="mx-auto mb-4 text-gray-300" />

            <h2 className="text-2xl font-bold">No favorites yet</h2>

            <p className="mt-2 text-gray-500">
              Save products you like to view them later.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-semibold">{item.name}</h2>

                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    ${item.price}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => addToCart(item._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-white hover:bg-indigo-700"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeFavourite(item._id)}
                      className="rounded-xl border border-red-200 p-3 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}