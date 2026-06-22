"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function StudentQuizzesPage() {
  const { courses, lessons } = useEnglishContent();
  const [results, setResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  const quizLessons = lessons.filter((lesson) => (lesson.quiz?.length || 0) > 0);

  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Practice</span>
          <h1>Quizzes</h1>
          <p>Complete or retake your QCM tests. Scores are saved after completion.</p>
        </div>
      </section>

      <section className="ef-dashboard-panel-final">
        <div className="ef-final-resource-list">
          {quizLessons.map((lesson) => {
            const course = courses.find((item) => item.id === lesson.courseId);
            const result = results[resultKey(lesson.courseId, lesson.id)];

            return (
              <article className="ef-final-resource-row" key={`${lesson.courseId}-${lesson.id}`}>
                <div>
                  <span>{lesson.quiz?.length || 0}/10 QCM</span>
                  <h3>{lesson.title}</h3>
                  <p>{course?.title}</p>
                </div>

                <div>
                  {result && <b className="ef-score-pill-final">{result.score}/{result.total}</b>}

                  <Link href={`/student/courses/${lesson.courseId}/${lesson.id}/test`} className="ef-mini-primary">
                    {result ? "Retake" : "Start"}
                  </Link>
                </div>
              </article>
            );
          })}

          {quizLessons.length === 0 && (
            <div className="ef-empty-mini">
              No quizzes have been added yet.
            </div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
