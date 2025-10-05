// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Users, BarChart, Settings, ShoppingCart, FileText, Bot
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Users", path: "/users", icon: Users },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Leads (CRM)", path: "/leads", icon: BarChart },
  { name: "Materials", path: "/materials", icon: FileText },
  { name: "Transactions", path: "/transactions", icon: ShoppingCart },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-primary-light w-64 min-h-screen border-r border-gray-200 sticky top-0 hidden md:flex flex-col px-4 py-6 shadow-lg">
      <h2 className="text-lg font-bold mb-6 text-primary tracking-wide">
        ADMIN MENU
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
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
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