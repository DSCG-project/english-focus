"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const { courses, lessons } = useEnglishContent();

  const courseId = params.courseId;
  const course = courses.find((item) => item.id === courseId);
  const courseLessons = lessons.filter((lesson) => lesson.courseId === courseId);

  if (!course) {
    return (
      <StudentShell>
        <section className="ef-event-card">
          <h1>Course not found</h1>
          <p>This course may have been deleted from the admin content builder.</p>
          <Link href="/student/courses" className="ef-card-btn" style={{ width: "fit-content", padding: "0 18px" }}>
            Back to courses
          </Link>
        </section>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <section className="ef-course-detail-card">
        <div>
          <h1 className="ef-course-detail-title">
            {course.title}
          </h1>
          <div className="ef-detail-underline" />

          <p className="ef-detail-text">
            {course.description}
          </p>

          <div className="ef-pills">
            <span className="ef-pill">{course.level}</span>
            <span className="ef-pill">{course.tag}</span>
            <span className="ef-pill">{course.teacher}</span>
          </div>

          <h2 className="ef-progress-title">Your Progress</h2>

          <div className="ef-course-progress">
            <span style={{ width: `${(course.progress / Math.max(course.total, 1)) * 100}%` }} />
          </div>

          <p><u>{course.progress} / {course.total} lessons completed</u></p>

          <button className="ef-assessment">Start Assessment</button>
        </div>

        <aside className="ef-teacher-card">
          <div className="ef-teacher-photo" />
          <div>
            {course.teacher.split(" ")[0]}<br />
            {course.teacher.split(" ").slice(1).join(" ") || "Teacher"}
          </div>
        </aside>
      </section>

      <button className="ef-description-toggle">
        <span>+</span>
        Show Description
      </button>

      <h2 className="ef-lessons-title">Course Lessons</h2>

      <div className="ef-lesson-list">
        {courseLessons.length === 0 && (
          <div className="ef-event-card">
            No lessons have been added to this course yet.
          </div>
        )}

        {courseLessons.map((lesson, index) => (
          <div className="ef-lesson-row" key={`${lesson.courseId}-${lesson.id}`}>
            <div className="ef-lesson-no">{index + 1}</div>

            <div className="ef-lesson-title">
              Lesson {String(index + 1).padStart(2, "0")} - {lesson.title}
            </div>

            <Link href={`/student/courses/${course.id}/${lesson.id}`} className="ef-view-btn" style={{ display: "grid", placeItems: "center" }}>
              {lesson.status === "Published" ? "View Again" : "Preview"}
            </Link>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}
