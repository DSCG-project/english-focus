"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";
import { useEnglishStudents } from "@/lib/useEnglishStudents";

type TestResult = {
  score: number;
  total: number;
  finishedAt: string;
};

function resultKey(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

function lessonNumber(title: string) {
  const match = title.match(/Lesson\s+(\d+)/i);
  return match ? Number(match[1]) : 999;
}

export default function StudentDashboardPage() {
  const { courses, lessons } = useEnglishContent();
  const { students } = useEnglishStudents();

  const [results, setResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  const student = students.find((item) => item.status === "Active") || students[0];

  const activeCourse =
    courses.find((course) => course.id === student?.courseId) ||
    courses.find((course) => course.id === "b1-intermediate") ||
    courses[0];

  const activeLessons = useMemo(() => {
    if (!activeCourse) return [];

    return lessons
      .filter((lesson) => lesson.courseId === activeCourse.id)
      .sort((a, b) => lessonNumber(a.title) - lessonNumber(b.title));
  }, [lessons, activeCourse]);

  const completedLessonIds = new Set(
    Object.keys(results)
      .filter((key) => key.startsWith(`${activeCourse?.id || ""}__`))
      .map((key) => key.split("__")[1])
  );

  const nextLesson =
    activeLessons.find((lesson) => !completedLessonIds.has(lesson.id)) ||
    activeLessons[0];

  const recentResults = Object.entries(results)
    .map(([key, value]) => {
      const [courseId, lessonId] = key.split("__");
      const lesson = lessons.find((item) => item.courseId === courseId && item.id === lessonId);
      const course = courses.find((item) => item.id === courseId);

      return {
        key,
        course,
        lesson,
        ...value,
      };
    })
    .filter((item) => item.lesson && item.course)
    .sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime())
    .slice(0, 4);

  const businessCourses = courses.filter((course) => course.level === "Business English").slice(0, 6);
  const levelCourses = courses.filter((course) => course.level !== "Business English").slice(0, 6);

  const testsCompleted = Object.keys(results).length;
  const averageScore =
    recentResults.length > 0
      ? Math.round(
          recentResults.reduce((total, item) => total + (item.score / item.total) * 100, 0) /
            recentResults.length
        )
      : 0;

  return (
    <StudentShell>
      <section className="ef-student-home-hero">
        <div>
          <span className="ef-course-eyebrow">Student workspace</span>
          <h1>Welcome back{student?.name ? `, ${student.name.split(" ")[0]}` : ""}</h1>
          <p>Continue your English course, review your tests and explore Business English subjects.</p>

          <div className="ef-student-home-actions">
            {nextLesson && activeCourse && (
              <Link href={`/student/courses/${activeCourse.id}/${nextLesson.id}`} className="ef-primary-action">
                Continue learning
              </Link>
            )}

            <Link href="/student/courses" className="ef-secondary-action">
              Course library
            </Link>
          </div>
        </div>

        <aside className="ef-current-learning-card">
          <span>Current course</span>
          <h2>{activeCourse?.title || "No course assigned"}</h2>
          <p>{nextLesson?.title || "No lesson available"}</p>

          <div className="ef-card-progress">
            <span style={{ width: `${Math.min(100, Math.max(0, activeCourse?.progress || 0))}%` }} />
          </div>
        </aside>
      </section>

      <div className="ef-student-kpis">
        <div>
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>{lessons.length}</strong>
        </div>
        <div>
          <span>Tests completed</span>
          <strong>{testsCompleted}</strong>
        </div>
        <div>
          <span>Average score</span>
          <strong>{averageScore}%</strong>
        </div>
      </div>

      <div className="ef-student-home-grid">
        <section className="ef-student-home-panel">
          <div className="ef-section-head">
            <div>
              <h2 className="ef-section-title">General English</h2>
              <p className="ef-section-subtitle">A1 to C2 structured learning path.</p>
            </div>

            <Link href="/student/courses" className="ef-mini-secondary">
              View all
            </Link>
          </div>

          <div className="ef-compact-course-list">
            {levelCourses.map((course) => {
              const total = lessons.filter((lesson) => lesson.courseId === course.id).length;

              return (
                <Link href={`/student/courses/${course.id}`} className="ef-compact-course-row" key={course.id}>
                  <span>{course.level.split(" ")[0]}</span>
                  <div>
                    <strong>{course.title}</strong>
                    <small>{total} lessons</small>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="ef-student-home-panel">
          <div className="ef-section-head">
            <div>
              <h2 className="ef-section-title">Business English</h2>
              <p className="ef-section-subtitle">Professional subjects and workplace language.</p>
            </div>

            <Link href="/student/courses?level=Business%20English" className="ef-mini-secondary">
              View all
            </Link>
          </div>

          <div className="ef-business-chip-grid">
            {businessCourses.map((course) => (
              <Link href={`/student/courses/${course.id}`} className="ef-business-chip" key={course.id}>
                {course.tag}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="ef-student-home-panel">
        <div className="ef-section-head">
          <div>
            <h2 className="ef-section-title">Recent test results</h2>
            <p className="ef-section-subtitle">Latest scores from your completed QCM tests.</p>
          </div>

          <Link href="/student/quizzes" className="ef-mini-secondary">
            Tests
          </Link>
        </div>

        <div className="ef-result-row-list">
          {recentResults.map((item) => (
            <article className="ef-result-row" key={item.key}>
              <div>
                <strong>{item.lesson?.title}</strong>
                <span>{item.course?.title}</span>
              </div>

              <b>{item.score}/{item.total}</b>
            </article>
          ))}

          {recentResults.length === 0 && (
            <div className="ef-empty-mini">No completed test yet.</div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
