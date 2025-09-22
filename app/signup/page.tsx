"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { requestOtp, verifyOtp } from "@/src/features/auth/authThunks";
import { setCredentials } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: request OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dispatch(requestOtp(email)).unwrap();
      console.log(res);
      setStep("otp");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await dispatch(verifyOtp({ email, otp })).unwrap();

      // Save to redux
      dispatch(setCredentials({ user: { email }, token }));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {step === "email" ? "Login with Email" : "Enter OTP"}
        </h1>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {step === "email" ? (
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
        ) : (
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
      </div>
    </div>
  );
}
