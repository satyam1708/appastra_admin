// AuthModal.js - CORRECTED
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
// 🟢 UPDATED: Import the new registerUser thunk
import { requestOtp, verifyOtp, registerUser } from "@/src/features/auth/authThunks"; 
import { setCredentials } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";
// Removed unnecessary axios import for registration

interface AuthModalProps {
type: "login" | "signup";
}

export default function AuthModal({ type }: AuthModalProps) {
const dispatch = useDispatch<AppDispatch>();
const router = useRouter();
const { token } = useSelector((state: RootState) => state.auth);

const [open, setOpen] = useState(false);
const [email, setEmail] = useState("");
const [otp, setOtp] = useState("");
const [step, setStep] = useState<"email" | "otp" | "register">("email");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");


const handleRequestOtp = async () => {
  setLoading(true);
  setError(null);
  try {
    setStep("email");
    await dispatch(requestOtp(email)).unwrap();
    setStep("otp");
  } catch (err: any) {
    setError(err.message || "Failed to request OTP");
  } finally {
    setLoading(false);
  }
};


// 🟢 FIXED: The logic below is now correct, relying on the updated thunk to return the payload object
const handleVerifyOtp = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await dispatch(verifyOtp({ email, otp })).unwrap();

    if (result?.token) {
      // Existing user: token received, log them in
      dispatch(setCredentials({ user: result.user, token: result.token }));
      setOpen(false);
    } else if (result?.email) {
      // New user: must complete registration
      setEmail(result.email);
      setStep("register"); // Transition to new registration step
    } else {
        // Fallback for an empty/unexpected successful response
        throw new Error("OTP verification failed to determine user status.");
    }
  } catch (err: any) {
    setError(err.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

// 🟢 UPDATED: Use the new Redux thunk for registration
const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
        const result = await dispatch(registerUser({
            email,
            name,
            phone,
            password,
        })).unwrap();

        // Register returns { token, user } on success
        dispatch(setCredentials({ user: result.user, token: result.token }));
        setOpen(false); // Close modal on successful registration
        router.push('/dashboard'); 

    } catch (err: any) {
        // Thunk error handling already extracts the message
        setError(err);
    } finally {
        setLoading(false);
    }
};


return (
  <>
    <button
      onClick={() => {
        setOpen(true);
        setStep("email");
      }}
      className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      {type === "login" ? "Login" : "Signup"}
    </button>

    {/* Modal */}
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-lg">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>

          {/* Modal Header */}
          <h2 className="text-2xl font-bold text-center mb-6">
            {step === "email" && `${type === "login" ? "Login" : "Signup"} with Email`}
            {step === "otp" && "Enter OTP"}
            {step === "register" && "Complete Registration"}
          </h2>

          {/* Error */}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          {/* Form Content */}
          {step === "email" && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              />
              <button
                onClick={handleRequestOtp}
                disabled={loading || !email}
                className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === "register" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              />
              <input
                type="password"
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              />
              <button
                onClick={handleRegister}
                disabled={loading || !name || !phone || !password}
                className="w-full rounded-lg bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register & Continue"}
              </button>
            </>
          )}
        </div>
      </div>
    )}
  </>
);
}