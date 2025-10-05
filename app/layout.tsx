// app/layout.tsx
"use client";

import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, AppDispatch, RootState } from "../src/store/store";
import { usePathname, useRouter } from "next/navigation";
import { loadTokenFromStorage } from "@/src/features/auth/authSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./globals.css";
import '../src/styles/theme.css';

// This is our main gatekeeper component
function AuthLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  // A simple state to manage sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // On initial load, try to get the token from storage
  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);
  
  // This effect handles all the redirection logic
  useEffect(() => {
    // If the token has been checked and the user is NOT authenticated
    // and they are trying to access a page other than /login, redirect them.
    if (token === null && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
    
    // If the user IS authenticated and they are on the login page,
    // redirect them to the dashboard.
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
    }
  }, [isAuthenticated, token, pathname, router]);

  // While checking for token, we can show a loader or nothing
  if (token === null && !isAuthenticated && pathname !== '/login') {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>; // Or a splash screen
  }

  // If not authenticated, only render the children (which will be the Login page)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If authenticated, render the full dashboard layout
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} setOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(p => !p)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// The root layout now provides the Redux store and wraps everything in our AuthLayout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>
        <Provider store={store}>
          <AuthLayout>{children}</AuthLayout>
        </Provider>
      </body>
    </html>
  );
}