import type { ReactNode } from "react";
import Link from "next/link";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="ef-app">
      <aside className="ef-sidebar">
        <Link href="/admin" className="ef-brand">
          <strong>English</strong> Focus<span className="ef-brand-dot">.</span>
        </Link>

        <nav className="ef-side-menu">
          <Link href="/admin" className="ef-side-link active">
            <span className="ef-side-icon">◉</span>
            <span>Dashboard</span>
          </Link>

          <Link href="/admin/content" className="ef-side-link">
            <span className="ef-side-icon">▤</span>
            <span>Content</span>
          </Link>

          <Link href="/admin/videos" className="ef-side-link">
            <span className="ef-side-icon">▶</span>
            <span>Videos</span>
          </Link>

          <Link href="/admin/pdf" className="ef-side-link">
            <span className="ef-side-icon">▣</span>
            <span>PDF Notes</span>
          </Link>

          <Link href="/admin/quizzes" className="ef-side-link">
            <span className="ef-side-icon">?</span>
            <span>Quizzes</span>
          </Link>

          <Link href="/admin/students" className="ef-side-link">
            <span className="ef-side-icon">♙</span>
            <span>Students</span>
          </Link>

          <Link href="/student" className="ef-side-link">
            <span className="ef-side-icon">↗</span>
            <span>Student View</span>
          </Link>
        </nav>

        <button className="ef-test-btn">Admin Workspace</button>

        <div className="ef-progress-box">
          <h3>Content Status</h3>
          <div className="ef-progress-line">
            <div className="ef-progress-label">
              Current setup<br />
              <u>Levels, courses, lessons, videos, PDFs and quizzes</u>
            </div>
            <div className="ef-progress-bar">
              <span style={{ width: "62%" }} />
            </div>
            <div className="ef-progress-bottom">
              <span>MVP</span>
              <span>In progress</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="ef-main">
        <header className="ef-topbar">
          <div className="ef-word">
            <strong>Admin Mode</strong>
            <span className="ef-word-divider" />
            <span>Content management</span>
            <span className="ef-word-arrow">⌄</span>
          </div>

          <div className="ef-notif">♟</div>
          <Link href="/student" className="ef-signout" style={{ display: "grid", placeItems: "center" }}>
            Preview
          </Link>
        </header>

        <div className="ef-content">{children}</div>
      </main>
    </div>
  );
}
