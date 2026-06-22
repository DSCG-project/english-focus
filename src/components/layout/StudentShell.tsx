"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useEnglishContent } from "@/lib/useEnglishContent";

type TestResult = {
  score: number;
  total: number;
  finishedAt: string;
};

function resultKey(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

function isActive(pathname: string, href: string) {
  if (href === "/student") return pathname === "/student";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { courses, lessons } = useEnglishContent();
  const [results, setResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, [pathname]);

  const activeCourses = courses.filter((course) => course.status === "Active");
  const currentCourse = activeCourses[0] || courses[0];

  const currentLessons = useMemo(() => {
    if (!currentCourse) return [];
    return lessons.filter((lesson) => lesson.courseId === currentCourse.id);
  }, [lessons, currentCourse]);

  const completedTests = currentLessons.filter((lesson) => {
    return results[resultKey(lesson.courseId, lesson.id)];
  }).length;

  const progressPercent =
    currentLessons.length > 0
      ? Math.round((completedTests / currentLessons.length) * 100)
      : currentCourse?.progress || 0;

  const firstTestLesson = lessons.find((lesson) => (lesson.quiz?.length || 0) > 0);
  const testHref = firstTestLesson
    ? `/student/courses/${firstTestLesson.courseId}/${firstTestLesson.id}/test`
    : "/student/quizzes";

  const menu = [
    {
      label: "Dashboard",
      href: "/student",
      icon: "◉",
    },
    {
      label: "Courses",
      href: "/student/courses",
      icon: "▱",
    },
    {
      label: "Events",
      href: "/student/events",
      icon: "▢",
    },
    {
      label: "Learning",
      href: "/student/learning",
      icon: "✺",
    },
    {
      label: "Account",
      href: "/student/account",
      icon: "♙",
    },
    {
      label: "Help",
      href: "/student/help",
      icon: "?",
    },
  ];

  return (
    <div className="ef-app">
      <aside className="ef-sidebar">
        <div className="ef-sidebar-inner">
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
                <span className="ef-side-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <Link href={testHref} className="ef-test-btn">
            Test Your English
          </Link>

          <section className="ef-progress-box">
            <h3>Learning Progress</h3>

            <div className="ef-progress-line" />

            <span>Current Course</span>

            <Link
              href={currentCourse ? `/student/courses/${currentCourse.id}` : "/student/courses"}
              className="ef-current-course-link"
            >
              {currentCourse?.title || "No active course"}
            </Link>

            <div className="ef-side-progress-track">
              <div style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }} />
            </div>

            <div className="ef-progress-bottom">
              <span>
                {completedTests} / {currentLessons.length || 0}
              </span>

              {currentLessons[0] ? (
                <Link href={`/student/courses/${currentCourse.id}/${currentLessons[0].id}`}>
                  Continue
                </Link>
              ) : (
                <Link href="/student/courses">Courses</Link>
              )}
            </div>
          </section>
        </div>
      </aside>

      <main className="ef-main">
        <header className="ef-topbar">
          <div className="ef-topbar-spacer" />

          <div className="ef-word">
            <strong>Word of the Day</strong>
            <span>Last</span>
            <b>∨</b>
          </div>

          <button className="ef-notif" type="button">
            <span>1</span>
            ♟
          </button>

          <button className="ef-signout" type="button">
            Sign Out
          </button>
        </header>

        <section className="ef-content">
          {children}
        </section>
      </main>
    </div>
  );
}
