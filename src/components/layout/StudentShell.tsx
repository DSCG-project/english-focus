"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useEnglishContent } from "@/lib/useEnglishContent";

function isActive(pathname: string, href: string) {
  if (href === "/student") return pathname === "/student";
  return pathname.startsWith(href);
}

function SideIcon({ type }: { type: string }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "dashboard") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (type === "courses") {
    return (
      <svg {...common}>
        <path d="M4 7h16" />
        <path d="M4 17h16" />
        <path d="M6 7l-2 10" />
        <path d="M20 7l-2 10" />
      </svg>
    );
  }

  if (type === "events") {
    return (
      <svg {...common}>
        <rect x="5" y="5" width="14" height="14" rx="3" />
      </svg>
    );
  }

  if (type === "learning") {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="m5 5 14 14" />
        <path d="m19 5-14 14" />
      </svg>
    );
  }

  if (type === "account") {
    return (
      <svg {...common}>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  if (type === "help") {
    return (
      <svg {...common}>
        <path d="M9.5 9a2.7 2.7 0 1 1 4.9 1.6c-.9 1-2.4 1.4-2.4 3.2" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { courses, lessons } = useEnglishContent();

  const firstQuizLesson = useMemo(() => {
    return lessons.find((lesson) => (lesson.quiz?.length || 0) > 0) || lessons[0];
  }, [lessons]);

  const activeCourse =
    courses.find((course) => course.id === firstQuizLesson?.courseId) ||
    courses.find((course) => course.id === "a1-beginner") ||
    courses[0];

  const menu = [
    { label: "Dashboard", href: "/student", icon: "dashboard" },
    { label: "Courses", href: "/student/courses", icon: "courses" },
    { label: "Events", href: "/student/events", icon: "events" },
    { label: "Learning", href: "/student/learning", icon: "learning" },
    { label: "Account", href: "/student/account", icon: "account" },
    { label: "Help", href: "/student/help", icon: "help" },
  ];

  const testHref = firstQuizLesson
    ? `/student/courses/${firstQuizLesson.courseId}/${firstQuizLesson.id}/test`
    : "/student/quizzes";

  return (
    <div className="ef-app">
      <aside className="ef-sidebar">
        <Link href="/student" className="ef-brand">
          <strong>English</strong> Focus<span className="ef-brand-dot">.</span>
        </Link>

        <nav className="ef-side-menu">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "ef-side-link active" : "ef-side-link"}
            >
              <span className="ef-side-icon">
                <SideIcon type={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <Link href={testHref} className="ef-test-btn refined">
          Test Your English
        </Link>

        <div className="ef-progress-box refined">
          <h3>Learning Progress</h3>
          <div className="ef-progress-separator" />

          <span>Current Course</span>
          <strong>{activeCourse?.title || "No course selected"}</strong>

          <div className="ef-progress-track">
            <div style={{ width: `${Math.min(100, Math.max(0, activeCourse?.progress || 0))}%` }} />
          </div>

          <div className="ef-progress-meta">
            <small>{activeCourse?.progress || 0}%</small>
            <small>Continue</small>
          </div>
        </div>
      </aside>

      <main className="ef-main">
        <header className="ef-topbar refined">
          <div className="ef-topbar-fill" />

          <button className="ef-word-clean" type="button">
            <span>Word of the Day</span>
            <strong>Last</strong>
            <small>⌄</small>
          </button>

          <button className="ef-notif-clean" type="button" aria-label="Notifications">
            <BellIcon />
            <b>1</b>
          </button>

          <Link href="/" className="ef-signout refined">
            Sign Out
          </Link>
        </header>

        <div className="ef-content">{children}</div>
      </main>
    </div>
  );
}
