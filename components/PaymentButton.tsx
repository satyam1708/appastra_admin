// components/PaymentButton.tsx
"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { createPaymentOrder } from '@/src/features/payment/paymentThunks';
import useRazorpay from '@/src/hooks/useRazorpay';
import { fetchUserEnrollments } from '@/src/features/enrollments/enrollmentThunks';

// Extend the Window interface to include Razorpay
interface CustomWindow extends Window {
    Razorpay: any;
}

declare const window: CustomWindow;


interface PaymentButtonProps {
  courseId: string;
  amount: number; // Final amount in paise
  couponCode?: string;
  onSuccess: () => void; // A function to close the modal
}

// Interface for a failed Razorpay payment
interface RazorpayErrorResponse {
    error: {
        code: number;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id: string;
        }
    }
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

    const result = await dispatch(createPaymentOrder({ courseId, couponCode }));

    if (createPaymentOrder.fulfilled.match(result)) {
      const order = result.payload;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount.toString(),
        currency: "INR",
        name: "AppAstra",
        description: "Course Payment",
        order_id: order.id,
        handler: function () {
          alert("Payment successful! You are now enrolled.");
          dispatch(fetchUserEnrollments());
          onSuccess();
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

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response: RazorpayErrorResponse) {
        alert(`Payment failed: ${response.error.description}`);
      });
    } else {
      // @ts-expect-error - result.payload can be a string or an object
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