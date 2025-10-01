// components/Carousel.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Course, Batch } from "@/src/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define a type for the items in the carousel
type CarouselItem = {
  batch: Batch;
  course: Course;
};

export default function Carousel({ courses }: { courses: Course[] }) {
  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseGoal
  );
  const [current, setCurrent] = useState(0);

  // Memoize the list of batches to show in the carousel
  const carouselItems: CarouselItem[] = useMemo(() => {
    if (selectedCourse) {
      return selectedCourse.batches.map((batch) => ({
        batch,
        course: selectedCourse,
      }));
    }
    return courses.flatMap((course) =>
      course.batches.map((batch) => ({ batch, course }))
    );
  }, [courses, selectedCourse]);

  const totalItems = carouselItems.length;

  const prev = () =>
    setCurrent((curr) => (curr === 0 ? totalItems - 1 : curr - 1));
  const next = () =>
    setCurrent((curr) => (curr === totalItems - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (totalItems > 1) {
      const slideInterval = setInterval(next, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [totalItems]);

  if (!carouselItems || totalItems === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto h-64 md:h-96 lg:h-[520px] rounded-3xl shadow-lg bg-gray-200 flex items-center justify-center animate-pulse">
        {/* Placeholder for when batches are loading */}
      </div>
    );
  }

  const currentItem = carouselItems[current];
  const courseTypePath = currentItem.course.isPaid
    ? "paid-courses"
    : "free-courses";
  const discount =
    currentItem.batch.mrp && currentItem.batch.price
      ? ((currentItem.batch.mrp - currentItem.batch.price) /
          currentItem.batch.mrp) *
        100
      : 0;

  return (
    <div className="relative w-full max-w-7xl mx-auto h-64 md:h-96 lg:h-[520px] rounded-3xl shadow-lg overflow-hidden group">
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {carouselItems.map((item, i) => (
          <Link
            key={item.batch.id + i}
            href={`/courses/${
              item.course.isPaid ? "paid-courses" : "free-courses"
            }/${item.course.slug}`}
            className="w-full flex-shrink-0 h-full relative"
          >
            <Image
              src={
                item.batch.imageUrl ||
                item.course.imageUrl ||
                `/images/img${(i % 5) + 1}.png`
              }
              alt={item.batch.name}
              fill
              className="object-cover"
              priority={i === 0}
              draggable={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
              <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg mb-2">
                {item.batch.name}
              </h2>
              <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-2xl">
                {item.batch.description || item.course.description}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold text-white">
                  {item.batch.price ? `₹${item.batch.price}` : "Free"}
                </span>
                {item.batch.mrp &&
                  item.batch.price &&
                  item.batch.mrp > item.batch.price && (
                    <span className="text-gray-300 line-through">
                      ₹{item.batch.mrp}
                    </span>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {totalItems > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Bottom Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              idx === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}