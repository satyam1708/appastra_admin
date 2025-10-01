// components/BatchCard.tsx
"use client";

import Link from "next/link";
import { Batch, Course } from "@/src/types";

interface BatchCardProps {
  batch: Batch;
  course: Course;
}

export default function BatchCard({ batch, course }: BatchCardProps) {
  const courseTypePath = course.isPaid ? "paid-courses" : "free-courses";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <Link href={`/courses/${courseTypePath}/${course.slug}`}>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-sky-900 mb-2 line-clamp-2">
            {batch.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            Part of {course.name}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600">
              {course.isPaid ? `₹${course.price}` : "Free"}
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full shadow-md hover:bg-blue-700 transition">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}