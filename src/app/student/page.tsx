"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function StudentDashboard() {
  const { courses, publishedLessons } = useEnglishContent();

  const activeCourses = courses.filter((course) => course.status === "Active").slice(0, 2);
  const recommended = courses.filter((course) => course.status !== "Active").slice(0, 2);
  const currentCourse = activeCourses[0] || courses[0];

  return (
    <StudentShell>
      <section className="ef-hero-course">
        <h1 className="ef-user-name">Welcome Cheikh</h1>
        <div className="ef-underline" />

        <div className="ef-current-label">Current Course</div>
        <div className="ef-current-title">{currentCourse?.title || "English Focus Course"}</div>

        <div className="ef-course-progress">
          <span style={{ width: `${currentCourse ? (currentCourse.progress / Math.max(currentCourse.total, 1)) * 100 : 0}%` }} />
        </div>

        <small style={{ marginTop: 8 }}>
          {currentCourse?.progress || 0}/{currentCourse?.total || 0}
        </small>

        <Link href={`/student/courses/${currentCourse?.id || "b2-upper-intermediate"}`} className="ef-continue">
          Continue with course
        </Link>
      </section>

      <div className="ef-two-cols">
        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">Your Courses</h2>
            <div className="ef-arrows">
              <button className="ef-arrow">‹</button>
              <button className="ef-arrow">›</button>
            </div>
          </div>

          <div className="ef-card-grid">
            {activeCourses.map((course) => (
              <article className="ef-course-card" key={course.id}>
                <div className="ef-course-img" />
                <h3>{course.title}</h3>

                <div className="ef-card-progress">
                  <span style={{ width: `${(course.progress / Math.max(course.total, 1)) * 100}%` }} />
                </div>

                <div className="ef-card-meta">
                  <span>{course.progress}/{course.total}</span>
                  <span>{course.tag}</span>
                </div>

                <Link href={`/student/courses/${course.id}`} className="ef-card-btn">
                  Continue with course
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">Recommended for You</h2>
            <div className="ef-arrows">
              <button className="ef-arrow">‹</button>
              <button className="ef-arrow">›</button>
            </div>
          </div>

          <div className="ef-card-grid">
            {recommended.map((course, index) => (
              <article className="ef-course-card" key={course.id}>
                <div className={index === 0 ? "ef-course-img dark" : "ef-course-img"} />

                <div className="ef-teacher">
                  <span className="ef-avatar" />
                  <span>{course.teacher}</span>
                </div>

                <span className="ef-lock">Locked · {course.status}</span>
                <br />
                <span className="ef-preview">Preview ◉</span>

                <h3>{course.title}</h3>
                <span className="ef-tag">{course.tag}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="ef-two-cols">
        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">Latest Lessons</h2>
            <div className="ef-arrows">
              <button className="ef-arrow">‹</button>
              <button className="ef-arrow">›</button>
            </div>
          </div>

          <div className="ef-card-grid">
            {publishedLessons.slice(0, 2).map((lesson, index) => (
              <article className="ef-course-card" key={`${lesson.courseId}-${lesson.id}`}>
                <div className={index === 0 ? "ef-course-img" : "ef-course-img dark"} />
                <h3>{lesson.title}</h3>
                <span className="ef-tag">{lesson.skill}</span>
                <Link href={`/student/courses/${lesson.courseId}/${lesson.id}`} className="ef-card-btn">
                  Open lesson
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">Upcoming Events</h2>
          </div>

          <div className="ef-events">
            <article className="ef-event-card">
              <div className="ef-event-date">Tuesday 30 June 2026 2:00 (UTC)</div>
              <h3 className="ef-event-title">Live Speaking Practice</h3>
            </article>

            <article className="ef-event-card">
              <div className="ef-event-date">Thursday 02 July 2026 6:00 (UTC)</div>
              <h3 className="ef-event-title">Business English Workshop</h3>
            </article>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
