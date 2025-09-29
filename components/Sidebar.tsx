//src/appastra_frontend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { logout } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";
import {
  Home, BookOpen, Video, FileText, HelpCircle, Book,
  History, ClipboardList, Layers, ShoppingCart, Settings, LogOut
} from "lucide-react";

const menuItems = [
  { name: "Home Page", path: "/", icon: Home },
  { name: "Paid Courses", path: "/courses/paid-courses", icon: BookOpen },
  { name: "Free Courses", path: "/courses/free-courses", icon: BookOpen },
  { name: "Test Series", path: "/test-series", icon: ClipboardList },
  { name: "YouTube PDF", path: "/youtube-pdf", icon: Video },
  { name: "Free Quiz", path: "/free-quiz", icon: HelpCircle },
  { name: "NCERT Books", path: "/ncert-books", icon: Book },
  { name: "Previous Year", path: "/previous-year", icon: History },
  { name: "Syllabus", path: "/syllabus", icon: FileText },
  { name: "Free Test Series", path: "/free-test-series", icon: Layers },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <aside className="bg-primary-light w-64 min-h-screen border-r border-gray-200 sticky top-0 hidden md:flex flex-col px-4 py-6 shadow-lg">
      <h2 className="text-lg font-bold mb-6 text-primary tracking-wide">
        MAIN MENU
      </h2>

      <nav className="flex flex-col space-y-2">
        {menuItems.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-primary font-primary shadow-md"
                  : "font-primary-lightest-bg hover:bg-primary-light"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          );
        })}
      </nav>
      {isAuthenticated && (
        <div className="mt-6">
          <hr className="my-4 border-gray-300" />
          <nav className="flex flex-col space-y-2">
            <Link href="/purchases" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${pathname === '/purchases' ? "bg-primary font-primary shadow-md" : "font-primary-lightest-bg hover:bg-primary-light"}`}>
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Purchases</span>
            </Link>
            <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${pathname === '/settings' ? "bg-primary font-primary shadow-md" : "font-primary-lightest-bg hover:bg-primary-light"}`}>
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 font-primary-lightest-bg hover:bg-primary-light">
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </aside>
  );
}
