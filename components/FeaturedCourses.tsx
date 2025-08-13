// components/FeaturedCourses.tsx

import Image from "next/image";
import Link from "next/link";

const courseData = [
  {
    title: "11th Arts Prahar Batch - 2026 🔥",
    image: "/images/img1.png",
    link: "#",
  },
  {
    title: "12th Commerce Warrior Batch - 2026",
    image: "/images/img2.png",
    link: "#",
  },
  {
    title: "Science Zenith Batch - 2026",
    image: "/images/img3.png",
    link: "#",
  },
];

export default function FeaturedCourses() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-center text-sky-900 mb-10 drop-shadow-md">
        ⭐ Featured Courses
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {courseData.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
          >
            <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                draggable={false}
              />
            </div>
            <div className="p-6 flex flex-col justify-between h-[160px]">
              <h3 className="text-xl font-semibold text-sky-900 mb-4 line-clamp-2">
                {course.title}
              </h3>
              <Link
                href={course.link}
                className="self-start px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
