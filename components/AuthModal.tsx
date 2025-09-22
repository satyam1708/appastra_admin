"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { requestOtp, verifyOtp } from "@/src/features/auth/authThunks";
import { setCredentials } from "@/src/features/auth/authSlice";
import { useRouter } from "next/navigation";

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
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestOtp(email)).unwrap();
      setStep("otp");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await dispatch(verifyOtp({ email, otp })).unwrap();
      dispatch(setCredentials({ user: { email }, token }));
      setOpen(false); // close modal
      router.push("/dashboard");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
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
              {step === "email"
                ? `${type === "login" ? "Login" : "Signup"} with Email`
                : "Enter OTP"}
            </h2>

            {/* Error */}
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            {/* Form */}
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
      )}
    </>
  );
}
