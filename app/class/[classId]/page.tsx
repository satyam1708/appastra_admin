// app/class/[classId]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchClassesBySubject } from "@/src/features/classes/classesThunks";
import { fetchLiveSessions } from "@/src/features/live/liveThunks";

interface PageProps {
  params: { classId: string };
}

export default function ClassPlayerPage({ params }: PageProps) {
  const { classId } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { classesBySubject, loading: classesLoading } = useSelector((state: RootState) => state.classes);
  const { sessionsByClass, loading: liveLoading } = useSelector((state: RootState) => state.live);

  // Find the class from the Redux store
  const currentClass = Object.values(classesBySubject).flat().find(c => c.id === classId);
  const liveSession = sessionsByClass[classId]?.[0];

  useEffect(() => {
    // This is a simplified way to ensure class data is loaded.
    // In a real-world app, you might have a more direct way to fetch a single class.
    if (!currentClass) {
        // You might need to fetch all subjects and then all classes,
        // or have a dedicated endpoint to get a single class by ID.
        // For this example, we'll assume the data might be partially there.
    }
    dispatch(fetchLiveSessions(classId));
  }, [dispatch, classId, currentClass]);

  const isLoading = classesLoading || liveLoading;
  const videoUrl = currentClass?.isLive ? liveSession?.playbackUrl : currentClass?.videoUrl;
  const videoType = currentClass?.isLive ? 'application/x-mpegURL' : 'video/mp4';

  if (isLoading) return <p className="text-center p-10">Loading class...</p>;
  if (!currentClass) return <p className="text-center p-10 text-red-500">Class not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{currentClass.title}</h1>
      <div className="aspect-video bg-black rounded-lg shadow-lg">
        {videoUrl ? (
          <video controls autoPlay className="w-full h-full rounded-lg" key={videoUrl}>
            <source src={videoUrl} type={videoType} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>Video content is not available for this class yet.</p>
          </div>
        )}
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">About this class</h2>
        <p className="text-gray-700">{currentClass.description}</p>
      </div>
    </div>
  );
}