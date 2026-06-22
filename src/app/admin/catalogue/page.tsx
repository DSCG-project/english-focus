"use client";

import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function AdminCataloguePage() {
  const { levels, courses, lessons } = useEnglishContent();

  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Catalogue</h1>
          <p>Overview of all levels, courses and empty lesson structures.</p>
        </div>

        <div className="ef-admin-hero-actions">
          <Link href="/admin/content" className="ef-admin-white-btn">
            Content studio
          </Link>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat">
          <span>Levels</span>
          <strong>{levels.length}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Lessons</span>
          <strong>{lessons.length}</strong>
        </div>
      </div>

      <section className="ef-learning-level-stack">
        {levels.map((level) => {
          const levelCourses = courses.filter((course) => course.level === level);

          if (levelCourses.length === 0) return null;

          return (
            <article className="ef-learning-level-panel" key={level}>
              <div className="ef-section-head">
                <h2 className="ef-section-title">{level}</h2>
                <p className="ef-section-subtitle">
                  {levelCourses.length} course{levelCourses.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="ef-final-resource-list">
                {levelCourses.map((course) => {
                  const total = lessons.filter((lesson) => lesson.courseId === course.id).length;

                  return (
                    <div className="ef-final-resource-row" key={course.id}>
                      <div>
                        <span>{course.tag}</span>
                        <h3>{course.title}</h3>
                        <p>{total} lessons · no video/PDF/test content yet</p>
                      </div>

                      <Link href={`/student/courses/${course.id}`} className="ef-mini-primary">
                        Preview
                      </Link>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </AdminShell>
  );
}
