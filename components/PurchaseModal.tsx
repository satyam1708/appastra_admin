// components/PurchaseModal.tsx
"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { validateCoupon } from '@/src/features/payment/paymentThunks';
import { clearCoupon } from '@/src/features/payment/paymentSlice';
import { Course } from '@/src/types';
import PaymentButton from './PaymentButton';

interface PurchaseModalProps {
  course: Course;
  onClose: () => void;
}

export default function PurchaseModal({ course, onClose }: PurchaseModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { coupon, discount, loading, error } = useSelector((state: RootState) => state.payment);
  const [couponCode, setCouponCode] = useState('');

  const GST_RATE = 0.18; // 18% GST
  const basePrice = course.price || 0;
  const gstAmount = (basePrice - discount) * GST_RATE;
  const totalPrice = (basePrice - discount) + gstAmount;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(validateCoupon({ code: couponCode, price: basePrice }));
    }
  };

  const handlePaymentSuccess = (response: any) => {
    console.log("Payment successful from modal:", response);
    alert("Payment successful! You are now enrolled.");
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-sky-900">{course.name}</h2>

        {/* Coupon Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter Coupon Code"
            className="flex-grow p-2 border rounded-md"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        {/* Price Details */}
        <div className="space-y-2 text-gray-700 mb-6">
          <div className="flex justify-between">
            <span>Price</span>
            <span>₹{basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Net Discount</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>+ ₹{gstAmount.toFixed(2)}</span>
          </div>
          <hr className="my-2"/>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <PaymentButton
            amount={totalPrice * 100} // Amount in paise
            onSuccess={handlePaymentSuccess}
            courseId={course.id}
            couponCode={coupon?.code} // Pass the validated coupon code
          />
          <button
            onClick={() => {
              dispatch(clearCoupon());
              onClose();
            }}
            className="w-full text-center p-3 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}