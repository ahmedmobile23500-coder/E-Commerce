"use client";

import React from "react";
import Image from "next/image";
import banner from "../public/banner.jpg";

const Hero = () => {
  const handleScroll = () => {
    const section = document.getElementById("products");

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <Image
        src={banner}
        alt="Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Build Something <br />
          Amazing Today
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-200">
          Create stunning web experiences with modern technologies and
          beautiful designs that leave a lasting impression.
        </p>

        <div className="flex gap-4">
          {/* Smooth Scroll Button */}
          <button
            onClick={handleScroll}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Get Started
          </button>

        </div>
      </div>
    </section>
  );
};

export default Hero;