"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CustomerExperience() {
  const testimonials = [
    {
      name: "Ali Khan",
      role: "Verified Customer",
      image: "https://i.pravatar.cc/150?img=12",
      review:
        "Excellent service and genuine products. My laptop arrived on time, securely packaged, and exactly as described.",
    },
    {
      name: "Sarah Ahmed",
      role: "Tech Enthusiast",
      image: "https://i.pravatar.cc/150?img=32",
      review:
        "The shopping experience was smooth from start to finish. Great prices, responsive support, and fast delivery.",
    },
    {
      name: "Usman Malik",
      role: "Returning Customer",
      image: "https://i.pravatar.cc/150?img=15",
      review:
        "I've ordered multiple accessories from this store and the quality has always exceeded my expectations.",
    },
  ];

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-base font-semibold text-blue-600">
            Customer Experience
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-gray-900 md:text-6xl">
            Trusted by Thousands of Happy Customers
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-600">
            We deliver premium technology products with secure shopping and
            excellent customer support you can trust.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer rounded-3xl border border-gray-200 bg-white p-10 shadow-md transition-all duration-300 hover:shadow-2xl"
            >
              {/* Review */}
              <p className="text-lg leading-9 text-gray-600">
                "{item.review}"
              </p>

              {/* Stars (animated glow effect) */}
              <div className="mt-8 text-2xl text-yellow-400 transition-all duration-300 hover:scale-110">
                ★★★★★
              </div>

              {/* Customer */}
              <div className="mt-8 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full border-2 border-blue-600 object-cover"
                />

                <div className="ml-5">
                  <h4 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-base text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 rounded-3xl bg-blue-600 p-12 shadow-xl"
        >
          <div className="grid gap-10 text-center text-white md:grid-cols-4">
            <div>
              <h3 className="text-5xl font-extrabold">10K+</h3>
              <p className="mt-3 text-lg text-blue-100">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-5xl font-extrabold">5K+</h3>
              <p className="mt-3 text-lg text-blue-100">Products Sold</p>
            </div>

            <div>
              <h3 className="text-5xl font-extrabold">99%</h3>
              <p className="mt-3 text-lg text-blue-100">Positive Reviews</p>
            </div>

            <div>
              <h3 className="text-5xl font-extrabold">24/7</h3>
              <p className="mt-3 text-lg text-blue-100">Customer Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}