"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function AdminCataloguePage() {
  const { levels, courses, lessons } = useEnglishContent();

  const [selectedLevel, setSelectedLevel] = useState("All");
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const clean = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
      const matchesQuery =
        !clean ||
        course.title.toLowerCase().includes(clean) ||
        course.tag.toLowerCase().includes(clean) ||
        course.description.toLowerCase().includes(clean);

      return matchesLevel && matchesQuery;
    });
  }, [courses, selectedLevel, query]);

  function lessonCount(courseId: string) {
    return lessons.filter((lesson) => lesson.courseId === courseId).length;
  }

  function readyCount(courseId: string) {
    return lessons.filter((lesson) => {
      return (
        lesson.courseId === courseId &&
        (lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf || (lesson.quiz?.length || 0) > 0)
      );
    }).length;
  }

  return (
    <AdminShell>
      <section className="ef-admin-clean-hero">
        <div>
          <span>Catalogue overview</span>
          <h1>Catalogue</h1>
          <p>Check all levels, general English courses and Business English subjects.</p>
        </div>

        <Link href="/admin/content" className="ef-admin-clean-preview">
          Content studio
        </Link>
      </section>

      <div className="ef-admin-clean-tools">
        <select value={selectedLevel} onChange={(event) => setSelectedLevel(event.target.value)}>
          <option value="All">All levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search course or subject..."
        />
      </div>

      <div className="ef-admin-clean-kpis">
        <div>
          <span>Displayed courses</span>
          <strong>{filteredCourses.length}</strong>
        </div>
        <div>
          <span>Displayed lessons</span>
          <strong>{filteredCourses.reduce((total, course) => total + lessonCount(course.id), 0)}</strong>
        </div>
        <div>
          <span>Selected level</span>
          <strong>{selectedLevel}</strong>
        </div>
      </div>

      <section className="ef-admin-catalogue-list">
        {filteredCourses.map((course) => {
          const total = lessonCount(course.id);
          const ready = readyCount(course.id);

          return (
            <article className="ef-admin-catalogue-row" key={course.id}>
              <div className="ef-admin-course-code">
                {course.level === "Business English" ? course.tag.slice(0, 2).toUpperCase() : course.level.split(" ")[0]}
              </div>

              <div>
                <span>{course.level} · {course.tag}</span>
                <h2>{course.title}</h2>
                <p>{total} lessons · {ready} with content/test</p>
              </div>

              <div className="ef-admin-catalogue-actions">
                <Link href={`/student/courses/${course.id}`} className="ef-mini-secondary">
                  Preview
                </Link>
                <Link href="/admin/content" className="ef-mini-primary">
                  Edit
                </Link>
              </div>
            </article>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="ef-empty-large">
            <h2>No course found</h2>
            <p>Try another level or search keyword.</p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
