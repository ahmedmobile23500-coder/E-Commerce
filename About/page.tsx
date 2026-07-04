"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
              About Our Store
            </span>

            <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Your Trusted Destination for the Latest Technology
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are committed to providing high-quality tech products at
              affordable prices. From smartphones and laptops to gaming
              accessories and smart gadgets, our goal is to make technology
              accessible for everyone.
            </p>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              Customer satisfaction is at the heart of everything we do. We
              carefully select every product to ensure quality, reliability,
              and value, while delivering a smooth and secure shopping
              experience.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer rounded-xl border border-gray-200 p-5 shadow-sm transition"
              >
                <h3 className="text-3xl font-bold text-blue-600">500+</h3>
                <p className="mt-2 text-gray-600">Products Available</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer rounded-xl border border-gray-200 p-5 shadow-sm transition"
              >
                <h3 className="text-3xl font-bold text-blue-600">1000+</h3>
                <p className="mt-2 text-gray-600">Happy Customers</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="overflow-hidden rounded-2xl shadow-xl cursor-pointer"
          >
            <img
              src="/about-tech.jpg"
              alt="Tech Store"
              className="h-full w-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}