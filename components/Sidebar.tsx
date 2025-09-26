//src/appastra_frontend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Book,
  History,
  ClipboardList,
  Layers,
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
    </aside>
  );
}
