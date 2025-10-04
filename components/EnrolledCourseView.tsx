// components/EnrolledCourseView.tsx
import { Batch, Subject, Class as ClassType } from "@/src/types";
import { BookOpen, Video, FileText } from "lucide-react";
import Link from "next/link";

// No changes needed for ClassItem, it's already perfect.
const ClassItem = ({ cls }: { cls: ClassType }) => {
  const isLive = cls.isLive;
  const hasRecording = cls.videoUrl;
  const isUpcoming = !isLive && !hasRecording;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <Video size={18} className={isLive ? "text-red-500 animate-pulse" : "text-gray-500"} />
        <div>
          <p className="font-medium">{cls.title}</p>
          <p className="text-xs text-gray-500">{cls.description}</p>
        </div>
      </div>
      <div>
        {isLive && (
          <Link href={`/class/${cls.id}`} className="px-3 py-1 text-sm bg-red-600 text-white rounded-full shadow-sm hover:bg-red-700">
            Join Live
          </Link>
        )}
        {hasRecording && !isLive && (
          <Link href={`/class/${cls.id}`} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700">
            Watch Recording
          </Link>
        )}
        {isUpcoming && (
          <span className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-full">
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
};

export default function EnrolledCourseView({ batch }: { batch: Batch }) {
  // ✅ Handle both classes within subjects and classes directly on the batch
  const directClasses = batch.classes?.filter(cls => !cls.subjectId) || [];

  return (
    <div id="course-content" className="space-y-6">
      <h2 className="text-2xl font-bold text-sky-800">Batch Content: {batch.name}</h2>
      
      {/* Render subjects and their classes */}
      {batch.subjects?.map((subject: Subject) => (
        <div key={subject.id} className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            {subject.name}
          </h3>
          <div className="space-y-2 pl-4 border-l-2 border-blue-200">
            {subject.classes?.map((cls: ClassType) => (
              <ClassItem key={cls.id} cls={cls} />
            ))}
          </div>
        </div>
      ))}

      {/* ✅ Render classes that are directly part of the batch */}
      {directClasses.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
           <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Video size={20} className="text-blue-600" />
            Additional Classes
          </h3>
          <div className="space-y-2 pl-4 border-l-2 border-blue-200">
            {directClasses.map((cls: ClassType) => (
              <ClassItem key={cls.id} cls={cls} />
            ))}
          </div>
        </div>
      )}

      {/* Message if no content is found */}
      {(!batch.subjects || batch.subjects.length === 0) && directClasses.length === 0 && (
         <p className="text-center text-gray-500 py-8">No subjects or classes have been added to this batch yet.</p>
      )}
    </div>
  );
}