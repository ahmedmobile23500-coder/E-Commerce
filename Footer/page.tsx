"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">
              TechStore
            </h2>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-white transition">
              Products
            </Link>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} TechStore
          <div>
          All Right Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}