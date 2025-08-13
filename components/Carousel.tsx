// components/Carousel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/img1.png",
  "/images/img2.png",
  "/images/img3.png",
  "/images/img4.png",
  "/images/img5.png",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[520px] rounded-3xl shadow-lg overflow-hidden border border-blue-100">
      <Image
        src={images[current]}
        alt={`Slide ${current + 1}`}
        fill
        className="object-cover transition-transform duration-700 ease-in-out"
        priority
        draggable={false}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
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
