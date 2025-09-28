"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { requestOtp, verifyOtp, registerUser } from "@/src/features/auth/authThunks";
import { closeAuthModal, setAuthStep } from "@/src/features/auth/authSlice";

export default function AuthModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthModalOpen, authStep, emailForOtp, loading, error } = useSelector((state: RootState) => state.auth);

  // Local state for form inputs
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // For the initial email input

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(requestOtp(email));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the local email state if emailForOtp is not yet set
    dispatch(verifyOtp({ email: emailForOtp || email, otp }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // 👇 FIX: Send the 'emailForOtp' from the Redux state
    dispatch(registerUser({
        email: emailForOtp, // This is the verified email
        name,
        phone,
        password,
    }));
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={() => dispatch(closeAuthModal())}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {authStep === 'email' && "Login or Signup"}
          {authStep === 'otp' && "Enter OTP"}
          {authStep === 'register' && "Complete Your Registration"}
        </h2>

        {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

        {/* Email Step */}
        {authStep === 'email' && (
          <form onSubmit={handleRequestOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {authStep === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-center text-gray-600 mb-4">An OTP was sent to {emailForOtp || email}</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Registration Step */}
        {authStep === 'register' && (
          <form onSubmit={handleRegister}>
             <input value={emailForOtp} disabled className="w-full p-2 border rounded mb-2 bg-gray-100 text-gray-500"/>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            <button
              type="submit"
              disabled={loading || !name || !phone || !password}
              className="w-full rounded-lg bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}