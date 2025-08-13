"use client";

import React from "react";
import useRazorpay from "@/src/hooks/useRazorpay";// Adjust the path as necessary

interface PaymentButtonProps {
  amount: number; // amount in INR paise (e.g. 50000 = ₹500)
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  onSuccess,
  onFailure,
}) => {
  const razorpayLoaded = useRazorpay();

  const handlePayment = () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded yet. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "", // Enter your Razorpay Key here
      amount: amount.toString(),
      currency: "INR",
      name: "AppAstra",
      description: "Course Payment",
      handler: (response: any) => {
        onSuccess(response);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#2563eb", // blue-600
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response: any) {
      if (onFailure) onFailure(response.error);
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!razorpayLoaded}
      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
    >
      Pay ₹{amount / 100}
    </button>
  );
};

export default PaymentButton;
