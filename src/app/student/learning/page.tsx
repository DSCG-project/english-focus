"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

export default function StudentLearningPage() {
  const { levels, courses, lessons } = useEnglishContent();

  const [activeLevel, setActiveLevel] = useState("All");
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesLevel = activeLevel === "All" || course.level === activeLevel;
      const matchesQuery =
        !cleanQuery ||
        course.title.toLowerCase().includes(cleanQuery) ||
        course.tag.toLowerCase().includes(cleanQuery);

      return matchesLevel && matchesQuery;
    });
  }, [courses, activeLevel, query]);

  const grouped = useMemo(() => {
    return levels
      .map((level) => ({
        level,
        courses: filteredCourses.filter((course) => course.level === level),
      }))
      .filter((group) => group.courses.length > 0);
  }, [levels, filteredCourses]);

  function countLessons(courseId: string) {
    return lessons.filter((lesson) => lesson.courseId === courseId).length;
  }

  function countReady(courseId: string) {
    return lessons.filter((lesson) => {
      return (
        lesson.courseId === courseId &&
        (lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf || (lesson.quiz?.length || 0) > 0)
      );
    }).length;
  }

  return (
    <StudentShell>
      <section className="ef-learning-clean-head">
        <div>
          <span className="ef-course-eyebrow">Learning path</span>
          <h1>My learning</h1>
          <p>Choose a level or a Business English subject and open the course lessons.</p>
        </div>

        <div className="ef-learning-clean-tools">
          <select value={activeLevel} onChange={(event) => setActiveLevel(event.target.value)}>
            <option value="All">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
          />
        </div>
      </section>

      <div className="ef-learning-tabs-clean">
        <button className={activeLevel === "All" ? "active" : ""} onClick={() => setActiveLevel("All")}>
          All
        </button>

        {levels.map((level) => (
          <button key={level} className={activeLevel === level ? "active" : ""} onClick={() => setActiveLevel(level)}>
            {level.replace(" Upper Intermediate", "").replace(" Proficiency", "")}
          </button>
        ))}
      </div>

      <section className="ef-learning-clean-stack">
        {grouped.map((group) => (
          <article className="ef-learning-clean-group" key={group.level}>
            <div className="ef-learning-clean-title">
              <h2>{group.level}</h2>
              <span>{group.courses.length} course{group.courses.length > 1 ? "s" : ""}</span>
            </div>

            <div className="ef-learning-clean-list">
              {group.courses.map((course) => {
                const total = countLessons(course.id);
                const ready = countReady(course.id);
                const firstLesson = lessons.find((lesson) => lesson.courseId === course.id);

                return (
                  <article className="ef-learning-clean-course" key={course.id}>
                    <div className="ef-learning-course-code">
                      {course.level === "Business English" ? course.tag.slice(0, 2).toUpperCase() : course.level.split(" ")[0]}
                    </div>

                    <div className="ef-learning-course-main">
                      <span>{course.tag}</span>
                      <h3>{course.title}</h3>
                      <p>{total} lessons · {ready} with content</p>
                    </div>

                    <div className="ef-learning-course-actions-clean">
                      <Link href={`/student/courses/${course.id}`} className="ef-mini-primary">
                        Open
                      </Link>

                      {firstLesson && (
                        <Link href={`/student/courses/${course.id}/${firstLesson.id}`} className="ef-mini-secondary">
                          Start
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        ))}

        {grouped.length === 0 && (
          <div className="ef-student-home-panel">
            <div className="ef-empty-mini">No course found.</div>
          </div>
        )}
      </section>
    </StudentShell>
  );
}
