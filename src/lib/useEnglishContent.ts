"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultCourses,
  defaultLessons,
  EnglishCourse,
  EnglishLesson,
} from "@/lib/englishContent";

const COURSES_KEY = "english-focus-courses";
const LESSONS_KEY = "english-focus-lessons";

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

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be unavailable in private mode.
  }
}

export function useEnglishContent() {
  const [courses, setCourses] = useState<EnglishCourse[]>(defaultCourses);
  const [lessons, setLessons] = useState<EnglishLesson[]>(defaultLessons);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCourses(readStorage(COURSES_KEY, defaultCourses));
    setLessons(readStorage(LESSONS_KEY, defaultLessons));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(COURSES_KEY, courses);
  }, [courses, ready]);

  useEffect(() => {
    if (!ready) return;
    writeStorage(LESSONS_KEY, lessons);
  }, [lessons, ready]);

  const publishedLessons = useMemo(
    () => lessons.filter((lesson) => lesson.status === "Published"),
    [lessons]
  );

  function resetContent() {
    setCourses(defaultCourses);
    setLessons(defaultLessons);
  }

  return {
    ready,
    courses,
    setCourses,
    lessons,
    setLessons,
    publishedLessons,
    resetContent,
  };
}
