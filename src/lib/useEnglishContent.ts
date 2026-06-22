"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  EnglishCourse,
  EnglishLesson,
  EnglishLevel,
  defaultCourses,
  defaultLessons,
  englishLevels,
} from "@/lib/englishContent";

const LEVELS_KEY = "english-focus-levels";
const COURSES_KEY = "english-focus-courses";
const LESSONS_KEY = "english-focus-lessons";

const LEGACY_FAKE_VIDEO_PATHS = new Set([
  "/uploads/videos/question-forms-1.mp4",
]);

const LEGACY_FAKE_PDF_PATHS = new Set([
  "/uploads/pdfs/question-forms-1.pdf",
]);

function lessonKey(lesson: EnglishLesson) {
  return `${lesson.courseId}__${lesson.id}`;
}

function sanitizeLessons(value: EnglishLesson[]) {
  return value
    .filter((lesson) => !lesson.id.endsWith("-starter-lesson"))
    .map((lesson) => ({
      ...lesson,
      video: LEGACY_FAKE_VIDEO_PATHS.has(lesson.video) ? "" : lesson.video,
      pdf: LEGACY_FAKE_PDF_PATHS.has(lesson.pdf) ? "" : lesson.pdf,
      coursePdf: lesson.coursePdf || "",
      exercisesPdf: lesson.exercisesPdf || "",
      notesPdf: lesson.notesPdf || "",
      description: lesson.description || "",
      objective: lesson.objective || "",
      quiz: lesson.quiz || [],
      quizQuestions: lesson.quiz?.length || lesson.quizQuestions || 0,
    }));
}

function mergeLevels(storedLevels: EnglishLevel[]) {
  return Array.from(new Set([...englishLevels, ...storedLevels]));
}

function mergeCourses(storedCourses: EnglishCourse[]) {
  const map = new Map<string, EnglishCourse>();

  defaultCourses.forEach((course) => map.set(course.id, course));

  storedCourses.forEach((course) => {
    const base = map.get(course.id);

    map.set(course.id, {
      ...(base || course),
      ...course,
      total: base?.total || course.total || 0,
    });
  });

  return Array.from(map.values());
}

function mergeLessons(storedLessons: EnglishLesson[]) {
  const map = new Map<string, EnglishLesson>();

  sanitizeLessons(defaultLessons).forEach((lesson) => {
    map.set(lessonKey(lesson), lesson);
  });

  sanitizeLessons(storedLessons).forEach((lesson) => {
    const base = map.get(lessonKey(lesson));

    map.set(lessonKey(lesson), {
      ...(base || lesson),
      ...lesson,
      coursePdf: lesson.coursePdf || base?.coursePdf || "",
      exercisesPdf: lesson.exercisesPdf || base?.exercisesPdf || "",
      notesPdf: lesson.notesPdf || base?.notesPdf || "",
      quiz: lesson.quiz?.length ? lesson.quiz : base?.quiz || [],
      quizQuestions: lesson.quiz?.length || lesson.quizQuestions || base?.quizQuestions || 0,
    });
  });

  return Array.from(map.values());
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useEnglishContent(): {
  ready: boolean;
  levels: EnglishLevel[];
  setLevels: Dispatch<SetStateAction<EnglishLevel[]>>;
  courses: EnglishCourse[];
  setCourses: Dispatch<SetStateAction<EnglishCourse[]>>;
  lessons: EnglishLesson[];
  setLessons: Dispatch<SetStateAction<EnglishLesson[]>>;
  publishedLessons: EnglishLesson[];
  resetContent: () => void;
} {
  const [ready, setReady] = useState(false);
  const [levels, setLevels] = useState<EnglishLevel[]>(englishLevels);
  const [courses, setCourses] = useState<EnglishCourse[]>(defaultCourses);
  const [lessons, setLessons] = useState<EnglishLesson[]>(defaultLessons);

  useEffect(() => {
    const storedLevels = readStorage<EnglishLevel[]>(LEVELS_KEY, []);
    const storedCourses = readStorage<EnglishCourse[]>(COURSES_KEY, []);
    const storedLessons = readStorage<EnglishLesson[]>(LESSONS_KEY, []);

    const nextLevels = mergeLevels(storedLevels);
    const nextCourses = mergeCourses(storedCourses);
    const nextLessons = mergeLessons(storedLessons);

    setLevels(nextLevels);
    setCourses(nextCourses);
    setLessons(nextLessons);

    window.localStorage.setItem(LEVELS_KEY, JSON.stringify(nextLevels));
    window.localStorage.setItem(COURSES_KEY, JSON.stringify(nextCourses));
    window.localStorage.setItem(LESSONS_KEY, JSON.stringify(nextLessons));

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(LEVELS_KEY, JSON.stringify(levels));
  }, [ready, levels]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }, [ready, courses]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(LESSONS_KEY, JSON.stringify(sanitizeLessons(lessons)));
  }, [ready, lessons]);

  const publishedLessons = useMemo(
    () => lessons.filter((lesson) => lesson.status === "Published"),
    [lessons]
  );

  function resetContent() {
    setLevels(englishLevels);
    setCourses(defaultCourses);
    setLessons(defaultLessons);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LEVELS_KEY, JSON.stringify(englishLevels));
      window.localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
      window.localStorage.setItem(LESSONS_KEY, JSON.stringify(defaultLessons));
      window.localStorage.removeItem("english-focus-test-results");
    }
  }

  return {
    ready,
    levels,
    setLevels,
    courses,
    setCourses,
    lessons,
    setLessons,
    publishedLessons,
    resetContent,
  };
}
