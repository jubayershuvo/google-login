"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
      }, 3000);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      {/* Header */}
      <header className="flex justify-between items-center py-6 px-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600">Chat Viewer</h1>
        <nav className="space-x-6">
          <Link
            href="/privacy-policy"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Terms of Service
          </Link>
          <Link
            href="/signin"
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-10 py-20 gap-10">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-indigo-600 mb-6">
            View Your Gmail Inbox <br /> Securely & Read-Only
          </h2>
          <p className="text-gray-700 mb-8 text-lg">
            Gmail Viewer lets you safely read your emails without modifying or
            sending any messages. Fast, simple, and secure.
          </p>
          <Link
            href="/signin"
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>

        <div className="flex-1">
          <img
            src="/landing-illustration.png" // Replace with your own image
            alt="Gmail read-only illustration"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-10 text-center">
          <h3 className="text-4xl font-bold text-indigo-600 mb-12">
            Why Choose Gmail Viewer?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-indigo-50 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">Read-Only Access</h4>
              <p className="text-gray-700">
                We only read emails. No sending, deleting, or modifying
                messages.
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">Fast & Secure</h4>
              <p className="text-gray-700">
                All data is securely accessed and never shared with third
                parties.
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">
                Simple & User-Friendly
              </h4>
              <p className="text-gray-700">
                Clean interface to browse your Gmail inbox effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Gmail Viewer. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
