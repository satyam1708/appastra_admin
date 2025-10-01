// components/BatchCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Batch, Course } from "@/src/types";

interface BatchCardProps {
  batch: Batch;
  course: Course;
}

export default function BatchCard({ batch, course }: BatchCardProps) {
  const courseTypePath = batch.isPaid ? "paid-courses" : "free-courses";
  const discount =
    batch.mrp && batch.price
      ? ((batch.mrp - batch.price) / batch.mrp) * 100
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <Link href={`/courses/${courseTypePath}/${course.slug}`}>
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={batch.imageUrl ||  "/images/img1.png"}
            alt={batch.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-sky-900 mb-2 line-clamp-2">
            {batch.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.description}
          </p>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {batch.price ? `₹${batch.price}` : "Free"}
              </span>
              {batch.mrp && batch.price && batch.mrp > batch.price && (
                <span className="text-gray-500 line-through">₹{batch.mrp}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-green-600 text-sm font-semibold">
                {discount.toFixed(2)}% off
              </div>
            )}
          </div>
          <span className="w-full text-center px-4 py-2 block bg-blue-600 text-white text-sm rounded-full shadow-md hover:bg-blue-700 transition">
            View Details
          </span>
        </div>
      </Link>
    </div>
  );
}