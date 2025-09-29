// components/PaymentButton.tsx - UPDATED
"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { createPaymentOrder } from '@/src/features/payment/paymentThunks';
import useRazorpay from '@/src/hooks/useRazorpay';
import { fetchUserEnrollments } from '@/src/features/enrollments/enrollmentThunks';

interface PaymentButtonProps {
  courseId: string;
  amount: number; // Final amount in paise
  couponCode?: string;
  onSuccess: () => void; // A function to close the modal
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ courseId, amount, couponCode, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const razorpayLoaded = useRazorpay();
  const { profile } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.payment);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK is not loaded yet. Please try again.");
      return;
    }

    // 1. Create order on the backend
    const result = await dispatch(createPaymentOrder({ courseId, couponCode }));

    if (createPaymentOrder.fulfilled.match(result)) {
      const order = result.payload;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount.toString(),
        currency: "INR",
        name: "AppAstra",
        description: "Course Payment",
        order_id: order.id, // Use order_id from your backend
        handler: function (response: any) {
          // Payment is successful, backend webhook will handle enrollment
          alert("Payment successful! You are now enrolled.");
          dispatch(fetchUserEnrollments()); // Refresh user enrollments
          onSuccess(); // Close the modal
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || '',
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
    } else {
        // @ts-ignore
      alert(`Error: ${result.payload || 'Could not create payment order.'}`);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!razorpayLoaded || loading}
      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${amount / 100}`}
    </button>
  );
};

export default PaymentButton;