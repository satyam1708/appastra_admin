// app/layout.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../src/store/store";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {/* Navbar */}
            <Navbar />

            <div className="flex">
              {/* Fixed Sidebar */}
              <div className="fixed top-[64px] left-0 w-64 h-[calc(100vh-64px)] bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
                <Sidebar />
              </div>

              {/* Scrollable Content */}
              <div className="ml-64 flex flex-col flex-1 min-h-[calc(100vh-64px)]">
                <main className="flex-grow p-6 overflow-y-auto">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
