"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      console.log("User created:", data);

      setName("");
      setEmail("");
      setPassword("");

      router.push("/login");
    } catch (error: any) {
      console.log("Signup error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = () => {
    console.log("Signup with GitHub");
    // later: signIn("github") if using NextAuth
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign up to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-6 space-y-4">

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2.5 font-semibold text-white transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* GitHub Signup */}
        <button
          onClick={handleGithubSignup}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          {/* GitHub Icon */}
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.7.5.7 5.7.7 12.2c0 5.2 3.4 9.6 8.1 11.1.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 2 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.6-.3-5.3-1.3-5.3-6a4.7 4.7 0 011.2-3.3 4.3 4.3 0 01.1-3.2s1-.3 3.3 1.2a11 11 0 016 0C17.3 5.2 18.3 5.5 18.3 5.5a4.3 4.3 0 01.1 3.2 4.7 4.7 0 011.2 3.3c0 4.7-2.7 5.7-5.3 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.2 11.2 0 0023.3 12C23.3 5.7 18.3.5 12 .5z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}