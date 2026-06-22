"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

function hasPdf(value?: string) {
  const clean = (value || "").trim();
  return clean.startsWith("/") || clean.startsWith("http");
}

export default function StudentPdfNotesPage() {
  const { courses, lessons } = useEnglishContent();

  const pdfRows = lessons.flatMap((lesson) => {
    const course = courses.find((item) => item.id === lesson.courseId);

    return [
      { type: "Course", href: lesson.coursePdf, resource: "course" },
      { type: "Exercises", href: lesson.exercisesPdf, resource: "exercises" },
      { type: "Notes", href: lesson.notesPdf, resource: "notes" },
    ]
      .filter((item) => hasPdf(item.href))
      .map((item) => ({
        ...item,
        lesson,
        course,
      }));
  });

  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Resources</span>
          <h1>PDF Notes</h1>
          <p>Open course documents, exercises and notes from your lessons.</p>
        </div>
      </section>

      <section className="ef-dashboard-panel-final">
        <div className="ef-final-resource-list">
          {pdfRows.map((item) => (
            <article className="ef-final-resource-row" key={`${item.lesson.courseId}-${item.lesson.id}-${item.type}`}>
              <div>
                <span>{item.type}</span>
                <h3>{item.lesson.title}</h3>
                <p>{item.course?.title}</p>
              </div>

              <div>
                <Link
                  href={`/student/courses/${item.lesson.courseId}/${item.lesson.id}/documents/${item.resource}`}
                  className="ef-mini-primary"
                >
                  View
                </Link>

                <a href={item.href} download className="ef-mini-secondary">
                  Download
                </a>
              </div>
            </article>
          ))}

          {pdfRows.length === 0 && (
            <div className="ef-empty-mini">
              No PDF documents have been uploaded yet.
            </div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
