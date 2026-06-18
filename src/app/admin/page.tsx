import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";

export default function AdminPage() {
  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Content administration</h1>
          <p>
            Manage the full English Focus learning structure: levels, courses,
            lessons, video files, PDF notes and quizzes from one clean workspace.
          </p>
        </div>

        <div className="ef-admin-hero-actions">
          <Link href="/admin/content" className="ef-admin-white-btn">
            Open content builder
          </Link>
          <Link href="/student" className="ef-admin-ghost-btn">
            Preview student area
          </Link>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat">
          <span>Levels</span>
          <strong>6</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Courses</span>
          <strong>12</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Lessons</span>
          <strong>86</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Quizzes</span>
          <strong>46</strong>
        </div>
      </div>

      <div className="ef-admin-flow">
        <div className="ef-admin-step active">
          <strong>1. Levels</strong>
          <span>A1, A2, B1, B2, C1, Business English</span>
        </div>
        <div className="ef-admin-step active">
          <strong>2. Courses</strong>
          <span>Organized by level and skill</span>
        </div>
        <div className="ef-admin-step active">
          <strong>3. Lessons</strong>
          <span>Lesson title, objective and description</span>
        </div>
        <div className="ef-admin-step">
          <strong>4. Video / PDF</strong>
          <span>Upload learning resources</span>
        </div>
        <div className="ef-admin-step">
          <strong>5. Quiz</strong>
          <span>Questions, answers and explanations</span>
        </div>
      </div>

      <section className="ef-admin-panel">
        <h2>Next action</h2>
        <p>
          Start from the content builder and create the first real lesson flow.
          This will later be connected to database storage and secure video hosting.
        </p>
        <Link href="/admin/content" className="ef-admin-submit" style={{ display: "inline-flex", alignItems: "center", padding: "0 18px" }}>
          Continue
        </Link>
      </section>
    </AdminShell>
  );
}
