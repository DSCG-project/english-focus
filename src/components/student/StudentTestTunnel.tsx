"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

type RouteInfo = {
  courseId: string;
  lessonId: string;
};

function parseRoute(): RouteInfo {
  if (typeof window === "undefined") {
    return { courseId: "", lessonId: "" };
  }

  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);

  const coursesIndex = parts.indexOf("courses");
  const courseId = coursesIndex >= 0 ? parts[coursesIndex + 1] || "" : "";
  const lessonId = coursesIndex >= 0 ? parts[coursesIndex + 2] || "" : "";

  const search = new URLSearchParams(window.location.search);

  return {
    courseId: courseId || search.get("courseId") || "",
    lessonId: lessonId || search.get("lessonId") || "",
  };
}

function resultKey(courseId: string, lessonId: string) {
  return `${courseId}__${lessonId}`;
}

function TestIcon({ type }: { type: "check" | "x" | "arrow" | "redo" | "course" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "check") {
    return (
      <svg {...common}>
        <path d="m20 6-11 11-5-5" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg {...common}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }

  if (type === "redo") {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v6h6" />
      </svg>
    );
  }

  if (type === "course") {
    return (
      <svg {...common}>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5Z" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function StudentTestTunnel() {
  const { courses, lessons } = useEnglishContent();

  const [route, setRoute] = useState<RouteInfo>({ courseId: "", lessonId: "" });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setRoute(parseRoute());
  }, []);

  const course = courses.find((item) => item.id === route.courseId);
  const lesson = lessons.find(
    (item) => item.courseId === route.courseId && item.id === route.lessonId
  );

  const quiz = lesson?.quiz || [];

  const score = useMemo(() => {
    return quiz.reduce((total, question) => {
      return answers[question.id] === question.correctIndex ? total + 1 : total;
    }, 0);
  }, [quiz, answers]);

  if (!route.courseId || !route.lessonId) {
    return (
      <StudentShell>
        <section className="ef-test-page premium">
          <div className="ef-test-empty premium">
            <span className="ef-test-pill">Loading</span>
            <h1>Preparing test</h1>
            <p>Please wait while the test is loaded.</p>
          </div>
        </section>
      </StudentShell>
    );
  }

  if (!course || !lesson) {
    return (
      <StudentShell>
        <section className="ef-test-page premium">
          <div className="ef-test-empty premium">
            <span className="ef-test-pill">Not found</span>
            <h1>Test not found</h1>
            <p>This lesson may have been renamed or removed from the content studio.</p>

            <Link href="/student/courses" className="ef-test-action primary">
              <TestIcon type="course" />
              Back to courses
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  if (quiz.length === 0) {
    return (
      <StudentShell>
        <section className="ef-test-page premium">
          <div className="ef-test-empty premium">
            <span className="ef-test-pill">{lesson.title}</span>
            <h1>No test available</h1>
            <p>No QCM test has been added for this lesson yet.</p>

            <Link href={`/student/courses/${course.id}/${lesson.id}`} className="ef-test-action primary">
              <TestIcon type="course" />
              Back to lesson
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  const safeStep = Math.min(step, quiz.length - 1);
  const current = quiz[safeStep];
  const selected = answers[current.id];
  const answeredCount = Object.keys(answers).length;
  const percent = Math.round((score / quiz.length) * 100);
  const progress = ((safeStep + 1) / quiz.length) * 100;

  function chooseAnswer(index: number) {
    if (finished) return;

    setAnswers((existing) => ({
      ...existing,
      [current.id]: index,
    }));
  }

  function finishTest() {
    setFinished(true);

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("english-focus-test-results");
      const oldResults = raw ? JSON.parse(raw) : {};

      window.localStorage.setItem(
        "english-focus-test-results",
        JSON.stringify({
          ...oldResults,
          [resultKey(route.courseId, route.lessonId)]: {
            score,
            total: quiz.length,
            finishedAt: new Date().toISOString(),
          },
        })
      );
    }
  }

  function retakeTest() {
    setAnswers({});
    setStep(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <StudentShell>
        <section className="ef-test-page premium">
          <div className="ef-test-result premium">
            <span className="ef-test-pill">Test completed</span>
            <h1>Your score</h1>

            <div className="ef-score-ring">
              <strong>{score}/{quiz.length}</strong>
              <span>{percent}%</span>
            </div>

            <div className="ef-test-final-actions">
              <button className="ef-test-action primary" onClick={retakeTest}>
                <TestIcon type="redo" />
                Retake test
              </button>

              <Link href={`/student/courses/${course.id}/${lesson.id}`} className="ef-test-action secondary">
                <TestIcon type="course" />
                Back to lesson
              </Link>
            </div>
          </div>

          <section className="ef-corrections-panel">
            <div className="ef-corrections-head">
              <h2>Corrections</h2>
              <p>Review your answers and the explanations.</p>
            </div>

            <div className="ef-correction-list">
              {quiz.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctIndex;

                return (
                  <article
                    className={isCorrect ? "ef-correction-card correct" : "ef-correction-card wrong"}
                    key={question.id}
                  >
                    <div className="ef-correction-top">
                      <span>{isCorrect ? <TestIcon type="check" /> : <TestIcon type="x" />}</span>
                      <strong>{index + 1}. {question.question}</strong>
                    </div>

                    <div className="ef-correction-answers">
                      <div>
                        <small>Your answer</small>
                        <b>{userAnswer !== undefined ? question.choices[userAnswer] : "No answer"}</b>
                      </div>

                      <div>
                        <small>Correct answer</small>
                        <b>{question.choices[question.correctIndex]}</b>
                      </div>
                    </div>

                    <p>{question.explanation}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <section className="ef-test-page premium">
        <div className="ef-test-header premium">
          <div>
            <span className="ef-test-pill">{course.title}</span>
            <h1>{lesson.title} · Test</h1>
            <p>Answer each question. Score and corrections will appear only at the end.</p>
          </div>

          <Link href={`/student/courses/${course.id}/${lesson.id}`} className="ef-test-action secondary">
            <TestIcon type="course" />
            Back to lesson
          </Link>
        </div>

        <div className="ef-test-progress premium">
          <div style={{ width: `${progress}%` }} />
        </div>

        <article className="ef-test-card premium">
          <div className="ef-test-countline">
            Question {safeStep + 1} of {quiz.length}
            <span>{answeredCount}/{quiz.length} answered</span>
          </div>

          <h2>{current.question}</h2>

          <div className="ef-test-choices premium">
            {current.choices.map((choice, index) => (
              <button
                key={`${current.id}-${index}`}
                className={selected === index ? "ef-test-choice premium selected" : "ef-test-choice premium"}
                onClick={() => chooseAnswer(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{choice}</strong>
              </button>
            ))}
          </div>

          <div className="ef-test-footer premium">
            <button
              className="ef-test-action secondary"
              onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))}
              disabled={safeStep === 0}
            >
              Previous
            </button>

            {safeStep < quiz.length - 1 ? (
              <button
                className="ef-test-action primary"
                onClick={() => setStep((currentStep) => Math.min(quiz.length - 1, currentStep + 1))}
                disabled={selected === undefined}
              >
                Next
                <TestIcon type="arrow" />
              </button>
            ) : (
              <button
                className="ef-test-action primary"
                onClick={finishTest}
                disabled={selected === undefined}
              >
                Finish test
                <TestIcon type="check" />
              </button>
            )}
          </div>
        </article>
      </section>
    </StudentShell>
  );
}
