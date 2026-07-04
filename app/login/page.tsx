"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  await signIn("credentials", {
    email,
    password,
    callbackUrl: "/dashboard",
    redirect: true,
  });
};

const handleGithubLogin = async () => {
  await signIn("github", {
    callbackUrl: "/dashboard",
  });
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Login to continue
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* GitHub Login */}
        <button
          type="button"
          onClick={handleGithubLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.7.5.7 5.7.7 12.2c0 5.2 3.4 9.6 8.1 11.1.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 2 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.6-.3-5.3-1.3-5.3-6a4.7 4.7 0 011.2-3.3 4.3 4.3 0 01.1-3.2s1-.3 3.3 1.2a11 11 0 016 0C17.3 5.2 18.3 5.5 18.3 5.5a4.3 4.3 0 01.1 3.2 4.7 4.7 0 011.2 3.3c0 4.7-2.7 5.7-5.3 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.2 11.2 0 0023.3 12C23.3 5.7 18.3.5 12 .5z" />
          </svg>

          Continue with GitHub
        </button>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}