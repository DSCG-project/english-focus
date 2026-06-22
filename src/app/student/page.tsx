"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

type TestResult = {
  score: number;
  total: number;
  finishedAt: string;
};

function resultKey(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function StudentDashboardPage() {
  const { courses, lessons } = useEnglishContent();
  const [results, setResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  const activeCourses = courses.filter((course) => course.status === "Active");
  const currentCourse = activeCourses[0] || courses[0];
  const currentLessons = currentCourse
    ? lessons.filter((lesson) => lesson.courseId === currentCourse.id)
    : [];
  const currentLesson = currentLessons[0];

  const completedTests = lessons.filter((lesson) => results[resultKey(lesson.courseId, lesson.id)]).length;
  const readyResources = lessons.filter((lesson) => lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf).length;

  const recentResults = useMemo(() => {
    return Object.entries(results)
      .map(([key, result]) => {
        const [courseId, lessonId] = key.split("__");
        const lesson = lessons.find((item) => item.courseId === courseId && item.id === lessonId);
        const course = courses.find((item) => item.id === courseId);

        return {
          key,
          result,
          lesson,
          course,
        };
      })
      .filter((item) => item.lesson && item.course)
      .sort((a, b) => new Date(b.result.finishedAt).getTime() - new Date(a.result.finishedAt).getTime())
      .slice(0, 3);
  }, [results, courses, lessons]);

  return (
    <StudentShell>
      <section className="ef-final-dashboard-hero">
        <div>
          <span className="ef-course-eyebrow">Welcome back</span>
          <h1>Continue your English learning</h1>
          <p>
            Watch lessons, open PDF resources and complete QCM tests from your active courses.
          </p>

          <div className="ef-course-hero-actions">
            {currentLesson && (
              <Link href={`/student/courses/${currentCourse.id}/${currentLesson.id}`} className="ef-primary-action">
                Continue learning
              </Link>
            )}

            <Link href="/student/courses" className="ef-secondary-action">
              Browse courses
            </Link>
          </div>
        </div>

        <aside className="ef-dashboard-focus-card">
          <span>Current course</span>
          <strong>{currentCourse?.title || "No course yet"}</strong>
          <p>{currentLessons.length} lessons available</p>
        </aside>
      </section>

      <div className="ef-course-metrics">
        <div>
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>{lessons.length}</strong>
        </div>
        <div>
          <span>Resources ready</span>
          <strong>{readyResources}</strong>
        </div>
        <div>
          <span>Tests completed</span>
          <strong>{completedTests}</strong>
        </div>
      </div>

      <div className="ef-dashboard-grid-final">
        <section className="ef-dashboard-panel-final">
          <div className="ef-section-head">
            <h2 className="ef-section-title">My courses</h2>
            <Link href="/student/courses" className="ef-mini-secondary">View all</Link>
          </div>

          <div className="ef-dashboard-course-list">
            {activeCourses.slice(0, 4).map((course) => {
              const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
              const firstLesson = courseLessons[0];

              return (
                <article className="ef-dashboard-course-row" key={course.id}>
                  <div>
                    <span>{course.level}</span>
                    <h3>{course.title}</h3>
                    <p>{courseLessons.length} lessons · {course.teacher}</p>
                  </div>

                  <div>
                    <Link href={`/student/courses/${course.id}`} className="ef-mini-primary">
                      Open course
                    </Link>

                    {firstLesson && (
                      <Link href={`/student/courses/${course.id}/${firstLesson.id}`} className="ef-mini-secondary">
                        Continue
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="ef-dashboard-panel-final">
          <div className="ef-section-head">
            <h2 className="ef-section-title">Recent scores</h2>
          </div>

          <div className="ef-score-list-final">
            {recentResults.length > 0 ? recentResults.map((item) => (
              <Link
                href={`/student/courses/${item.course!.id}/${item.lesson!.id}/test`}
                className="ef-score-row-final"
                key={item.key}
              >
                <div>
                  <strong>{item.lesson!.title}</strong>
                  <span>{formatDate(item.result.finishedAt)}</span>
                </div>

                <b>{item.result.score}/{item.result.total}</b>
              </Link>
            )) : (
              <div className="ef-empty-mini">
                No test result yet. Complete your first QCM test to see your score here.
              </div>
            )}
          </div>
        </aside>
      </div>
    </StudentShell>
  );
}
