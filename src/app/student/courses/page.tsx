"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function StudentCoursesPage() {
  const { levels, courses, lessons } = useEnglishContent();

  const [selectedLevel, setSelectedLevel] = useState("All");
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
      const matchesQuery =
        !cleanQuery ||
        course.title.toLowerCase().includes(cleanQuery) ||
        course.tag.toLowerCase().includes(cleanQuery) ||
        course.description.toLowerCase().includes(cleanQuery);

      return matchesLevel && matchesQuery;
    });
  }, [courses, selectedLevel, query]);

  const grouped = useMemo(() => {
    return levels
      .map((level) => ({
        level,
        courses: filteredCourses.filter((course) => course.level === level),
      }))
      .filter((group) => group.courses.length > 0);
  }, [levels, filteredCourses]);

  function lessonCount(courseId: string) {
    return lessons.filter((lesson) => lesson.courseId === courseId).length;
  }

  function readyResources(courseId: string) {
    return lessons.filter((lesson) => {
      return (
        lesson.courseId === courseId &&
        (lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf)
      );
    }).length;
  }

  return (
    <StudentShell>
      <section className="ef-catalogue-head">
        <div>
          <span className="ef-course-eyebrow">English Focus Library</span>
          <h1>Courses</h1>
          <p>Browse general English levels and Business English subjects.</p>
        </div>

        <div className="ef-catalogue-tools">
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
      </section>

      <div className="ef-catalogue-summary">
        <div>
          <span>Courses</span>
          <strong>{filteredCourses.length}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>
            {filteredCourses.reduce((total, course) => total + lessonCount(course.id), 0)}
          </strong>
        </div>
        <div>
          <span>Selected level</span>
          <strong>{selectedLevel}</strong>
        </div>
      </div>

      <div className="ef-level-course-stack">
        {grouped.map((group) => (
          <section className="ef-level-course-section compact" key={group.level}>
            <div className="ef-section-head">
              <div>
                <h2 className="ef-section-title">{group.level}</h2>
                <p className="ef-section-subtitle">
                  {group.courses.length} course{group.courses.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="ef-catalogue-course-grid">
              {group.courses.map((course) => {
                const totalLessons = lessonCount(course.id);
                const resources = readyResources(course.id);
                const firstLesson = lessons.find((lesson) => lesson.courseId === course.id);

                return (
                  <article className="ef-catalogue-course-card" key={course.id}>
                    <div className="ef-catalogue-card-top">
                      <span>{course.tag}</span>
                      <b>{totalLessons} lessons</b>
                    </div>

                    <h3>{course.title}</h3>
                    <p>{course.description}</p>

                    <div className="ef-catalogue-card-stats">
                      <div>
                        <span>Resources</span>
                        <strong>{resources}</strong>
                      </div>
                      <div>
                        <span>Progress</span>
                        <strong>{course.progress}%</strong>
                      </div>
                    </div>

                    <div className="ef-card-progress">
                      <span style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }} />
                    </div>

                    <div className="ef-catalogue-card-actions">
                      <Link href={`/student/courses/${course.id}`} className="ef-mini-primary">
                        View course
                      </Link>

                      {firstLesson && (
                        <Link href={`/student/courses/${course.id}/${firstLesson.id}`} className="ef-mini-secondary">
                          First lesson
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {grouped.length === 0 && (
          <section className="ef-dashboard-panel-final">
            <div className="ef-empty-mini">
              No course found for this search.
            </div>
          </section>
        )}
      </div>
    </StudentShell>
  );
}
