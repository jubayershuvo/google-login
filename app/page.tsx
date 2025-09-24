"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
    }
  }, []);

  return <p>Redirecting...</p>;
}
