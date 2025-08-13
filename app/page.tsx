// app/page.tsx

import Carousel from "../components/Carousel";
import FeaturedCourses from "../components/FeaturedCourses";
import AboutSection from "../components/AboutSection";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-sky-50 to-white">
      <Carousel />
      <FeaturedCourses />
      <AboutSection />
    </div>
  );
}
