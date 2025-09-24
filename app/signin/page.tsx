"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign in to Your Account</h1>

      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/dashboard", // redirect after login
          })
        }
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>

      {status === "loading" && (
        <p className="mt-4 text-gray-500">Checking authentication...</p>
      )}
    </div>
  );
}
