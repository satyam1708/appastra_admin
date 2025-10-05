// app/layout.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthModal from "@/components/AuthModal";
import "./globals.css";
import '../src/styles/theme.css'; // We will modify this for theming

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // A simple state to manage sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <html lang="en" className="light"> {/* Default to light mode */}
      <body>
        <Provider store={store}>
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar isOpen={isSidebarOpen} setOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar onMenuClick={() => setIsSidebarOpen(p => !p)} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
                {children}
              </main>
            </div>
          </div>
          <AuthModal />
        </Provider>
      </body>
    </html>
  );
}