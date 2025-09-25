"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInClient() {
  useEffect(() => {
    const addCount = async () => {
      try {
        await fetch("/api/increaseVisitor", {
          method: "POST",
        });
      } catch (error) {
        console.error(error);
      }
    };
    addCount();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-gray-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome Back</h1>
        <p className="text-gray-300 mb-8">Sign in to access your account</p>

        {/* Official-style Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="relative flex items-center justify-center w-full gap-3 font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition duration-200 bg-white text-gray-700"
        >
          {/* Google Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 48 48"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.94 0 6.61 1.7 8.13 3.12l5.96-5.83C34.08 3.92 29.46 2 24 2 14.86 2 7.1 7.93 4.06 16.17l6.91 5.36C12.39 14.5 17.72 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24.5c0-1.61-.14-3.11-.39-4.5H24v9.02h12.7c-.55 2.96-2.24 5.47-4.77 7.16l7.42 5.77C43.89 38.62 46.5 32.08 46.5 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.97 28.04a14.5 14.5 0 0 1 0-8.08l-6.91-5.36A22.42 22.42 0 0 0 1.5 24c0 3.64.87 7.08 2.56 10.12l6.91-5.36z"
            />
            <path
              fill="#EA4335"
              d="M24 46c6.46 0 11.87-2.13 15.83-5.77l-7.42-5.77c-2.06 1.39-4.72 2.24-8.41 2.24-6.28 0-11.61-5-12.99-11.03l-6.91 5.36C7.1 40.07 14.86 46 24 46z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
