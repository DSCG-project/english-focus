"use client";

import { useState } from "react";
import type { EnglishQuizQuestion } from "@/lib/englishContent";

export function LessonQuiz({ questions }: { questions: EnglishQuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const score = questions.reduce((total, question) => {
    return answers[question.id] === question.correctIndex ? total + 1 : total;
  }, 0);

  if (questions.length === 0) {
    return (
      <section id="quiz" className="ef-quiz-section">
        <h2>Lesson quiz</h2>
        <div className="ef-event-card">No quiz has been added for this lesson yet.</div>
      </section>
    );
  }

  return (
    <section id="quiz" className="ef-quiz-section">
      <div className="ef-quiz-topline">
        <h2>Lesson quiz</h2>
        <span className="ef-admin-badge green">
          Score: {score}/{questions.length}
        </span>
      </div>

      {questions.map((question, questionIndex) => {
        const selected = answers[question.id];

        return (
          <article className="ef-student-question" key={question.id}>
            <h3>{questionIndex + 1}. {question.question}</h3>

            <div className="ef-student-answers">
              {question.choices.map((choice, index) => {
                const isCorrect = index === question.correctIndex;
                const isSelected = selected === index;
                const answered = selected !== undefined;

                let className = "ef-student-answer";
                if (answered && isCorrect) className += " correct";
                if (answered && isSelected && !isCorrect) className += " wrong";

                return (
                  <button
                    key={`${question.id}-${choice}`}
                    className={className}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: index,
                      }))
                    }
                  >
                    {String.fromCharCode(65 + index)}. {choice}
                  </button>
                );
              })}
            </div>

            {selected !== undefined && (
              <div className="ef-student-explanation">
                <b>{selected === question.correctIndex ? "Correct." : "Correction."}</b>{" "}
                {question.explanation}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
