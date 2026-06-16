import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { courses, recommended } from "@/data/english";

export default function CoursesPage() {
  const allCourses = [...courses, ...recommended];

  return (
    <StudentShell>
      <div className="ef-section-head">
        <h1 className="ef-section-title">Courses</h1>
      </div>

      <div className="ef-card-grid">
        {allCourses.map((course, index) => (
          <article className="ef-course-card" key={course.id}>
            <div className={index % 2 === 0 ? "ef-course-img" : "ef-course-img dark"} />

            <h3>{course.title}</h3>

            <span className="ef-tag">
              {"tag" in course ? course.tag : "General English"}
            </span>

            <Link href="/student/courses/b2" className="ef-card-btn">
              View course
            </Link>
          </article>
        ))}
      </div>
    </StudentShell>
  );
}
