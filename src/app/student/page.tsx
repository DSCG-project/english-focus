import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { courses, recommended, events } from "@/data/english";

export default function StudentDashboard() {
  return (
    <StudentShell>
      <section className="ef-hero-course">
        <h1 className="ef-user-name">Cheikh</h1>
        <div className="ef-underline" />

        <div className="ef-current-label">Current Course</div>
        <div className="ef-current-title">B1 - Intermediate English Course</div>

        <div className="ef-course-progress">
          <span style={{ width: "73%" }} />
        </div>

        <small style={{ marginTop: 8 }}>44/60 lessons completed</small>

        <Link href="/student/courses/b2" className="ef-continue">
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
            {courses.map((course) => (
              <article className="ef-course-card" key={course.id}>
                <div className="ef-course-img" />
                <h3>{course.title}</h3>

                <div className="ef-card-progress">
                  <span style={{ width: `${(course.progress / course.total) * 100}%` }} />
                </div>

                <div className="ef-card-meta">
                  <span>{course.progress}/{course.total}</span>
                  <span>{Math.round((course.progress / course.total) * 100)}%</span>
                </div>

                <Link href={`/student/courses/${course.id === "b1" ? "b2" : course.id}`} className="ef-card-btn">
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
            {recommended.map((item, index) => (
              <article className="ef-course-card" key={item.id}>
                <div className={index === 0 ? "ef-course-img dark" : "ef-course-img"} />

                <div className="ef-teacher">
                  <span className="ef-avatar" />
                  <span>{item.teacher}</span>
                </div>

                <span className="ef-lock">Locked · {item.subscription}</span>
                <br />
                <span className="ef-preview">Preview ◉</span>

                <h3>{item.title}</h3>
                <span className="ef-tag">{item.tag}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="ef-two-cols">
        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">New Courses</h2>
            <div className="ef-arrows">
              <button className="ef-arrow">‹</button>
              <button className="ef-arrow">›</button>
            </div>
          </div>

          <div className="ef-card-grid">
            <article className="ef-course-card">
              <div className="ef-course-img" />
              <h3>Speaking Confidence</h3>
              <span className="ef-tag">Speaking</span>
            </article>

            <article className="ef-course-card">
              <div className="ef-course-img dark" />
              <h3>Grammar Booster</h3>
              <span className="ef-tag">Grammar</span>
            </article>
          </div>
        </section>

        <section>
          <div className="ef-section-head">
            <h2 className="ef-section-title">Upcoming Events</h2>
          </div>

          <div className="ef-events">
            {events.map((event) => (
              <article className="ef-event-card" key={event.title}>
                <div className="ef-event-date">{event.date}</div>
                <h3 className="ef-event-title">{event.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
