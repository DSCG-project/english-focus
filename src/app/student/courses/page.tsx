"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function CoursesPage() {
  const { courses } = useEnglishContent();

  return (
    <StudentShell>
      <div className="ef-section-head">
        <h1 className="ef-section-title">Courses</h1>
      </div>

      <div className="ef-card-grid">
        {courses.map((course, index) => (
          <article className="ef-course-card" key={course.id}>
            <div className={index % 2 === 0 ? "ef-course-img" : "ef-course-img dark"} />

            <h3>{course.title}</h3>

            <div className="ef-teacher">
              <span className="ef-avatar" />
              <span>{course.teacher}</span>
            </div>

            <span className="ef-tag">{course.tag}</span>

            <Link href={`/student/courses/${course.id}`} className="ef-card-btn">
              View course
            </Link>
          </article>
        ))}
      </div>
    </StudentShell>
  );
}
