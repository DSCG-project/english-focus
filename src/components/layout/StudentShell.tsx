import type { ReactNode } from "react";
import Link from "next/link";

export function StudentShell({ children }: { children: ReactNode }) {
  return (
    <div className="ef-app">
      <aside className="ef-sidebar">
        <Link href="/student" className="ef-brand">
          <strong>English</strong> Focus<span className="ef-brand-dot">.</span>
        </Link>

        <nav className="ef-side-menu">
          <Link href="/student" className="ef-side-link active">
            <span className="ef-side-icon">◉</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/student/courses" className="ef-side-link">
            <span className="ef-side-icon">▱</span>
            <span>Courses</span>
          </Link>
          <Link href="/student/events" className="ef-side-link">
            <span className="ef-side-icon">□</span>
            <span>Events</span>
          </Link>
          <Link href="/student/learning" className="ef-side-link">
            <span className="ef-side-icon">✺</span>
            <span>Learning</span>
          </Link>
          <Link href="/student/account" className="ef-side-link">
            <span className="ef-side-icon">♙</span>
            <span>Account</span>
          </Link>
          <Link href="/student/help" className="ef-side-link">
            <span className="ef-side-icon">?</span>
            <span>Help</span>
          </Link>
        </nav>

        <button className="ef-test-btn">Test Your English</button>

        <div className="ef-progress-box">
          <h3>Learning Progress</h3>
          <div className="ef-progress-line">
            <div className="ef-progress-label">
              Current Course<br />
              <u>B1 - Intermediate English Course</u>
            </div>
            <div className="ef-progress-bar">
              <span style={{ width: "73%" }} />
            </div>
            <div className="ef-progress-bottom">
              <span>44 / 60</span>
              <span>Continue</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="ef-main">
        <header className="ef-topbar">
          <div className="ef-word">
            <strong>Word of the Day</strong>
            <span className="ef-word-divider" />
            <span>Last</span>
            <span className="ef-word-arrow">⌄</span>
          </div>

          <div className="ef-notif">♟</div>
          <button className="ef-signout">Sign Out</button>
        </header>

        <div className="ef-content">{children}</div>
      </main>
    </div>
  );
}
