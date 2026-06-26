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

export default function StudentQuizzesPage() {
  const { levels, courses, lessons } = useEnglishContent();

  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  const quizLessons = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return lessons
      .filter((lesson) => (lesson.quiz?.length || 0) > 0)
      .filter((lesson) => selectedLevel === "All" || lesson.level === selectedLevel)
      .filter((lesson) => {
        if (!cleanQuery) return true;

        const course = courses.find((item) => item.id === lesson.courseId);

        return (
          lesson.title.toLowerCase().includes(cleanQuery) ||
          lesson.skill.toLowerCase().includes(cleanQuery) ||
          course?.title.toLowerCase().includes(cleanQuery)
        );
      })
      .sort((a, b) => a.level.localeCompare(b.level) || lessonNumber(a.title) - lessonNumber(b.title));
  }, [lessons, courses, selectedLevel, query]);

  const completed = quizLessons.filter((lesson) => results[resultKey(lesson.courseId, lesson.id)]).length;

  return (
    <StudentShell>
      <section className="ef-clean-page-head">
        <div>
          <span className="ef-course-eyebrow">Practice</span>
          <h1>Quizzes</h1>
          <p>Start available QCM tests and review completed scores.</p>
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
            placeholder="Search quiz..."
          />
        </div>
      </section>

      <div className="ef-clean-kpis">
        <div>
          <span>Available tests</span>
          <strong>{quizLessons.length}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>
        <div>
          <span>Selected level</span>
          <strong>{selectedLevel}</strong>
        </div>
      </div>

      <section className="ef-clean-panel">
        <div className="ef-clean-list">
          {quizLessons.map((lesson) => {
            const course = courses.find((item) => item.id === lesson.courseId);
            const result = results[resultKey(lesson.courseId, lesson.id)];

            return (
              <article className="ef-clean-row" key={`${lesson.courseId}-${lesson.id}`}>
                <div className="ef-clean-row-code">
                  {lesson.level === "Business English" ? "BE" : lesson.level.split(" ")[0]}
                </div>

                <div className="ef-clean-row-main">
                  <span>{course?.title || lesson.course}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.quiz?.length || 0}/10 questions · {lesson.skill}</p>
                </div>

                <div className="ef-clean-row-actions">
                  {result && (
                    <b className="ef-score-chip">
                      {result.score}/{result.total}
                      <small>{formatDate(result.finishedAt)}</small>
                    </b>
                  )}

                  <Link href={`/student/courses/${lesson.courseId}/${lesson.id}/test`} className="ef-mini-primary">
                    {result ? "Retake" : "Start"}
                  </Link>
                </div>
              </article>
            );
          })}

          {quizLessons.length === 0 && (
            <div className="ef-empty-large">
              <h2>No quiz available yet</h2>
              <p>Add QCM questions from Admin Content → Test.</p>
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
