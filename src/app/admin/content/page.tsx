"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  englishLevels,
  englishSkills,
  EnglishLevel,
  EnglishSkill,
  EnglishCourse,
  EnglishLesson,
  EnglishQuizQuestion,
  slugify,
} from "@/lib/englishContent";
import { useEnglishContent } from "@/lib/useEnglishContent";

function lessonKey(lesson: EnglishLesson) {
  return `${lesson.courseId}__${lesson.id}`;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"Courses" | "Lessons" | "Resources" | "Quiz">("Lessons");

  const {
    courses,
    setCourses,
    lessons,
    setLessons,
    resetContent,
  } = useEnglishContent();

  const [selectedLessonKey, setSelectedLessonKey] = useState("");

  const selectedLesson =
    lessons.find((lesson) => lessonKey(lesson) === selectedLessonKey) || lessons[0];

  const effectiveLessonKey = selectedLesson ? lessonKey(selectedLesson) : "";

  const [level, setLevel] = useState<EnglishLevel>("B2 Upper Intermediate");
  const [courseTitle, setCourseTitle] = useState("B2 - Upper Intermediate English Course");
  const [courseDescription, setCourseDescription] = useState(
    "Improve fluency, advanced grammar, comprehension and professional expression."
  );
  const [teacher, setTeacher] = useState("Stephanie Marston");
  const [tag, setTag] = useState("General English");

  const [lessonTitle, setLessonTitle] = useState("");
  const [skill, setSkill] = useState<EnglishSkill>("Grammar");
  const [duration, setDuration] = useState("12 min");
  const [lessonDescription, setLessonDescription] = useState("");
  const [objective, setObjective] = useState("");

  const [question, setQuestion] = useState("Which question form is correct?");
  const [choiceA, setChoiceA] = useState("Where do you live?");
  const [choiceB, setChoiceB] = useState("Where you live?");
  const [choiceC, setChoiceC] = useState("Where are you live?");
  const [choiceD, setChoiceD] = useState("Where does you live?");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState(
    "Use do/does to form questions in the Present Simple with most verbs."
  );

  const stats = useMemo(() => {
    return {
      courses: courses.length,
      lessons: lessons.length,
      published: lessons.filter((lesson) => lesson.status === "Published").length,
      videos: lessons.filter((lesson) => lesson.video !== "pending").length,
      quizzes: lessons.reduce((sum, lesson) => sum + (lesson.quiz?.length || lesson.quizQuestions || 0), 0),
    };
  }, [courses, lessons]);

  function upsertCourse() {
    const cleanTitle = courseTitle.trim();

    if (!cleanTitle) {
      alert("Course title is required.");
      return;
    }

    const id = slugify(cleanTitle);

    const newCourse: EnglishCourse = {
      id,
      level,
      title: cleanTitle,
      description: courseDescription.trim() || "Course description will be added later.",
      teacher: teacher.trim() || "English Focus Teacher",
      tag: tag.trim() || "General English",
      progress: 0,
      total: lessons.filter((lesson) => lesson.courseId === id).length,
      status: "Active",
    };

    setCourses((current) => {
      const exists = current.some((course) => course.id === id);
      if (exists) {
        return current.map((course) => (course.id === id ? { ...course, ...newCourse } : course));
      }
      return [newCourse, ...current];
    });
  }

  function addLesson() {
    const cleanTitle = lessonTitle.trim();
    const cleanCourse = courseTitle.trim();

    if (!cleanCourse) {
      alert("Course title is required.");
      return;
    }

    if (!cleanTitle) {
      alert("Lesson title is required.");
      return;
    }

    const courseId = slugify(cleanCourse);

    if (!courses.some((course) => course.id === courseId)) {
      upsertCourse();
    }

    const newLesson: EnglishLesson = {
      id: slugify(cleanTitle),
      courseId,
      level,
      course: cleanCourse,
      title: cleanTitle,
      skill,
      duration: duration.trim() || "10 min",
      description:
        lessonDescription.trim() ||
        "Lesson description will be completed by the admin.",
      objective:
        objective.trim() ||
        "Understand the lesson topic and apply it in practical English.",
      status: "Draft",
      video: "pending",
      pdf: "pending",
      quizQuestions: 0,
      quiz: [],
    };

    setLessons((current) => {
      const exists = current.some((lesson) => lesson.id === newLesson.id && lesson.courseId === newLesson.courseId);

      if (exists) {
        return current.map((lesson) =>
          lesson.id === newLesson.id && lesson.courseId === newLesson.courseId
            ? { ...lesson, ...newLesson, quiz: lesson.quiz || [] }
            : lesson
        );
      }

      return [newLesson, ...current];
    });

    setCourses((current) =>
      current.map((course) =>
        course.id === courseId
          ? {
              ...course,
              total: lessons.filter((lesson) => lesson.courseId === courseId).length + 1,
            }
          : course
      )
    );

    setLessonTitle("");
    setLessonDescription("");
    setObjective("");
  }

  function publishLesson(id: string, courseId: string) {
    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === id && lesson.courseId === courseId
          ? { ...lesson, status: "Published" }
          : lesson
      )
    );
  }

  function deleteLesson(id: string, courseId: string) {
    setLessons((current) =>
      current.filter((lesson) => !(lesson.id === id && lesson.courseId === courseId))
    );
  }

  function deleteCourse(id: string) {
    setCourses((current) => current.filter((course) => course.id !== id));
    setLessons((current) => current.filter((lesson) => lesson.courseId !== id));
  }

  const [videoPath, setVideoPath] = useState("");
  const [pdfPath, setPdfPath] = useState("");

  function saveResourcePaths() {
    if (!selectedLesson) return;

    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === selectedLesson.id && lesson.courseId === selectedLesson.courseId
          ? {
              ...lesson,
              video: videoPath.trim() || lesson.video,
              pdf: pdfPath.trim() || lesson.pdf,
            }
          : lesson
      )
    );

    setVideoPath("");
    setPdfPath("");
  }

  function markResourcesReady() {
    if (!selectedLesson) return;

    setLessons((current) =>
      current.map((lesson) =>
        lesson.id === selectedLesson.id && lesson.courseId === selectedLesson.courseId
          ? { ...lesson, status: "Published" }
          : lesson
      )
    );
  }

  function addQuizQuestion() {
    if (!selectedLesson) return;

    const cleanQuestion = question.trim();
    const choices: [string, string, string, string] = [
      choiceA.trim(),
      choiceB.trim(),
      choiceC.trim(),
      choiceD.trim(),
    ];

    if (!cleanQuestion || choices.some((choice) => !choice)) {
      alert("Question and all four choices are required.");
      return;
    }

    const newQuestion: EnglishQuizQuestion = {
      id: `q-${Date.now()}`,
      question: cleanQuestion,
      choices,
      correctIndex,
      explanation: explanation.trim() || "Explanation will be added later.",
    };

    setLessons((current) =>
      current.map((lesson) => {
        if (lesson.id !== selectedLesson.id || lesson.courseId !== selectedLesson.courseId) {
          return lesson;
        }

        const quiz = [...(lesson.quiz || []), newQuestion];

        return {
          ...lesson,
          quiz,
          quizQuestions: quiz.length,
        };
      })
    );

    setQuestion("");
    setChoiceA("");
    setChoiceB("");
    setChoiceC("");
    setChoiceD("");
    setCorrectIndex(0);
    setExplanation("");
  }

  function deleteQuizQuestion(questionId: string) {
    if (!selectedLesson) return;

    setLessons((current) =>
      current.map((lesson) => {
        if (lesson.id !== selectedLesson.id || lesson.courseId !== selectedLesson.courseId) {
          return lesson;
        }

        const quiz = (lesson.quiz || []).filter((item) => item.id !== questionId);

        return {
          ...lesson,
          quiz,
          quizQuestions: quiz.length,
        };
      })
    );
  }

  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Content builder</h1>
          <p>
            Create courses, lessons, upload video/PDF resources and build quizzes.
            The student area reads the same saved content.
          </p>
        </div>

        <div className="ef-admin-hero-actions">
          <button className="ef-admin-white-btn" onClick={addLesson}>
            Add lesson
          </button>
          <button className="ef-admin-ghost-btn" onClick={resetContent}>
            Reset demo content
          </button>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat">
          <span>Courses</span>
          <strong>{stats.courses}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Lessons</span>
          <strong>{stats.lessons}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Quiz questions</span>
          <strong>{stats.quizzes}</strong>
        </div>
      </div>

      <div className="ef-admin-board">
        <aside className="ef-admin-panel">
          <h2>Create content</h2>
          <p>
            Create or update a course, then add lessons. Resources and quizzes are managed from the right panel.
          </p>

          <div className="ef-admin-form">
            <div className="ef-admin-field">
              <label>Level</label>
              <select className="ef-admin-select" value={level} onChange={(e) => setLevel(e.target.value as EnglishLevel)}>
                {englishLevels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="ef-admin-field">
              <label>Course title</label>
              <input className="ef-admin-input" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
            </div>

            <div className="ef-admin-field">
              <label>Course description</label>
              <textarea className="ef-admin-textarea" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
            </div>

            <div className="ef-admin-field">
              <label>Teacher</label>
              <input className="ef-admin-input" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
            </div>

            <div className="ef-admin-field">
              <label>Tag</label>
              <input className="ef-admin-input" value={tag} onChange={(e) => setTag(e.target.value)} />
            </div>

            <button className="ef-admin-outline" onClick={upsertCourse}>
              Save course
            </button>

            <hr style={{ border: 0, borderTop: "1px solid var(--ef-border)", margin: "8px 0" }} />

            <div className="ef-admin-field">
              <label>Lesson title</label>
              <input className="ef-admin-input" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Example: Question Forms 2" />
            </div>

            <div className="ef-admin-field">
              <label>Skill</label>
              <select className="ef-admin-select" value={skill} onChange={(e) => setSkill(e.target.value as EnglishSkill)}>
                {englishSkills.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="ef-admin-field">
              <label>Duration</label>
              <input className="ef-admin-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div className="ef-admin-field">
              <label>Lesson description</label>
              <textarea className="ef-admin-textarea" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} placeholder="What does this lesson cover?" />
            </div>

            <div className="ef-admin-field">
              <label>Lesson objective</label>
              <textarea className="ef-admin-textarea" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="What should the student be able to do?" />
            </div>

            <button className="ef-admin-submit" onClick={addLesson}>
              Add lesson
            </button>
          </div>
        </aside>

        <section className="ef-admin-panel">
          <div className="ef-admin-tabs">
            {(["Courses", "Lessons", "Resources", "Quiz"] as const).map((tab) => (
              <button key={tab} className={activeTab === tab ? "ef-admin-tab active" : "ef-admin-tab"} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Courses" && (
            <>
              <h2>Courses library</h2>
              <p>Student course cards are generated from this list.</p>

              <div className="ef-admin-content-grid">
                {courses.map((course) => (
                  <article className="ef-admin-content-card" key={course.id}>
                    <div>
                      <div className="ef-admin-content-title">{course.title}</div>
                      <div className="ef-admin-content-meta">
                        <span className="ef-admin-badge green">{course.level}</span>
                        <span className="ef-admin-badge">{course.tag}</span>
                        <span className="ef-admin-badge">{course.teacher}</span>
                        <span className="ef-admin-badge">{course.status}</span>
                      </div>
                    </div>

                    <div className="ef-admin-actions">
                      <button className="ef-admin-icon-btn" onClick={() => deleteCourse(course.id)}>×</button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "Lessons" && (
            <>
              <h2>Lessons library</h2>
              <p>Manage lessons by level, course, skill and publication status.</p>

              <div className="ef-admin-content-grid">
                {lessons.map((lesson) => (
                  <article className="ef-admin-content-card" key={lessonKey(lesson)}>
                    <div>
                      <div className="ef-admin-content-title">
                        {lesson.level} · {lesson.title}
                      </div>

                      <div className="ef-admin-content-meta">
                        <span className="ef-admin-badge green">{lesson.course}</span>
                        <span className="ef-admin-badge">{lesson.skill}</span>
                        <span className="ef-admin-badge">{lesson.duration}</span>
                        <span className={lesson.status === "Published" ? "ef-admin-badge green" : "ef-admin-badge"}>
                          {lesson.status}
                        </span>
                        <span className={lesson.video !== "pending" ? "ef-admin-badge green" : "ef-admin-badge"}>
                          Video
                        </span>
                        <span className={lesson.pdf !== "pending" ? "ef-admin-badge green" : "ef-admin-badge"}>
                          PDF
                        </span>
                        <span className={(lesson.quiz?.length || 0) > 0 ? "ef-admin-badge green" : "ef-admin-badge"}>
                          {(lesson.quiz?.length || 0)} quiz
                        </span>
                      </div>
                    </div>

                    <div className="ef-admin-actions">
                      <button className="ef-admin-icon-btn" onClick={() => publishLesson(lesson.id, lesson.courseId)}>✓</button>
                      <button className="ef-admin-icon-btn" onClick={() => deleteLesson(lesson.id, lesson.courseId)}>×</button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "Resources" && (
            <>
              <h2>Video and PDF resources</h2>
              <p>Select a lesson and attach a video file and PDF notes.</p>

              <div className="ef-admin-field">
                <label>Selected lesson</label>
                <select className="ef-admin-select" value={effectiveLessonKey} onChange={(e) => setSelectedLessonKey(e.target.value)}>
                  {lessons.map((lesson) => (
                    <option value={lessonKey(lesson)} key={lessonKey(lesson)}>
                      {lesson.course} · {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLesson && (
                <div className="ef-resource-studio">
                  <div className="ef-resource-card">
                    <h3>{selectedLesson.title}</h3>
                    <p>{selectedLesson.description}</p>

                    <div className="ef-upload-grid">
                      <div className="ef-upload-tile">
                        <strong>Video lesson path</strong>
                        <span>
                          Put your MP4 in public/uploads/videos, then enter a path like /uploads/videos/question-forms-1.mp4.
                        </span>
                        <input
                          className="ef-admin-input"
                          value={videoPath}
                          onChange={(event) => setVideoPath(event.target.value)}
                          placeholder={selectedLesson.video || "/uploads/videos/lesson.mp4"}
                        />
                        <div className="ef-current-file">
                          Current video: <b>{selectedLesson.video || "No video path"}</b>
                        </div>
                      </div>

                      <div className="ef-upload-tile">
                        <strong>PDF notes path</strong>
                        <span>
                          Put your PDF in public/uploads/pdfs, then enter a path like /uploads/pdfs/question-forms-1.pdf.
                        </span>
                        <input
                          className="ef-admin-input"
                          value={pdfPath}
                          onChange={(event) => setPdfPath(event.target.value)}
                          placeholder={selectedLesson.pdf || "/uploads/pdfs/lesson.pdf"}
                        />
                        <div className="ef-current-file">
                          Current PDF: <b>{selectedLesson.pdf || "No PDF path"}</b>
                        </div>
                      </div>
                    </div>

                    <div className="ef-path-help">
                      To test locally, copy files here:
                      <br />
                      <code>public/uploads/videos/your-video.mp4</code>
                      <br />
                      <code>public/uploads/pdfs/your-notes.pdf</code>
                    </div>

                    <br />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="ef-admin-submit" onClick={saveResourcePaths}>
                        Save paths
                      </button>

                      <button className="ef-admin-outline" onClick={markResourcesReady}>
                        Mark lesson as published
                      </button>
                    </div>
                  </div>

                  <aside className="ef-selected-lesson-box">
                    <h4>Lesson status</h4>
                    <p>
                      Status: <b>{selectedLesson.status}</b><br />
                      Skill: <b>{selectedLesson.skill}</b><br />
                      Duration: <b>{selectedLesson.duration}</b><br />
                      Quiz: <b>{selectedLesson.quiz?.length || 0} questions</b>
                    </p>
                  </aside>
                </div>
              )}
            </>
          )}

          {activeTab === "Quiz" && (
            <>
              <h2>Quiz editor</h2>
              <p>Create quiz questions with four choices, one correct answer and a clear explanation.</p>

              <div className="ef-admin-field">
                <label>Selected lesson</label>
                <select className="ef-admin-select" value={effectiveLessonKey} onChange={(e) => setSelectedLessonKey(e.target.value)}>
                  {lessons.map((lesson) => (
                    <option value={lessonKey(lesson)} key={lessonKey(lesson)}>
                      {lesson.course} · {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLesson && (
                <div className="ef-quiz-editor">
                  <div className="ef-resource-card">
                    <h3>Add question</h3>
                    <p>{selectedLesson.title}</p>

                    <div className="ef-admin-form">
                      <div className="ef-admin-field">
                        <label>Question</label>
                        <input className="ef-admin-input" value={question} onChange={(e) => setQuestion(e.target.value)} />
                      </div>

                      <div className="ef-quiz-option">
                        <span className="ef-quiz-letter">A</span>
                        <input className="ef-admin-input" value={choiceA} onChange={(e) => setChoiceA(e.target.value)} />
                      </div>

                      <div className="ef-quiz-option">
                        <span className="ef-quiz-letter">B</span>
                        <input className="ef-admin-input" value={choiceB} onChange={(e) => setChoiceB(e.target.value)} />
                      </div>

                      <div className="ef-quiz-option">
                        <span className="ef-quiz-letter">C</span>
                        <input className="ef-admin-input" value={choiceC} onChange={(e) => setChoiceC(e.target.value)} />
                      </div>

                      <div className="ef-quiz-option">
                        <span className="ef-quiz-letter">D</span>
                        <input className="ef-admin-input" value={choiceD} onChange={(e) => setChoiceD(e.target.value)} />
                      </div>

                      <div className="ef-admin-field">
                        <label>Correct answer</label>
                        <select className="ef-admin-select" value={correctIndex} onChange={(e) => setCorrectIndex(Number(e.target.value))}>
                          <option value={0}>A</option>
                          <option value={1}>B</option>
                          <option value={2}>C</option>
                          <option value={3}>D</option>
                        </select>
                      </div>

                      <div className="ef-admin-field">
                        <label>Explanation</label>
                        <textarea className="ef-admin-textarea" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
                      </div>

                      <button className="ef-admin-submit" onClick={addQuizQuestion}>
                        Add question
                      </button>
                    </div>
                  </div>

                  <aside className="ef-resource-card">
                    <h3>Questions</h3>
                    <p>{selectedLesson.quiz?.length || 0} questions attached to this lesson.</p>

                    {(selectedLesson.quiz || []).map((item, questionIndex) => (
                      <div className="ef-quiz-question-card" key={item.id}>
                        <h4>{questionIndex + 1}. {item.question}</h4>

                        <div className="ef-quiz-choice-list">
                          {item.choices.map((choice, index) => (
                            <div className={index === item.correctIndex ? "ef-quiz-choice-row correct" : "ef-quiz-choice-row"} key={choice}>
                              <span>{String.fromCharCode(65 + index)}</span>
                              <span>{choice}</span>
                            </div>
                          ))}
                        </div>

                        <div className="ef-current-file">
                          Explanation: <b>{item.explanation}</b>
                        </div>

                        <button className="ef-quiz-delete" onClick={() => deleteQuizQuestion(item.id)}>
                          Delete question
                        </button>
                      </div>
                    ))}
                  </aside>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
