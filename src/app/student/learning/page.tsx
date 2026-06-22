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

export default function StudentLearningPage() {
  const { levels, courses, lessons } = useEnglishContent();
  const [results, setResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("english-focus-test-results");
      setResults(raw ? JSON.parse(raw) : {});
    } catch {
      setResults({});
    }
  }, []);

  const groupedCourses = useMemo(() => {
    return levels
      .map((level) => {
        const levelCourses = courses.filter((course) => course.level === level);

        return {
          level,
          courses: levelCourses,
        };
      })
      .filter((group) => group.courses.length > 0);
  }, [levels, courses]);

  const completedTests = lessons.filter((lesson) => {
    return results[resultKey(lesson.courseId, lesson.id)];
  });

  const average =
    completedTests.length > 0
      ? Math.round(
          completedTests.reduce((sum, lesson) => {
            const result = results[resultKey(lesson.courseId, lesson.id)];
            return sum + (result.score / result.total) * 100;
          }, 0) / completedTests.length
        )
      : 0;

  function getCourseStats(courseId: string) {
    const courseLessons = lessons.filter((lesson) => lesson.courseId === courseId);

    const testsCompleted = courseLessons.filter((lesson) => {
      return results[resultKey(lesson.courseId, lesson.id)];
    }).length;

    const resourcesReady = courseLessons.filter((lesson) => {
      return lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf;
    }).length;

    const firstLesson = courseLessons[0];

    return {
      lessons: courseLessons.length,
      testsCompleted,
      resourcesReady,
      firstLesson,
    };
  }

  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Progress</span>
          <h1>Learning</h1>
          <p>Track your courses by level, continue lessons and retake QCM tests.</p>
        </div>
      </section>

      <div className="ef-course-metrics">
        <div>
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>{lessons.length}</strong>
        </div>
        <div>
          <span>Tests completed</span>
          <strong>{completedTests.length}</strong>
        </div>
        <div>
          <span>Average score</span>
          <strong>{average}%</strong>
        </div>
      </div>

      <div className="ef-learning-level-stack">
        {groupedCourses.map((group) => (
          <section className="ef-learning-level-panel" key={group.level}>
            <div className="ef-section-head">
              <h2 className="ef-section-title">{group.level}</h2>
              <p className="ef-section-subtitle">
                {group.courses.length} course{group.courses.length > 1 ? "s" : ""} available
              </p>
            </div>

            <div className="ef-learning-course-grid">
              {group.courses.map((course) => {
                const stats = getCourseStats(course.id);

                return (
                  <article className="ef-learning-course-card" key={course.id}>
                    <div className="ef-learning-course-top">
                      <span>{course.tag}</span>
                      <b>{course.status}</b>
                    </div>

                    <h3>{course.title}</h3>
                    <p>{course.description}</p>

                    <div className="ef-learning-course-stats">
                      <div>
                        <span>Lessons</span>
                        <strong>{stats.lessons}</strong>
                      </div>
                      <div>
                        <span>Resources</span>
                        <strong>{stats.resourcesReady}</strong>
                      </div>
                      <div>
                        <span>Tests</span>
                        <strong>{stats.testsCompleted}</strong>
                      </div>
                    </div>

                    <div className="ef-card-progress">
                      <span style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }} />
                    </div>

                    <div className="ef-learning-course-actions">
                      <Link href={`/student/courses/${course.id}`} className="ef-mini-primary">
                        Open course
                      </Link>

                      {stats.firstLesson && (
                        <Link
                          href={`/student/courses/${course.id}/${stats.firstLesson.id}`}
                          className="ef-mini-secondary"
                        >
                          Continue
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {groupedCourses.length === 0 && (
          <section className="ef-dashboard-panel-final">
            <div className="ef-empty-mini">
              No courses have been added yet.
            </div>
          </section>
        )}
      </div>
    </StudentShell>
  );
}
