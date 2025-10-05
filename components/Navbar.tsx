// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { openAuthModal } from "@/src/features/auth/authSlice";
import AuthModal from "./AuthModal";
import ProfileDropdown from "./ProfileDropdown";
import ThemeSwitcher from "./ThemeSwitcher"; // Import the switcher
import { Menu } from 'lucide-react';
import Image from "next/image";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <header className="bg-card sticky top-0 z-40 border-b">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button onClick={onMenuClick} className="md:hidden p-2">
                <Menu />
              </button>
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-xl font-bold">
                 <Image src="/images/image.png" alt="AppAstra Logo" width={32} height={32} className="rounded-full" />
                 <span className="hidden sm:inline">AppAstra Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <button 
                  onClick={() => dispatch(openAuthModal())} 
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <AuthModal />
    </>
  );
}