// components/ProfileDropdown.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/store/store';
import { logout } from '@/src/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/'); // Redirect to login/dashboard page after logout
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Open user menu"
      >
        <UserIcon className="h-6 w-6 text-gray-700" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
             <LayoutDashboard size={16} /> My Profile
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Settings size={16} /> Settings
          </Link>
          <div className="border-t my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}