"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

type DocType = "course" | "exercises" | "notes";

function docPath(lesson: { coursePdf?: string; exercisesPdf?: string; notesPdf?: string }, type: DocType) {
  if (type === "course") return lesson.coursePdf || "";
  if (type === "exercises") return lesson.exercisesPdf || "";
  return lesson.notesPdf || "";
}

function docLabel(type: DocType) {
  if (type === "course") return "Course";
  if (type === "exercises") return "Exercises";
  return "Notes";
}

export default function StudentPdfPage() {
  const { levels, courses, lessons } = useEnglishContent();

  const [selectedLevel, setSelectedLevel] = useState("All");
  const [query, setQuery] = useState("");

  const documents = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return lessons
      .flatMap((lesson) => {
        const course = courses.find((item) => item.id === lesson.courseId);

        return (["course", "exercises", "notes"] as DocType[])
          .filter((type) => Boolean(docPath(lesson, type)))
          .map((type) => ({
            type,
            lesson,
            course,
            path: docPath(lesson, type),
          }));
      })
      .filter((item) => selectedLevel === "All" || item.lesson.level === selectedLevel)
      .filter((item) => {
        if (!cleanQuery) return true;

        return (
          item.lesson.title.toLowerCase().includes(cleanQuery) ||
          item.course?.title.toLowerCase().includes(cleanQuery) ||
          docLabel(item.type).toLowerCase().includes(cleanQuery)
        );
      });
  }, [lessons, courses, selectedLevel, query]);

  return (
    <StudentShell>
      <section className="ef-clean-page-head">
        <div>
          <span className="ef-course-eyebrow">Documents</span>
          <h1>PDF resources</h1>
          <p>Open uploaded course PDFs, exercises and notes.</p>
        </div>

        <div className="ef-clean-tools">
          <select value={selectedLevel} onChange={(event) => setSelectedLevel(event.target.value)}>
            <option value="All">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search document..."
          />
        </div>
      </section>

      <div className="ef-clean-kpis">
        <div>
          <span>Documents</span>
          <strong>{documents.length}</strong>
        </div>
        <div>
          <span>Selected level</span>
          <strong>{selectedLevel}</strong>
        </div>
        <div>
          <span>Types</span>
          <strong>3</strong>
        </div>
      </div>

      <section className="ef-clean-panel">
        <div className="ef-document-grid-clean">
          {documents.map((item) => (
            <article className="ef-document-card-clean" key={`${item.lesson.courseId}-${item.lesson.id}-${item.type}`}>
              <div className="ef-document-type">
                {docLabel(item.type)}
              </div>

              <div>
                <span>{item.course?.title || item.lesson.course}</span>
                <h3>{item.lesson.title}</h3>
                <p>{item.lesson.level}</p>
              </div>

              <div className="ef-document-actions-clean">
                <Link
                  href={`/student/courses/${item.lesson.courseId}/${item.lesson.id}/documents/${item.type}`}
                  className="ef-mini-primary"
                >
                  View
                </Link>

                <a href={item.path} download className="ef-mini-secondary">
                  Download
                </a>
              </div>
            </article>
          ))}

          {documents.length === 0 && (
            <div className="ef-empty-large">
              <h2>No PDF uploaded yet</h2>
              <p>Add Course, Exercises or Notes PDFs from Admin Content → Resources.</p>
              <Link href="/student/courses" className="ef-mini-primary">
                Browse courses
              </Link>
            </div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
