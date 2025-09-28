"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { openAuthModal, logout, loadTokenFromStorage } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal"; // Keep this import to ensure the modal is part of the page

export default function Navbar() {
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // This prevents hydration mismatch errors by running only on the client
  useEffect(() => {
    dispatch(loadTokenFromStorage());
    setIsClient(true); 
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <>
      {/* The AuthModal is now placed here, its visibility is controlled by Redux */}
      <AuthModal />
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

          {/* Only render auth state-dependent UI on the client */}
          {isClient && (
            <>
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(openAuthModal())}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => dispatch(openAuthModal())}
                    className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Signup
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="px-4 py-1 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition"
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
            </>
          )}
        </div>
      </nav>
    </>
  );
}