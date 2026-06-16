import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { lessons } from "@/data/english";

export default function CourseDetailPage() {
  return (
    <StudentShell>
      <section className="ef-course-detail-card">
        <div>
          <h1 className="ef-course-detail-title">
            B2 - Upper Intermediate English Course
          </h1>
          <div className="ef-detail-underline" />

          <p className="ef-detail-text">
            Improve your fluency so you can interact effectively with native speakers,
            extend your vocabulary and communicate with more confidence in professional
            and everyday situations.
          </p>

          <div className="ef-pills">
            <span className="ef-pill">CEFR Level: B2</span>
            <span className="ef-pill">IELTS Level: 6.0 - 6.5</span>
            <span className="ef-pill">Cambridge Level: B2 First</span>
          </div>

          <h2 className="ef-progress-title">Your Progress</h2>

          <div className="ef-course-progress">
            <span style={{ width: "86%" }} />
          </div>

          <p><u>52 / 60 lessons completed</u></p>

          <button className="ef-assessment">Start Assessment</button>
        </div>

        <aside className="ef-teacher-card">
          <div className="ef-teacher-photo" />
          <div>
            Stephanie<br />
            Marston
          </div>
        </aside>
      </section>

      <button className="ef-description-toggle">
        <span>+</span>
        Show Description
      </button>

      <h2 className="ef-lessons-title">Course Lessons</h2>

      <div className="ef-lesson-list">
        {lessons.map((lesson, index) => (
          <div className="ef-lesson-row" key={lesson}>
            <div className="ef-lesson-no">{index + 1}</div>

            <div className="ef-lesson-title">
              B2 - Lesson {String(index + 1).padStart(2, "0")} - {lesson}
            </div>

            <Link href="/student/courses/b2/lesson-1" className="ef-view-btn" style={{ display: "grid", placeItems: "center" }}>
              {index < 5 ? "View Again" : "Subscribe"}
            </Link>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}
