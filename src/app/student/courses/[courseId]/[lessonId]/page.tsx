"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

function isUsablePath(value: string | undefined) {
  const clean = (value || "").trim();
  return clean.startsWith("/") || clean.startsWith("http");
}

function resultKey(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

type TestResult = {
  score: number;
  total: number;
  finishedAt: string;
};

function ResourceIcon({ type }: { type: "view" | "download" }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DocumentIcon() {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function PdfResourceCard({
  title,
  href,
  viewerHref,
}: {
  title: string;
  href?: string;
  viewerHref: string;
}) {
  const available = isUsablePath(href);

  return (
    <article className={available ? "ef-student-doc-card ready" : "ef-student-doc-card"}>
      <div className="ef-student-doc-main">
        <span className="ef-student-doc-icon">
          <DocumentIcon />
        </span>
        <h3>{title}</h3>
      </div>

      {available && (
        <div className="ef-student-doc-actions">
          <Link href={viewerHref} title={`View ${title}`}>
            <ResourceIcon type="view" />
          </Link>

          <a href={href} download title={`Download ${title}`}>
            <ResourceIcon type="download" />
          </a>
        </div>
      )}
    </article>
  );
}

export default function LessonPlayerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const { courses, lessons } = useEnglishContent();
  const [videoError, setVideoError] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const course = courses.find((item) => item.id === params.courseId);
  const lesson = lessons.find(
    (item) => item.courseId === params.courseId && item.id === params.lessonId
  );

  useEffect(() => {
    if (!lesson || typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      const results = raw ? JSON.parse(raw) : {};
      setTestResult(results[resultKey(lesson.courseId, lesson.id)] || null);
    } catch {
      setTestResult(null);
    }
  }, [lesson]);

  if (!course || !lesson) {
    return (
      <StudentShell>
        <section className="ef-event-card">
          <h1>Lesson not found</h1>
          <p>This lesson may have been deleted from the content studio.</p>
          <Link
            href="/student/courses"
            className="ef-card-btn"
            style={{ width: "fit-content", padding: "0 18px" }}
          >
            Back to courses
          </Link>
        </section>
      </StudentShell>
    );
  }

  const courseLessons = lessons.filter((item) => item.courseId === course.id);
  const hasVideo = Boolean(lesson.video && isUsablePath(lesson.video) && !videoError);

  return (
    <StudentShell>
      <div className="ef-lesson-layout">
        <main className="ef-lesson-player-card">
          {hasVideo ? (
            <video
              className="ef-real-video"
              controls
              controlsList="nodownload"
              preload="metadata"
              onContextMenu={(event) => event.preventDefault()}
              onError={() => setVideoError(true)}
            >
              <source src={lesson.video} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <section className="ef-video-empty">
              <div className="ef-video-empty-inner">
                <div className="ef-video-play">▶</div>
                <h1>{lesson.title}</h1>
                <p>This lesson video is not available yet.</p>
              </div>
            </section>
          )}

          <section className="ef-lesson-body">
            <div className="ef-lesson-kicker">
              {course.level} · {lesson.skill} · {lesson.duration}
            </div>

            <h2 className="ef-lesson-main-title">{lesson.title}</h2>

            <section className="ef-student-pdf-panel clean">
              <div className="ef-student-pdf-head clean">
                <h3>Lesson documents</h3>
              </div>

              <div className="ef-student-pdf-grid clean">
                <PdfResourceCard
                  title="Course"
                  href={lesson.coursePdf}
                  viewerHref={`/student/courses/${course.id}/${lesson.id}/documents/course`}
                />

                <PdfResourceCard
                  title="Exercises"
                  href={lesson.exercisesPdf}
                  viewerHref={`/student/courses/${course.id}/${lesson.id}/documents/exercises`}
                />

                <PdfResourceCard
                  title="Notes"
                  href={lesson.notesPdf}
                  viewerHref={`/student/courses/${course.id}/${lesson.id}/documents/notes`}
                />
              </div>
            </section>
          </section>
        </main>

        <aside className="ef-lesson-sidebar">
          <section className="ef-side-panel">
            <h3>Test status</h3>

            {testResult ? (
              <div className="ef-quiz-preview">
                <p>
                  Last score: <b>{testResult.score}/{testResult.total}</b>
                </p>

                <Link
                  className="ef-admin-submit full"
                  href={`/student/courses/${course.id}/${lesson.id}/test`}
                >
                  Retake test
                </Link>
              </div>
            ) : (
              <div className="ef-quiz-preview">
                <p>You can start the test and return to this course at any time.</p>

                <Link
                  className="ef-admin-submit full"
                  href={`/student/courses/${course.id}/${lesson.id}/test`}
                >
                  Start test
                </Link>
              </div>
            )}
          </section>

          <section className="ef-side-panel">
            <h3>Course lessons</h3>

            <div className="ef-mini-lesson-list">
              {courseLessons.map((item, index) => (
                <Link
                  href={`/student/courses/${course.id}/${item.id}`}
                  className={item.id === lesson.id ? "ef-mini-lesson active" : "ef-mini-lesson"}
                  key={`${item.courseId}-${item.id}`}
                >
                  <span className="ef-mini-number">{index + 1}</span>
                  <span className="ef-mini-title">{item.title}</span>
                </Link>
              ))}
            </div>
          </section>

          <Link href={`/student/courses/${course.id}`} className="ef-secondary-action">
            Back to course
          </Link>
        </aside>
      </div>
    </StudentShell>
  );
}
