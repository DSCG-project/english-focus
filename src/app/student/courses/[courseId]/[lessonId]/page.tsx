"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";

function isUsablePath(value: string) {
  return value.trim().startsWith("/") || value.trim().startsWith("http");
}

export default function LessonPlayerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const { courses, lessons } = useEnglishContent();

  const course = courses.find((item) => item.id === params.courseId);
  const lesson = lessons.find(
    (item) => item.courseId === params.courseId && item.id === params.lessonId
  );

  const courseLessons = lessons.filter((item) => item.courseId === params.courseId);
  const quiz = lesson?.quiz || [];
  const hasVideo = Boolean(lesson?.video && isUsablePath(lesson.video));
  const hasPdf = Boolean(lesson?.pdf && isUsablePath(lesson.pdf));

  if (!course || !lesson) {
    return (
      <StudentShell>
        <section className="ef-event-card">
          <h1>Lesson not found</h1>
          <p>This lesson may have been deleted from the admin content builder.</p>
          <Link href="/student/courses" className="ef-card-btn" style={{ width: "fit-content", padding: "0 18px" }}>
            Back to courses
          </Link>
        </section>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="ef-lesson-layout">
        <main className="ef-lesson-player-card">
          {hasVideo ? (
            <video className="ef-real-video" controls preload="metadata">
              <source src={lesson.video} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <section className="ef-video-empty">
              <div className="ef-video-empty-inner">
                <div className="ef-video-play">▶</div>
                <h1>{lesson.title}</h1>
                <p>No exploitable video path has been added for this lesson yet.</p>
                <div className="ef-file-warning">
                  Add a file in <b>public/uploads/videos</b>, then set the path in admin:
                  <br />
                  /uploads/videos/your-video.mp4
                </div>
              </div>
            </section>
          )}

          <section className="ef-lesson-body">
            <div className="ef-lesson-kicker">
              {course.level} · {lesson.skill} · {lesson.duration}
            </div>

            <h2 className="ef-lesson-main-title">{lesson.title}</h2>

            <p className="ef-lesson-desc">
              {lesson.description}
            </p>

            <div className="ef-lesson-actions">
              <button className="ef-primary-action">Mark lesson as completed</button>

              {hasPdf ? (
                <a className="ef-secondary-action" href={lesson.pdf} target="_blank" rel="noreferrer">
                  Open PDF notes
                </a>
              ) : (
                <button className="ef-secondary-action" disabled>
                  PDF not available
                </button>
              )}

              <a className="ef-secondary-action" href="#quiz">
                Start quiz
              </a>
            </div>

            <div className="ef-learning-grid">
              <article className="ef-learning-card">
                <strong>Lesson objective</strong>
                <span>{lesson.objective}</span>
              </article>

              <article className="ef-learning-card">
                <strong>PDF notes</strong>
                <span>{hasPdf ? lesson.pdf : "PDF notes are not available yet."}</span>
              </article>

              <article className="ef-learning-card">
                <strong>Quiz</strong>
                <span>{quiz.length} questions with explanations.</span>
              </article>
            </div>
          </section>

          <section id="quiz" className="ef-quiz-section">
            <h2>Lesson quiz</h2>

            {quiz.length === 0 && (
              <div className="ef-event-card">
                No quiz has been added for this lesson yet.
              </div>
            )}

            {quiz.map((question, questionIndex) => (
              <article className="ef-student-question" key={question.id}>
                <h3>{questionIndex + 1}. {question.question}</h3>

                <div className="ef-student-answers">
                  {question.choices.map((choice, index) => (
                    <button
                      key={choice}
                      className={
                        index === question.correctIndex
                          ? "ef-student-answer correct"
                          : "ef-student-answer"
                      }
                    >
                      {String.fromCharCode(65 + index)}. {choice}
                    </button>
                  ))}
                </div>

                <div className="ef-student-explanation">
                  <b>Explanation:</b> {question.explanation}
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside className="ef-lesson-sidebar">
          <section className="ef-side-panel">
            <h3>Lesson resources</h3>

            <div className="ef-resource-list">
              <div className="ef-resource-item">
                <strong>Video file</strong>
                <span>{lesson.video || "No video path"}</span>
              </div>

              <div className="ef-resource-item">
                <strong>PDF Notes</strong>
                <span>{lesson.pdf || "No PDF path"}</span>
              </div>

              <div className="ef-resource-item">
                <strong>Practice</strong>
                <span>{quiz.length} quiz questions</span>
              </div>
            </div>
          </section>

          <section className="ef-side-panel">
            <h3>Quick quiz</h3>

            <div className="ef-quiz-preview">
              {quiz[0] ? (
                <>
                  <p>{quiz[0].question}</p>

                  <div className="ef-answer-list">
                    {quiz[0].choices.map((choice, index) => (
                      <div
                        className={index === quiz[0].correctIndex ? "ef-answer correct" : "ef-answer"}
                        key={choice}
                      >
                        {choice}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No quiz question has been added for this lesson yet.</p>
              )}
            </div>
          </section>

          <section className="ef-side-panel">
            <h3>Course lessons</h3>

            <div className="ef-mini-lesson-list">
              {courseLessons.map((item, index) => (
                <Link
                  href={`/student/courses/${course.id}/${item.id}`}
                  className={item.id === lesson.id ? "ef-mini-lesson active" : "ef-mini-lesson"}
                  key={`${item.courseId}-${item.id}`}
                >
                  <span className="ef-mini-number">{index + 1}</span>
                  <span className="ef-mini-title">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <Link href={`/student/courses/${course.id}`} className="ef-secondary-action">
            Back to course
          </Link>
        </aside>
      </div>
    </StudentShell>
  );
}
