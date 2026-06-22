"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  EnglishCourse,
  EnglishLesson,
  EnglishQuizQuestion,
  englishSkills,
  slugify,
} from "@/lib/englishContent";
import { useEnglishContent } from "@/lib/useEnglishContent";

type TabName = "Structure" | "Resources" | "Test";
type ResourceTarget = "video" | "coursePdf" | "exercisesPdf" | "notesPdf";
type IconName = "save" | "plus" | "trash" | "edit" | "upload" | "eye" | "magic" | "x";

function lessonKey(lesson: EnglishLesson) {
  return `${lesson.courseId}__${lesson.id}`;
}

function lessonNumber(title: string) {
  const match = title.match(/Lesson\s+(\d+)/i);
  return match ? Number(match[1]) : 999;
}

function resourceLabel(target: ResourceTarget) {
  if (target === "video") return "Video";
  if (target === "coursePdf") return "Course";
  if (target === "exercisesPdf") return "Exercises";
  return "Notes";
}

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "save") {
    return (
      <svg {...common}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
      </svg>
    );
  }

  if (name === "edit") {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (name === "upload") {
    return (
      <svg {...common}>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M20 16v4H4v-4" />
      </svg>
    );
  }

  if (name === "eye") {
    return (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "magic") {
    return (
      <svg {...common}>
        <path d="M15 4V2" />
        <path d="M15 16v-2" />
        <path d="M8 9H6" />
        <path d="M20 9h-2" />
        <path d="m16 10-2-2 2-2 2 2Z" />
        <path d="M11 13 4 20" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconButton({
  icon,
  label,
  onClick,
  tone = "soft",
  disabled,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  tone?: "primary" | "soft" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`ef-large-icon-btn ${tone}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon name={icon} />
    </button>
  );
}

function emptyQuestion(): [string, string, string, string] {
  return ["", "", "", ""];
}

export default function AdminContentPage() {
  const {
    levels,
    setLevels,
    courses,
    setCourses,
    lessons,
    setLessons,
    resetContent,
  } = useEnglishContent();

  const [tab, setTab] = useState<TabName>("Structure");
  const [currentLevel, setCurrentLevel] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonKey, setSelectedLessonKey] = useState("");
  const [lessonSearch, setLessonSearch] = useState("");
  const [notice, setNotice] = useState("");

  const [levelName, setLevelName] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTeacher, setCourseTeacher] = useState("English Focus Team");
  const [courseTag, setCourseTag] = useState("General English");
  const [courseStatus, setCourseStatus] = useState<EnglishCourse["status"]>("Active");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSkill, setLessonSkill] = useState("Grammar");
  const [lessonDuration, setLessonDuration] = useState("12 min");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonObjective, setLessonObjective] = useState("");
  const [lessonStatus, setLessonStatus] = useState<EnglishLesson["status"]>("Published");

  const [uploading, setUploading] = useState<ResourceTarget | null>(null);

  const [editingQuestionId, setEditingQuestionId] = useState("");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<[string, string, string, string]>(emptyQuestion());
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (!currentLevel && levels[0]) {
      setCurrentLevel(levels[0]);
      setLevelName(levels[0]);
    }
  }, [levels, currentLevel]);

  const levelCourses = useMemo(() => {
    return courses
      .filter((course) => course.level === currentLevel)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses, currentLevel]);

  useEffect(() => {
    const firstCourseId = levelCourses[0]?.id || "";

    if (!selectedCourseId || !levelCourses.some((course) => course.id === selectedCourseId)) {
      setSelectedCourseId(firstCourseId);
      setSelectedLessonKey("");
    }
  }, [levelCourses, selectedCourseId]);

  const selectedCourse = useMemo(() => {
    return levelCourses.find((course) => course.id === selectedCourseId);
  }, [levelCourses, selectedCourseId]);

  const courseLessons = useMemo(() => {
    const clean = lessonSearch.trim().toLowerCase();

    return lessons
      .filter((lesson) => lesson.courseId === selectedCourseId)
      .filter((lesson) => {
        if (!clean) return true;
        return (
          lesson.title.toLowerCase().includes(clean) ||
          lesson.skill.toLowerCase().includes(clean)
        );
      })
      .sort((a, b) => lessonNumber(a.title) - lessonNumber(b.title));
  }, [lessons, selectedCourseId, lessonSearch]);

  const selectedLesson = useMemo(() => {
    return lessons.find((lesson) => lessonKey(lesson) === selectedLessonKey);
  }, [lessons, selectedLessonKey]);

  useEffect(() => {
    const firstLesson = courseLessons[0];
    const selectedStillExists = courseLessons.some((lesson) => lessonKey(lesson) === selectedLessonKey);

    if (firstLesson && (!selectedLessonKey || !selectedStillExists)) {
      setSelectedLessonKey(lessonKey(firstLesson));
    }
  }, [courseLessons, selectedLessonKey]);

  const activeLesson = selectedLesson || courseLessons[0];

  useEffect(() => {
    if (!selectedCourse) {
      setCourseTitle("");
      setCourseDescription("");
      setCourseTeacher("English Focus Team");
      setCourseTag("General English");
      setCourseStatus("Active");
      return;
    }

    setCourseTitle(selectedCourse.title);
    setCourseDescription(selectedCourse.description);
    setCourseTeacher(selectedCourse.teacher);
    setCourseTag(selectedCourse.tag);
    setCourseStatus(selectedCourse.status);
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedLesson) {
      setLessonTitle("");
      setLessonSkill("Grammar");
      setLessonDuration("12 min");
      setLessonDescription("");
      setLessonObjective("");
      setLessonStatus("Published");
      return;
    }

    setLessonTitle(selectedLesson.title);
    setLessonSkill(selectedLesson.skill);
    setLessonDuration(selectedLesson.duration);
    setLessonDescription(selectedLesson.description);
    setLessonObjective(selectedLesson.objective);
    setLessonStatus(selectedLesson.status);
  }, [selectedLesson]);

  const stats = useMemo(() => {
    const levelLessons = lessons.filter((lesson) => lesson.level === currentLevel);
    return {
      levels: levels.length,
      courses: levelCourses.length,
      lessons: levelLessons.length,
      resources: levelLessons.filter((lesson) => lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf).length,
      tests: levelLessons.filter((lesson) => (lesson.quiz?.length || 0) > 0).length,
    };
  }, [levels, levelCourses, lessons, currentLevel]);

  function setLevelContext(value: string) {
    setCurrentLevel(value);
    setLevelName(value);
    setSelectedCourseId("");
    setSelectedLessonKey("");
    setLessonSearch("");
    setNotice("");
  }

  function saveLevel() {
    const clean = levelName.trim();

    if (!clean) {
      setNotice("Level name is required.");
      return;
    }

    if (currentLevel && levels.includes(currentLevel)) {
      setLevels((items) => items.map((level) => (level === currentLevel ? clean : level)));
      setCourses((items) => items.map((course) => course.level === currentLevel ? { ...course, level: clean } : course));
      setLessons((items) => items.map((lesson) => lesson.level === currentLevel ? { ...lesson, level: clean } : lesson));
    } else {
      setLevels((items) => items.includes(clean) ? items : [...items, clean]);
    }

    setLevelContext(clean);
    setNotice("Level saved.");
  }

  function newLevel() {
    setCurrentLevel("");
    setLevelName("");
    setSelectedCourseId("");
    setSelectedLessonKey("");
  }

  function deleteLevel() {
    if (!currentLevel) return;
    if (!confirm("Delete this level with its courses and lessons?")) return;

    const courseIds = courses.filter((course) => course.level === currentLevel).map((course) => course.id);

    setLevels((items) => items.filter((level) => level !== currentLevel));
    setCourses((items) => items.filter((course) => course.level !== currentLevel));
    setLessons((items) => items.filter((lesson) => !courseIds.includes(lesson.courseId)));

    setLevelContext(levels.find((level) => level !== currentLevel) || "");
    setNotice("Level deleted.");
  }

  function saveCourse() {
    const cleanTitle = courseTitle.trim();

    if (!currentLevel) {
      setNotice("Select or create a level first.");
      return;
    }

    if (!cleanTitle) {
      setNotice("Course title is required.");
      return;
    }

    const id = selectedCourse?.id || slugify(cleanTitle);

    const payload: EnglishCourse = {
      id,
      level: currentLevel,
      title: cleanTitle,
      description: courseDescription.trim(),
      teacher: courseTeacher.trim() || "English Focus Team",
      tag: courseTag.trim() || "General English",
      progress: selectedCourse?.progress || 0,
      total: lessons.filter((lesson) => lesson.courseId === id).length,
      status: courseStatus,
    };

    setCourses((items) => {
      const exists = items.some((course) => course.id === id);
      return exists ? items.map((course) => course.id === id ? payload : course) : [payload, ...items];
    });

    setLessons((items) =>
      items.map((lesson) =>
        lesson.courseId === id
          ? { ...lesson, course: payload.title, level: payload.level }
          : lesson
      )
    );

    setSelectedCourseId(id);
    setNotice("Course saved.");
  }

  function newCourse() {
    setSelectedCourseId("");
    setSelectedLessonKey("");
    setCourseTitle("");
    setCourseDescription("");
    setCourseTeacher("English Focus Team");
    setCourseTag(currentLevel === "Business English" ? "Business English" : "General English");
    setCourseStatus("Active");
  }

  function deleteCourse() {
    if (!selectedCourse) return;
    if (!confirm("Delete this course and all its lessons?")) return;

    setCourses((items) => items.filter((course) => course.id !== selectedCourse.id));
    setLessons((items) => items.filter((lesson) => lesson.courseId !== selectedCourse.id));
    setSelectedCourseId("");
    setSelectedLessonKey("");
    setNotice("Course deleted.");
  }

  function saveLesson() {
    if (!selectedCourse) {
      setNotice("Select a course first.");
      return;
    }

    const cleanTitle = lessonTitle.trim();

    if (!cleanTitle) {
      setNotice("Lesson title is required.");
      return;
    }

    const id = selectedLesson?.id || slugify(cleanTitle);

    const payload: EnglishLesson = {
      id,
      courseId: selectedCourse.id,
      level: selectedCourse.level,
      course: selectedCourse.title,
      title: cleanTitle,
      skill: lessonSkill,
      duration: lessonDuration.trim() || "12 min",
      description: lessonDescription.trim(),
      objective: lessonObjective.trim(),
      status: lessonStatus,
      video: selectedLesson?.video || "",
      pdf: selectedLesson?.pdf || "",
      coursePdf: selectedLesson?.coursePdf || "",
      exercisesPdf: selectedLesson?.exercisesPdf || "",
      notesPdf: selectedLesson?.notesPdf || "",
      quizQuestions: selectedLesson?.quiz?.length || selectedLesson?.quizQuestions || 0,
      quiz: selectedLesson?.quiz || [],
    };

    setLessons((items) => {
      if (selectedLesson) {
        return items.map((lesson) => lessonKey(lesson) === lessonKey(selectedLesson) ? payload : lesson);
      }

      return [payload, ...items];
    });

    setSelectedLessonKey(lessonKey(payload));
    setNotice("Lesson saved.");
  }

  function newLesson() {
    const nextNumber = lessons.filter((lesson) => lesson.courseId === selectedCourseId).length + 1;
    const generatedTitle = `Lesson ${String(nextNumber).padStart(2, "0")} - New Lesson`;

    setSelectedLessonKey("");
    setLessonTitle(generatedTitle);
    setLessonSkill("Grammar");
    setLessonDuration("12 min");
    setLessonDescription("");
    setLessonObjective("");
    setLessonStatus("Published");
    setNotice("New lesson prepared with an automatic title.");
  }

  function deleteLesson() {
    if (!selectedLesson) return;
    if (!confirm("Delete this lesson?")) return;

    setLessons((items) => items.filter((lesson) => lessonKey(lesson) !== lessonKey(selectedLesson)));
    setSelectedLessonKey("");
    setNotice("Lesson deleted.");
  }

  async function uploadResource(target: ResourceTarget, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !activeLesson) return;

    setUploading(target);
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("type", target === "video" ? "video" : "pdf");
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.ok || !result.path) {
        throw new Error(result.error || "Upload failed.");
      }

      setLessons((items) =>
        items.map((lesson) =>
          lessonKey(lesson) === lessonKey(activeLesson)
            ? ({ ...lesson, [target]: result.path, status: "Published" } as EnglishLesson)
            : lesson
        )
      );

      setNotice(`${resourceLabel(target)} uploaded.`);
      event.target.value = "";
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  function clearResource(target: ResourceTarget) {
    if (!activeLesson) return;

    setLessons((items) =>
      items.map((lesson) =>
        lessonKey(lesson) === lessonKey(activeLesson)
          ? ({ ...lesson, [target]: "" } as EnglishLesson)
          : lesson
      )
    );

    setNotice(`${resourceLabel(target)} removed.`);
  }

  function updateChoice(index: number, value: string) {
    setChoices((items) => {
      const next = [...items] as [string, string, string, string];
      next[index] = value;
      return next;
    });
  }

  function resetQuestionForm() {
    setEditingQuestionId("");
    setQuestion("");
    setChoices(emptyQuestion());
    setCorrectIndex(0);
    setExplanation("");
  }

  function editQuestion(item: EnglishQuizQuestion) {
    setEditingQuestionId(item.id);
    setQuestion(item.question);
    setChoices(item.choices);
    setCorrectIndex(item.correctIndex);
    setExplanation(item.explanation);
  }

  function saveQuestion() {
    if (!activeLesson) {
      setNotice("Select a lesson first.");
      return;
    }

    const cleanQuestion = question.trim();
    const cleanChoices: [string, string, string, string] = [
      choices[0].trim(),
      choices[1].trim(),
      choices[2].trim(),
      choices[3].trim(),
    ];

    if (!cleanQuestion || cleanChoices.some((choice) => !choice)) {
      setNotice("Question and four choices are required.");
      return;
    }

    const currentQuiz = activeLesson.quiz || [];

    if (!editingQuestionId && currentQuiz.length >= 10) {
      setNotice("A QCM test can contain 10 questions maximum.");
      return;
    }

    const payload: EnglishQuizQuestion = {
      id: editingQuestionId || `q-${Date.now()}`,
      question: cleanQuestion,
      choices: cleanChoices,
      correctIndex,
      explanation: explanation.trim() || "Explanation will be added later.",
    };

    setLessons((items) =>
      items.map((lesson) => {
        if (lessonKey(lesson) !== lessonKey(activeLesson)) return lesson;

        const oldQuiz = lesson.quiz || [];
        const nextQuiz = editingQuestionId
          ? oldQuiz.map((item) => item.id === editingQuestionId ? payload : item)
          : [...oldQuiz, payload];

        return {
          ...lesson,
          quiz: nextQuiz,
          quizQuestions: nextQuiz.length,
        };
      })
    );

    resetQuestionForm();
    setNotice("Question saved.");
  }

  function deleteQuestion(questionId: string) {
    if (!activeLesson) return;

    setLessons((items) =>
      items.map((lesson) => {
        if (lessonKey(lesson) !== lessonKey(activeLesson)) return lesson;

        const nextQuiz = (lesson.quiz || []).filter((item) => item.id !== questionId);

        return {
          ...lesson,
          quiz: nextQuiz,
          quizQuestions: nextQuiz.length,
        };
      })
    );

    if (editingQuestionId === questionId) resetQuestionForm();
    setNotice("Question deleted.");
  }

  function generateDemoTest() {
    if (!activeLesson) return;

    const quiz: EnglishQuizQuestion[] = Array.from({ length: 10 }).map((_, index) => ({
      id: `auto-${Date.now()}-${index + 1}`,
      question: `Question ${index + 1}: Choose the correct answer.`,
      choices: ["Correct answer", "Incorrect answer 1", "Incorrect answer 2", "Incorrect answer 3"],
      correctIndex: 0,
      explanation: "This is the correct answer because it follows the rule explained in the lesson.",
    }));

    setLessons((items) =>
      items.map((lesson) =>
        lessonKey(lesson) === lessonKey(activeLesson)
          ? { ...lesson, quiz, quizQuestions: quiz.length }
          : lesson
      )
    );

    setNotice("10 demo questions generated.");
  }

  const quiz = activeLesson?.quiz || [];

  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Content studio</h1>
          <p>Manage the full catalogue by level, course and lesson.</p>
        </div>

        <div className="ef-admin-hero-actions">
          {activeLesson && (
            <Link href={`/student/courses/${activeLesson.courseId}/${activeLesson.id}`} className="ef-admin-white-btn">
              Preview lesson
            </Link>
          )}

          {activeLesson && (
            <Link href={`/student/courses/${activeLesson.courseId}/${activeLesson.id}/test`} className="ef-admin-ghost-btn">
              Preview test
            </Link>
          )}

          <button className="ef-admin-ghost-btn" onClick={resetContent}>
            Reset content
          </button>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat"><span>Levels</span><strong>{stats.levels}</strong></div>
        <div className="ef-admin-stat"><span>Courses in level</span><strong>{stats.courses}</strong></div>
        <div className="ef-admin-stat"><span>Lessons in level</span><strong>{stats.lessons}</strong></div>
        <div className="ef-admin-stat"><span>Resources</span><strong>{stats.resources}</strong></div>
        <div className="ef-admin-stat"><span>Tests</span><strong>{stats.tests}</strong></div>
      </div>

      <div className="ef-large-studio-layout">
        <aside className="ef-large-studio-sidebar">
          <div className="ef-large-active-box">
            <span>Active level</span>
            <strong>{currentLevel || "No level"}</strong>
          </div>

          <div className="ef-admin-field">
            <label>Level</label>
            <select className="ef-admin-select" value={currentLevel} onChange={(event) => setLevelContext(event.target.value)}>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="ef-admin-field">
            <label>Course</label>
            <select className="ef-admin-select" value={selectedCourseId} onChange={(event) => {
              setSelectedCourseId(event.target.value);
              setSelectedLessonKey("");
              setLessonSearch("");
            }}>
              {levelCourses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="ef-admin-field">
            <label>Search lessons</label>
            <input
              className="ef-admin-input"
              value={lessonSearch}
              onChange={(event) => setLessonSearch(event.target.value)}
              placeholder="Search lesson..."
            />
          </div>

          <div className="ef-large-tabs">
            {(["Structure", "Resources", "Test"] as const).map((item) => (
              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="ef-large-lesson-mini-list">
            {courseLessons.slice(0, 80).map((lesson) => (
              <button
                key={lessonKey(lesson)}
                className={lessonKey(lesson) === lessonKey(activeLesson || lesson) ? "active" : ""}
                onClick={() => setSelectedLessonKey(lessonKey(lesson))}
              >
                <span>{lessonNumber(lesson.title) === 999 ? "•" : lessonNumber(lesson.title)}</span>
                <b>{lesson.title}</b>
              </button>
            ))}

            {courseLessons.length === 0 && <div className="ef-empty-mini">No lessons found.</div>}
          </div>
        </aside>

        <main className="ef-large-studio-main">
          {tab === "Structure" && (
            <div className="ef-large-grid">
              <section className="ef-large-card">
                <div className="ef-large-card-head">
                  <div>
                    <h2>Level</h2>
                    <p>Add, rename or remove a level.</p>
                  </div>
                  <div className="ef-icon-toolbar">
                    <IconButton icon="save" label="Save level" tone="primary" onClick={saveLevel} />
                    <IconButton icon="plus" label="New level" onClick={newLevel} />
                    <IconButton icon="trash" label="Delete level" tone="danger" onClick={deleteLevel} disabled={!currentLevel} />
                  </div>
                </div>

                <div className="ef-admin-field">
                  <label>Level name</label>
                  <input className="ef-admin-input" value={levelName} onChange={(event) => setLevelName(event.target.value)} />
                </div>
              </section>

              <section className="ef-large-card">
                <div className="ef-large-card-head">
                  <div>
                    <h2>Course</h2>
                    <p>Edit the selected course subject, status and description.</p>
                  </div>
                  <div className="ef-icon-toolbar">
                    <IconButton icon="save" label="Save course" tone="primary" onClick={saveCourse} />
                    <IconButton icon="plus" label="New course" onClick={newCourse} />
                    <IconButton icon="trash" label="Delete course" tone="danger" onClick={deleteCourse} disabled={!selectedCourse} />
                  </div>
                </div>

                <div className="ef-form-two">
                  <div className="ef-admin-field">
                    <label>Course title</label>
                    <input className="ef-admin-input" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} />
                  </div>

                  <div className="ef-admin-field">
                    <label>Tag / Subject</label>
                    <input className="ef-admin-input" value={courseTag} onChange={(event) => setCourseTag(event.target.value)} />
                  </div>
<div className="ef-admin-field">
                    <label>Status</label>
                    <select className="ef-admin-select" value={courseStatus} onChange={(event) => setCourseStatus(event.target.value as EnglishCourse["status"])}>
                      <option value="Active">Active</option>
                      <option value="Locked">Locked</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="ef-admin-field">
                  <label>Description</label>
                  <textarea className="ef-admin-textarea" value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} />
                </div>
              </section>

              <section className="ef-large-card full">
                <div className="ef-large-card-head">
                  <div>
                    <h2>Lesson</h2>
                    <p>Edit the selected lesson skill and status.</p>
                  </div>
                  <div className="ef-icon-toolbar">
                    <IconButton icon="save" label="Save lesson" tone="primary" onClick={saveLesson} />
                    <IconButton icon="plus" label="New lesson" onClick={newLesson} />
                    <IconButton icon="trash" label="Delete lesson" tone="danger" onClick={deleteLesson} disabled={!selectedLesson} />
                  </div>
                </div>

                <div className="ef-form-two">
<div className="ef-admin-field">
                    <label>Skill</label>
                    <select className="ef-admin-select" value={lessonSkill} onChange={(event) => setLessonSkill(event.target.value)}>
                      {englishSkills.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
<div className="ef-admin-field">
                    <label>Status</label>
                    <select className="ef-admin-select" value={lessonStatus} onChange={(event) => setLessonStatus(event.target.value as EnglishLesson["status"])}>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === "Resources" && (
            <section className="ef-large-card">
              <div className="ef-large-card-head">
                <div>
                  <h2>Resources</h2>
                  <p>Upload video, course PDF, exercises PDF and notes PDF for the selected lesson.</p>
                </div>
              </div>

              {activeLesson ? (
                <>
                  <div className="ef-selected-lesson-strip">
                    <span>Selected lesson</span>
                    <strong>{activeLesson.title}</strong>
                  </div>

                  <div className="ef-large-resource-grid">
                    {(["video", "coursePdf", "exercisesPdf", "notesPdf"] as ResourceTarget[]).map((target) => {
                      const value = activeLesson[target] || "";
                      const isVideo = target === "video";

                      return (
                        <article className={value ? "ef-large-resource-card ready" : "ef-large-resource-card"} key={target}>
                          <div>
                            <h3>{resourceLabel(target)}</h3>
                            <p>{value ? "Uploaded" : "No file uploaded"}</p>
                          </div>

                          <label className="ef-upload-button">
                            <Icon name="upload" />
                            Upload
                            <input type="file" accept={isVideo ? "video/*" : "application/pdf"} onChange={(event) => uploadResource(target, event)} />
                          </label>

                          {uploading === target && <span className="ef-uploading-chip">Uploading...</span>}

                          {value && (
                            <div className="ef-resource-actions-row">
                              <IconButton icon="trash" label="Remove file" tone="danger" onClick={() => clearResource(target)} />
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="ef-empty-mini">Select a lesson first.</div>
              )}
            </section>
          )}

          {tab === "Test" && (
            <div className="ef-large-grid">
              <section className="ef-large-card">
                <div className="ef-large-card-head">
                  <div>
                    <h2>Test editor</h2>
                    <p>10 QCM questions maximum. Score and corrections appear only at the end.</p>
                  </div>
                  <div className="ef-icon-toolbar">
                    <IconButton icon="save" label="Save question" tone="primary" onClick={saveQuestion} />
                    <IconButton icon="x" label="Clear" onClick={resetQuestionForm} />
                    <IconButton icon="magic" label="Generate demo" onClick={generateDemoTest} disabled={!activeLesson} />
                  </div>
                </div>

                {activeLesson ? (
                  <>
                    <div className={quiz.length >= 10 ? "ef-test-count ok compact" : "ef-test-count compact"}>
                      Questions <b>{quiz.length}/10</b>
                    </div>

                    <div className="ef-admin-field">
                      <label>Question</label>
                      <input className="ef-admin-input" value={question} onChange={(event) => setQuestion(event.target.value)} />
                    </div>

                    <div className="ef-choice-grid">
                      {[0, 1, 2, 3].map((index) => (
                        <div className="ef-quiz-option" key={index}>
                          <span className="ef-quiz-letter">{String.fromCharCode(65 + index)}</span>
                          <input className="ef-admin-input" value={choices[index]} onChange={(event) => updateChoice(index, event.target.value)} />
                        </div>
                      ))}
                    </div>

                    <div className="ef-form-two">
                      <div className="ef-admin-field">
                        <label>Correct answer</label>
                        <select className="ef-admin-select" value={correctIndex} onChange={(event) => setCorrectIndex(Number(event.target.value))}>
                          <option value={0}>A</option>
                          <option value={1}>B</option>
                          <option value={2}>C</option>
                          <option value={3}>D</option>
                        </select>
                      </div>

                      <div className="ef-admin-field">
                        <label>Justification</label>
                        <textarea className="ef-admin-textarea small" value={explanation} onChange={(event) => setExplanation(event.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="ef-empty-mini">Select a lesson first.</div>
                )}
              </section>

              <section className="ef-large-card">
                <div className="ef-large-card-head">
                  <div>
                    <h2>Questions</h2>
                    <p>{activeLesson?.title || "No lesson selected"}</p>
                  </div>

                  {activeLesson && (
                    <Link href={`/student/courses/${activeLesson.courseId}/${activeLesson.id}/test`} className="ef-icon-link">
                      <Icon name="eye" />
                    </Link>
                  )}
                </div>

                <div className="ef-admin-question-list">
                  {quiz.map((item, index) => (
                    <article className="ef-admin-question-row" key={item.id}>
                      <div>
                        <strong>{index + 1}. {item.question}</strong>
                        <span>Correct: {String.fromCharCode(65 + item.correctIndex)}</span>
                      </div>

                      <div className="ef-mini-icons">
                        <IconButton icon="edit" label="Edit" onClick={() => editQuestion(item)} />
                        <IconButton icon="trash" label="Delete" tone="danger" onClick={() => deleteQuestion(item.id)} />
                      </div>
                    </article>
                  ))}

                  {quiz.length === 0 && <div className="ef-empty-mini">No questions yet.</div>}
                </div>
              </section>
            </div>
          )}

          {notice && <div className="ef-students-notice">{notice}</div>}
        </main>
      </div>
    </AdminShell>
  );
}
