// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { requestOtp, verifyOtp, registerUser } from "@/src/features/auth/authThunks";
import { setAuthStep } from "@/src/features/auth/authSlice";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, authStep, emailForOtp, loading, error } = useSelector((state: RootState) => state.auth);

  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect them to the dashboard
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);
  
  // Set the initial step when component mounts
  useEffect(() => {
    dispatch(setAuthStep('email'));
  }, [dispatch]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(requestOtp(email));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyOtp({ email: emailForOtp || email, otp }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email: emailForOtp, name, phone, password }));
  };

  const renderFormStep = () => {
    switch(authStep) {
      case 'otp':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">An OTP was sent to {emailForOtp || email}</p>
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input id="otp" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-lg border bg-background p-3 text-foreground" required />
            </div>
            <button type="submit" disabled={loading || otp.length < 6}
              className="w-full rounded-lg bg-primary p-3 text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        );
      case 'register':
         return (
          <form onSubmit={handleRegister} className="space-y-4">
            <input value={emailForOtp} disabled className="w-full p-3 border rounded-lg bg-muted text-muted-foreground"/>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border bg-background p-3 text-foreground" required />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border bg-background p-3 text-foreground" required />
            <input type="password" placeholder="Set Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-background p-3 text-foreground" required />
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-primary p-3 text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {loading ? "Registering..." : "Register & Continue"}
            </button>
          </form>
        );
      case 'email':
      default:
        return (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-background p-3 text-foreground" required />
            </div>
            <button type="submit" disabled={loading || !email}
              className="w-full rounded-lg bg-primary p-3 text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card rounded-2xl w-full max-w-md p-8 shadow-2xl m-4">
        <div className="flex justify-center mb-6">
          <Image src="/images/image.png" alt="AppAstra Logo" width={60} height={60} className="rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Admin Panel</h2>
        <p className="text-center text-muted-foreground mb-6">Please sign in to continue</p>
        
        {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
        
        {renderFormStep()}
      </div>
    </div>
  );
}