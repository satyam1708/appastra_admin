// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
