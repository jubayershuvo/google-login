"use client";
export default function Home() {
  window.location.href = process.env.PUBLIC_REDIRECT_URI as string;
}

