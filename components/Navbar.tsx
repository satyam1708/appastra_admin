// components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { openAuthModal, loadTokenFromStorage } from "@/src/features/auth/authSlice";
import AuthModal from "./AuthModal";
import ProfileDropdown from "./ProfileDropdown";
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);
  
  // A simple state for a potential mobile sidebar toggle, if needed in the future.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(loadTokenFromStorage());
    setIsClient(true);
  }, [dispatch]);

  return (
    <>
      <AuthModal />
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-4">
               {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Image
                  src="/images/image.png"
                  alt="AppAstra Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="hidden sm:inline">AppAstra Admin</span>
              </Link>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Auth buttons / Profile Icon */}
            <div className="flex items-center space-x-4">
              {isClient && (
                isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <button 
                    onClick={() => dispatch(openAuthModal())} 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Login
                  </button>
                )
              )}
            </div>

            {/* Mobile Menu Button (Optional - can be removed if not needed) */}
            <div className="md:hidden flex items-center ml-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}