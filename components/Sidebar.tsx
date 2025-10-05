// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, BarChart, Settings, FileText, Bot, X } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Users", path: "/users", icon: Users },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Leads (CRM)", path: "/leads", icon: BarChart },
  { name: "Materials", path: "/materials", icon: FileText },
  { name: "AI Tools", path: "/ai-tools", icon: Bot },
  { name: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`
      fixed md:relative md:translate-x-0 
      inset-y-0 left-0 z-50
      bg-card text-foreground 
      w-64 min-h-screen border-r 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold tracking-wide">
          ADMIN MENU
        </h2>
        <button onClick={() => setOpen(false)} className="md:hidden p-2">
          <X />
        </button>
      </div>

      <nav className="flex flex-col space-y-2 p-4">
        {menuItems.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon size={18} />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}