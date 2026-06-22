"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

type ResourceType = "course" | "exercises" | "notes";

function getResourceLabel(resource: string) {
  if (resource === "course") return "Course";
  if (resource === "exercises") return "Exercises";
  if (resource === "notes") return "Notes";
  return "Document";
}

function getResourcePath(lesson: {
  coursePdf?: string;
  exercisesPdf?: string;
  notesPdf?: string;
}, resource: string) {
  if (resource === "course") return lesson.coursePdf || "";
  if (resource === "exercises") return lesson.exercisesPdf || "";
  if (resource === "notes") return lesson.notesPdf || "";
  return "";
}

function isUsablePath(value: string) {
  const clean = value.trim();
  return clean.startsWith("/") || clean.startsWith("http");
}

function PdfViewerIcon() {
  return (
    <svg
      width="21"
      height="21"
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

function DownloadIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function LessonDocumentViewerPage() {
  const params = useParams<{
    courseId: string;
    lessonId: string;
    resource: ResourceType;
  }>();

  const { courses, lessons } = useEnglishContent();

  const course = courses.find((item) => item.id === params.courseId);
  const lesson = lessons.find(
    (item) => item.courseId === params.courseId && item.id === params.lessonId
  );

  if (!course || !lesson) {
    return (
      <StudentShell>
        <section className="ef-event-card">
          <h1>Document not found</h1>
          <p>This document may have been removed from the lesson.</p>
          <Link href="/student/courses" className="ef-card-btn" style={{ width: "fit-content", padding: "0 18px" }}>
            Back to courses
          </Link>
        </section>
      </StudentShell>
    );
  }

  const label = getResourceLabel(params.resource);
  const path = getResourcePath(lesson, params.resource);
  const available = isUsablePath(path);

  return (
    <StudentShell>
      <section className="ef-pdf-viewer-page">
        <header className="ef-pdf-viewer-header">
          <div>
            <span className="ef-course-eyebrow">
              {course.level} · {lesson.title}
            </span>

            <h1>{label}</h1>
            <p>{course.title}</p>
          </div>

          <div className="ef-pdf-viewer-actions">
            {available && (
              <a href={path} download className="ef-pdf-viewer-action">
                <DownloadIcon />
                Download
              </a>
            )}

            <Link
              href={`/student/courses/${course.id}/${lesson.id}`}
              className="ef-pdf-viewer-action secondary"
            >
              Back to lesson
            </Link>
          </div>
        </header>

        {available ? (
          <section className="ef-pdf-viewer-shell">
            <div className="ef-pdf-viewer-toolbar">
              <div className="ef-pdf-viewer-title">
                <span>
                  <PdfViewerIcon />
                </span>
                <strong>{label}</strong>
              </div>
            </div>

            <iframe
              className="ef-pdf-frame"
              src={path}
              title={`${label} PDF`}
            />
          </section>
        ) : (
          <section className="ef-pdf-empty-state">
            <span>
              <PdfViewerIcon />
            </span>
            <h2>{label} is not available yet</h2>
            <p>This PDF will appear here after it is uploaded from the admin content studio.</p>

            <Link
              href={`/student/courses/${course.id}/${lesson.id}`}
              className="ef-pdf-viewer-action secondary"
            >
              Back to lesson
            </Link>
          </section>
        )}
      </section>
    </StudentShell>
  );
}
