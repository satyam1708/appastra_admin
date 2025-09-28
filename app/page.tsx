// app/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../src/store/store";
import { fetchCourses } from "../src/features/courses/coursesThunks";
import Carousel from "../components/Carousel";
import FeaturedCourses from "../components/FeaturedCourses";
import AboutSection from "../components/AboutSection";
import { Course } from "@/src/types";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    // Fetch courses only if they haven't been loaded yet
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  // Select the first 5 courses for the carousel
  const carouselCourses = courses.slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-sky-50 to-white">
      {loading && courses.length === 0 && (
        <p className="text-center p-10">Loading Courses...</p>
      )}
      {error && <p className="text-center p-10 text-red-500">{error}</p>}
      
      {/* Pass the fetched courses as props */}
      <Carousel courses={carouselCourses} />
      <FeaturedCourses courses={courses} />
      
      <AboutSection />
    </div>
  );
}