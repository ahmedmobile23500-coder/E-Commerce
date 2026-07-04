"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function NavbarLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navItem = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}
        <Link href="/" className="group">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            <span className="text-blue-600 group-hover:text-blue-700 transition">
              Tech
            </span>
            Store
          </h1>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">

          <div className="flex items-center gap-8 text-sm font-medium">

            {/* HOME */}
            <motion.button
              onClick={() => scrollToSection("hero")}
              initial="hidden"
              animate="show"
              variants={navItem}
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Home
            </motion.button>

            {/* PRODUCTS */}
            <motion.button
              onClick={() => scrollToSection("products")}
              initial="hidden"
              animate="show"
              variants={navItem}
              transition={{ duration: 0.3 }}
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Products
            </motion.button>

            {/* ABOUT */}
            <motion.button
              onClick={() => scrollToSection("about")}
              initial="hidden"
              animate="show"
              variants={navItem}
              transition={{ duration: 0.4 }}
              className="text-slate-600 hover:text-blue-600 transition"
            >
              About Us
            </motion.button>

            {/* REVIEWS */}
            <motion.button
              onClick={() => scrollToSection("reviews")}
              initial="hidden"
              animate="show"
              variants={navItem}
              transition={{ duration: 0.5 }}
              className="text-slate-600 hover:text-blue-600 transition"
            >
               Reviews
            </motion.button>

            {/* CART (NO ANIMATION) */}
            <Link href="/cart" className="text-slate-600 hover:text-blue-600 transition">
              Cart
            </Link>

            {/* FAVOURITES (NO ANIMATION) */}
            <Link href="/favourites" className="text-slate-600 hover:text-blue-600 transition">
              Favourites
            </Link>
          </div>

          {/* USER */}
          {session ? (
            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-sm text-slate-700">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                {userName}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-slate-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 ${
          isOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 text-sm">

          <button onClick={() => scrollToSection("hero")} className="text-left text-slate-600 hover:text-blue-600">
            Home
          </button>

          <button onClick={() => scrollToSection("products")} className="text-left text-slate-600 hover:text-blue-600">
            Products
          </button>

          <button onClick={() => scrollToSection("about")} className="text-left text-slate-600 hover:text-blue-600">
            About Us
          </button>

          <button onClick={() => scrollToSection("reviews")} className="text-left text-slate-600 hover:text-blue-600">
            Customer Reviews
          </button>

          <Link href="/cart" className="text-slate-600 hover:text-blue-600">
            Cart
          </Link>

          <Link href="/favourites" className="text-slate-600 hover:text-blue-600">
            Favourites
          </Link>

          {/* USER MOBILE */}
          {session ? (
            <>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                {userName}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-lg bg-red-500 py-2 text-white font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="rounded-lg bg-blue-600 py-2 font-semibold text-white">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}