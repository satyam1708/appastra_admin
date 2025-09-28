// components/Carousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/src/types";

// Placeholder images for the carousel
const images = [
  "/images/img1.png",
  "/images/img2.png",
  "/images/img3.png",
  "/images/img4.png",
  "/images/img5.png",
];

export default function Carousel({ courses }: { courses: Course[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % courses.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [courses.length]);

  if (!courses || courses.length === 0) {
    return null; // Don't render if there are no courses
  }

  const coursePath = (course: Course) => course.isPaid ? "paid-courses" : "free-courses";

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[520px] rounded-3xl shadow-lg overflow-hidden border border-blue-100">
      <Link href={`/courses/${coursePath(courses[current])}/${courses[current].id}`}>
        <Image
          src={images[current % images.length]} // Cycle through placeholder images
          alt={courses[current]?.name || "Course Image"}
          fill
          className="object-cover transition-transform duration-700 ease-in-out"
          priority
          draggable={false}
        />
      </Link>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {courses.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full border-2 ${
              idx === current
                ? "bg-blue-700 border-blue-700"
                : "bg-white border-blue-300 hover:bg-blue-300"
            } transition`}
          />
        ))}
      </div>
    </div>
  );
}