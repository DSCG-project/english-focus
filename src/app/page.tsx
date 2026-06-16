import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function HomePage() {
  return (
    <div className="ef-public">
      <PublicHeader />

      <main className="ef-public-hero">
        <section>
          <h1 className="ef-public-title">
            Learn English with a <span>premium course platform.</span>
          </h1>

          <p className="ef-public-text">
            English Focus is inspired by modern English learning platforms:
            courses, lessons, progress tracking, events, quizzes and a clean student dashboard.
          </p>

          <div className="ef-public-actions">
            <Link href="/student" className="ef-public-btn primary">Open Dashboard</Link>
            <Link href="/student/courses" className="ef-public-btn">View Courses</Link>
          </div>
        </section>

        <aside className="ef-public-preview">
          <div className="ef-hero-course">
            <h2 className="ef-user-name">Welcome</h2>
            <div className="ef-underline" />
            <div className="ef-current-label">Current Course</div>
            <div className="ef-current-title">B1 - Intermediate English Course</div>
            <div className="ef-course-progress">
              <span style={{ width: "73%" }} />
            </div>
            <small>44/60</small>
            <button className="ef-continue">Continue with course</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
