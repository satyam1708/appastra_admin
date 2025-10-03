// components/EnrolledCourseView.tsx
import { Course, Subject, Class } from "@/src/types";
import { BookOpen, Video, FileText } from "lucide-react";

interface EnrolledCourseViewProps {
  course: Course;
}

export default function EnrolledCourseView({ course }: EnrolledCourseViewProps) {
  return (
    <div id="course-content" className="space-y-6">
      <h2 className="text-2xl font-bold text-sky-800">Course Content</h2>
      {course.subjects?.map((subject: Subject) => (
        <div key={subject.id} className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            {subject.name}
          </h3>
          <div className="space-y-2 pl-4 border-l-2 border-blue-200">
            {subject.classes?.map((cls: Class) => (
              <div key={cls.id}>
                <p className="flex items-center gap-2 font-medium">
                  <Video size={16} className="text-gray-500" />
                  {cls.title}
                </p>
                {/* You can add links to videos and resources here */}
              </div>
            ))}
             {subject.resources?.map((res) => (
              <a href={res.signedUrl} key={res.id} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                 <FileText size={16} />
                 {res.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}