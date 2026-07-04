"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface CartItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null); // NEW: disable buttons mid-request

  const userId = session?.user?.id; // NEW: real user id instead of placeholder

  const getCart = async () => {
    try {
      if (!userId) return;

      const { data } = await axios.post("/api/user/cart/get", {
        userId,
      });

      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") getCart();
  }, [status]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  // NEW: update quantity (+1 / -1). If quantity would drop to 0, remove the item instead.
  const updateQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }

    setUpdatingId(productId);

    // optimistic update
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    try {
      // ⚠️ ASSUMPTION: adjust endpoint/payload to match your actual API.
      await axios.post("/api/user/cart/update", {
        userId,
        productId,
        quantity: newQty,
      });
    } catch (error) {
      console.error(error);
      getCart(); // revert to server state on failure
    } finally {
      setUpdatingId(null);
    }
  };

  // NEW: remove item entirely from cart
  const removeFromCart = async (productId: string) => {
    setUpdatingId(productId);

    const prevCart = cart; // keep for rollback
    setCart((prev) => prev.filter((item) => item.product._id !== productId));

    try {
      // ⚠️ ASSUMPTION: adjust endpoint/payload to match your actual API.
      await axios.post("/api/user/cart/remove", {
        userId,
        productId,
      });
    } catch (error) {
      console.error(error);
      setCart(prevCart); // revert on failure
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:-translate-x-1 hover:bg-gray-100 hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-500">
            Review your selected items before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              🛒
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything yet.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-5 lg:col-span-2">
              {cart.map((item) => {
                const isUpdating = updatingId === item.product._id; // NEW

                return (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-28 w-28 rounded-xl border object-cover"
                      />

                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {item.product.name}
                        </h2>

                        <p className="mt-2 text-gray-500">
                          Price
                        </p>

                        <p className="text-lg font-bold text-indigo-600">
                          ${item.product.price.toFixed(2)}
                        </p>

                        {/* NEW: quantity controls */}
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity - 1)
                            }
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity + 1)
                            }
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          {/* NEW: delete button */}
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            disabled={isUpdating}
                            className="ml-3 flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                        Qty: {item.quantity}
                      </span>

                      <p className="mt-5 text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-2xl font-bold text-gray-900">
                        $
                        {(item.product.price * item.quantity).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-8 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="mt-3 w-full rounded-xl border border-gray-300 py-4 font-medium transition hover:bg-gray-100"
                >
                  Continue Shopping
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                  🔒 Secure checkout with encrypted payment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}