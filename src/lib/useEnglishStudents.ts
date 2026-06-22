"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type EnglishStudentStatus = "Active" | "Suspended";

export type EnglishStudent = {
  id: string;
  name: string;
  email: string;
  status: EnglishStudentStatus;
  plan: string;
  level: string;
  courseId: string;
  createdAt: string;
};

const STUDENTS_KEY = "english-focus-students";

export const defaultStudents: EnglishStudent[] = [
  {
    id: "student-demo",
    name: "Demo Student",
    email: "student@englishfocus.local",
    status: "Active",
    plan: "Premium",
    level: "B1 Intermediate",
    courseId: "b1-intermediate",
    createdAt: new Date().toISOString(),
  },
];

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

export function useEnglishStudents(): {
  ready: boolean;
  students: EnglishStudent[];
  setStudents: Dispatch<SetStateAction<EnglishStudent[]>>;
  resetStudents: () => void;
} {
  const [ready, setReady] = useState(false);
  const [students, setStudents] = useState<EnglishStudent[]>(defaultStudents);

  useEffect(() => {
    setStudents(readStorage<EnglishStudent[]>(STUDENTS_KEY, defaultStudents));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }, [ready, students]);

  function resetStudents() {
    setStudents(defaultStudents);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(defaultStudents));
    }
  }

  return {
    ready,
    students,
    setStudents,
    resetStudents,
  };
}
