// components/CourseCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Course } from "@/src/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const courseTypePath = course.isPaid ? "paid-courses" : "free-courses";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      {/* 👇 FIX: Use course.slug in the link */}
      <Link href={`/courses/${courseTypePath}/${course.slug}`}>
        {/* ... rest of the component is unchanged */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={course.imageUrl || "/images/img1.png"} 
            alt={course.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-sky-900 mb-2 line-clamp-2">
            {course.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.description || "No description available."}
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