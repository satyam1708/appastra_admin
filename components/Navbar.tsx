"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import AuthModal from "./AuthModal";
import { loadFromStorage, logout } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
      <div className="text-xl font-bold text-black flex items-center">
        <Link href="/">
          <Image
            src="/images/image.png"
            alt="AppAstra Logo"
            width={50}
            height={50}
            className="inline-block mr-2 rounded-full border-2 border-blue-600 shadow-md hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <span>AppAstra</span>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!token ? (
          <>
            <AuthModal type="signup" />
            <AuthModal type="login" />
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}