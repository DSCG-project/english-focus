import type { ReactNode } from "react";
import Link from "next/link";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="ef-shell">
      <aside className="ef-sidebar">
        <Link href="/admin" className="ef-logo">
          <span className="ef-logo-mark">E</span>
          <span>Admin</span>
        </Link>

        <nav className="ef-menu">
          <Link className="active" href="/admin">Dashboard</Link>
          <Link href="/admin/levels">Levels</Link>
          <Link href="/admin/content">Content</Link>
          <Link href="/admin/videos">Videos</Link>
          <Link href="/admin/pdf">PDF</Link>
          <Link href="/admin/quizzes">Quizzes</Link>
          <Link href="/admin/students">Students</Link>
          <Link href="/admin/packs">Plans</Link>
        </nav>

        <div className="ef-shell-footer">
          <strong>Back office</strong>
          <span>Manage lessons, videos, PDFs, quizzes, plans and students.</span>
        </div>
      </aside>

      <main className="ef-main">{children}</main>
    </div>
  );
}
