"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

function lessonNumber(title: string) {
  const match = title.match(/Lesson\s+(\d+)/i);
  return match ? Number(match[1]) : 999;
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

export default function StudentCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = String(params.courseId || "");

  const { courses, lessons } = useEnglishContent();

  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [query, setQuery] = useState("");

  const course = courses.find((item) => item.id === courseId);

  const allCourseLessons = useMemo(() => {
    return lessons
      .filter((lesson) => lesson.courseId === courseId)
      .sort((a, b) => lessonNumber(a.title) - lessonNumber(b.title));
  }, [lessons, courseId]);

  const filteredLessons = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return allCourseLessons;

    return allCourseLessons.filter((lesson) => {
      return (
        lesson.title.toLowerCase().includes(cleanQuery) ||
        lesson.skill.toLowerCase().includes(cleanQuery)
      );
    });
  }, [allCourseLessons, query]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  if (!course) {
    return (
      <StudentShell>
        <section className="ef-event-card">
          <h1>Course not found</h1>
          <p>This course may have been removed from the content studio.</p>
          <Link href="/student/courses" className="ef-card-btn" style={{ width: "fit-content", padding: "0 18px" }}>
            Back to courses
          </Link>
        </section>
      </StudentShell>
    );
  }

  const completedTests = allCourseLessons.filter((lesson) => results[resultKey(course.id, lesson.id)]).length;
  const resourcesReady = allCourseLessons.filter((lesson) => lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf).length;
  const testsReady = allCourseLessons.filter((lesson) => (lesson.quiz?.length || 0) > 0).length;
  const firstLesson = allCourseLessons[0];

  return (
    <StudentShell>
      <section className="ef-course-premium-hero compact">
        <div>
          <span className="ef-course-eyebrow">{course.level} · {course.tag}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          <div className="ef-course-hero-actions">
            {firstLesson && (
              <Link href={`/student/courses/${course.id}/${firstLesson.id}`} className="ef-primary-action">
                Start course
              </Link>
            )}

            <Link href="/student/courses" className="ef-secondary-action">
              Back to library
            </Link>
          </div>
        </div>

        <aside className="ef-course-progress-card">
          <span>Course progress</span>
          <strong>{course.progress}%</strong>
          <div className="ef-course-progress-track">
            <div style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }} />
          </div>
          <p>{completedTests}/{allCourseLessons.length || 0} tests completed</p>
        </aside>
      </section>

      <div className="ef-course-metrics">
        <div>
          <span>Lessons</span>
          <strong>{allCourseLessons.length}</strong>
        </div>
        <div>
          <span>Resources ready</span>
          <strong>{resourcesReady}</strong>
        </div>
        <div>
          <span>Tests ready</span>
          <strong>{testsReady}</strong>
        </div>
        <div>
          <span>Teacher</span>
          <strong>{course.teacher}</strong>
        </div>
      </div>

      <section className="ef-course-lessons-panel compact">
        <div className="ef-course-lessons-toolbar">
          <div>
            <h2 className="ef-section-title">Course lessons</h2>
            <p className="ef-section-subtitle">
              {filteredLessons.length} lesson{filteredLessons.length > 1 ? "s" : ""} displayed
            </p>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lesson..."
          />
        </div>

        <div className="ef-course-lesson-list compact">
          {filteredLessons.map((lesson, index) => {
            const result = results[resultKey(course.id, lesson.id)];
            const quizCount = lesson.quiz?.length || 0;
            const hasResources = Boolean(lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf);
            const isReview = lesson.title.toLowerCase().includes("review");

            return (
              <article className={isReview ? "ef-course-lesson-row compact review" : "ef-course-lesson-row compact"} key={`${lesson.courseId}-${lesson.id}`}>
                <div className="ef-course-lesson-number">
                  {lessonNumber(lesson.title) === 999 ? index + 1 : lessonNumber(lesson.title)}
                </div>

                <div className="ef-course-lesson-main">
                  <span>{lesson.skill} · {lesson.duration}</span>
                  <h3>{lesson.title}</h3>

                  <div className="ef-lesson-status-pills">
                    <b className={hasResources ? "ready" : ""}>
                      {hasResources ? "Resources ready" : "No content yet"}
                    </b>

                    <b className={quizCount > 0 ? "ready" : ""}>
                      {quizCount > 0 ? `${quizCount}/10 QCM` : "No test"}
                    </b>

                    {result && (
                      <b className="ready">
                        Score {result.score}/{result.total}
                      </b>
                    )}
                  </div>
                </div>

                <div className="ef-course-lesson-actions compact">
                  <Link href={`/student/courses/${course.id}/${lesson.id}`} className="ef-mini-primary">
                    Open
                  </Link>

                  {quizCount > 0 ? (
                    <Link href={`/student/courses/${course.id}/${lesson.id}/test`} className="ef-mini-secondary">
                      {result ? "Retake" : "Test"}
                    </Link>
                  ) : (
                    <span className="ef-no-test-chip">Test later</span>
                  )}

                  {result && (
                    <small>{formatDate(result.finishedAt)}</small>
                  )}
                </div>
              </article>
            );
          })}

          {filteredLessons.length === 0 && (
            <div className="ef-empty-course-state">
              No lesson found for this search.
            </div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
