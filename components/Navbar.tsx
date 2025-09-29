// components/Navbar.tsx - REWRITTEN
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { openAuthModal, loadTokenFromStorage, logout } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import ProfileDropdown from "./ProfileDropdown";
import { Search, Menu, X } from 'lucide-react';

// ✅ NEW: Expanded search mapping with labels for the UI
const searchRoutes: { label: string; path: string; keywords: string[] }[] = [
  { label: 'Paid Courses', path: '/courses/paid-courses', keywords: ['course', 'courses', 'paid'] },
  { label: 'Free Courses', path: '/courses/free-courses', keywords: ['free course', 'free'] },
  { label: 'Test Series', path: '/test-series', keywords: ['test', 'series'] },
  { label: 'My Courses', path: '/purchases', keywords: ['purchase', 'my course'] },
  { label: 'Settings', path: '/settings', keywords: ['setting', 'profile'] },
  { label: 'Syllabus', path: '/syllabus', keywords: ['syllabus'] },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{label: string; path: string}[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadTokenFromStorage());
    setIsClient(true);
  }, [dispatch]);

  // ✅ NEW: Live search logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const results = searchRoutes.filter(route => 
        route.keywords.some(keyword => keyword.startsWith(query))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].path); // Go to the first result on Enter
      setSearchQuery('');
      setSearchResults([]);
    }
  };

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
                <span className="hidden sm:inline">AppAstra</span>
              </Link>
            </div>

            {/* Global Search Bar */}
            <div className="flex-1 flex justify-center px-2 lg:ml-6" ref={searchRef}>
              <div className="max-w-lg w-full lg:max-w-md">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search for courses, tests..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  {/* ✅ NEW: Search results dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                      <ul className="py-1">
                        {searchResults.map(result => (
                          <li key={result.path}>
                            <Link href={result.path} onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {result.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Auth buttons / Profile Icon for Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isClient && (
                isAuthenticated ? (
                  <>
                    <ProfileDropdown />
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => dispatch(openAuthModal())} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                      Login
                    </button>
                    <button onClick={() => dispatch(openAuthModal())} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Signup
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4">
            {isClient && (
              isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <span className="font-medium">My Account</span>
                  <div className="flex items-center space-x-4">
                    <ProfileDropdown />
                     <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                    <button onClick={() => {dispatch(openAuthModal()); setIsMenuOpen(false);}} className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                      Login
                    </button>
                    <button onClick={() => {dispatch(openAuthModal()); setIsMenuOpen(false);}} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Signup
                    </button>
                </div>
              )
            )}
          </div>
        )}
      </header>
    </>
  );
}