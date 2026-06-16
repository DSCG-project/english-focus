import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { lessons } from "@/data/english";

export default function LessonPlayerPage() {
  return (
    <StudentShell>
      <div className="ef-lesson-layout">
        <main className="ef-lesson-player-card">
          <section className="ef-video-frame">
            <div className="ef-video-content">
              <div className="ef-video-play">▶</div>
              <h1>B2 - Lesson 01 - Question Forms 1</h1>
              <p>
                Learn how to build accurate question forms in spoken and written English,
                with practical examples and common mistakes to avoid.
              </p>
            </div>
          </section>

          <section className="ef-lesson-body">
            <div className="ef-lesson-kicker">B2 Upper Intermediate · Grammar</div>
            <h2 className="ef-lesson-main-title">Question Forms 1</h2>

            <p className="ef-lesson-desc">
              This lesson focuses on question structure, auxiliary verbs, subject questions,
              object questions and natural spoken English patterns.
            </p>

            <div className="ef-lesson-actions">
              <button className="ef-primary-action">Mark lesson as completed</button>
              <button className="ef-secondary-action">Open PDF notes</button>
              <button className="ef-secondary-action">Start quiz</button>
            </div>

            <div className="ef-learning-grid">
              <article className="ef-learning-card">
                <strong>Lesson objective</strong>
                <span>Ask clear and grammatically correct questions in real conversations.</span>
              </article>

              <article className="ef-learning-card">
                <strong>PDF notes</strong>
                <span>Rules, examples, structure tables and common mistakes.</span>
              </article>

              <article className="ef-learning-card">
                <strong>Quiz</strong>
                <span>10 questions with automatic correction and explanations.</span>
              </article>
            </div>
          </section>
        </main>

        <aside className="ef-lesson-sidebar">
          <section className="ef-side-panel">
            <h3>Lesson resources</h3>

            <div className="ef-resource-list">
              <div className="ef-resource-item">
                <strong>PDF Notes</strong>
                <span>Question Forms 1 — summary and examples</span>
              </div>

              <div className="ef-resource-item">
                <strong>Vocabulary Sheet</strong>
                <span>Useful verbs and sentence patterns</span>
              </div>

              <div className="ef-resource-item">
                <strong>Practice File</strong>
                <span>Extra exercises for this lesson</span>
              </div>
            </div>
          </section>

          <section className="ef-side-panel">
            <h3>Quick quiz</h3>

            <div className="ef-quiz-preview">
              <p>Choose the correct question form:</p>

              <div className="ef-answer-list">
                <div className="ef-answer">Where you live?</div>
                <div className="ef-answer correct">Where do you live?</div>
                <div className="ef-answer">Where are you live?</div>
                <div className="ef-answer">Where does you live?</div>
              </div>
            </div>
          </section>

          <section className="ef-side-panel">
            <h3>Course lessons</h3>

            <div className="ef-mini-lesson-list">
              {lessons.map((lesson, index) => (
                <Link
                  href="/student/courses/b2/lesson-1"
                  className={index === 0 ? "ef-mini-lesson active" : "ef-mini-lesson"}
                  key={lesson}
                >
                  <span className="ef-mini-number">{index + 1}</span>
                  <span className="ef-mini-title">
                    {lesson}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <Link href="/student/courses/b2" className="ef-secondary-action">
            Back to course
          </Link>
        </aside>
      </div>
    </StudentShell>
  );
}
