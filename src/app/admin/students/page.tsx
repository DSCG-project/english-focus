"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useEnglishContent } from "@/lib/useEnglishContent";
import {
  EnglishStudent,
  EnglishStudentStatus,
  useEnglishStudents,
} from "@/lib/useEnglishStudents";

function makeId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `student-${Date.now()}`;
}

function SmallIcon({ type }: { type: "save" | "plus" | "trash" | "edit" }) {
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

  if (type === "save") {
    return (
      <svg {...common}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
    );
  }

  if (type === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (type === "trash") {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export default function AdminStudentsPage() {
  const { levels, courses, lessons } = useEnglishContent();
  const { students, setStudents, resetStudents } = useEnglishStudents();

  const [selectedStudentId, setSelectedStudentId] = useState("student-demo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<EnglishStudentStatus>("Active");
  const [plan, setPlan] = useState("Premium");
  const [level, setLevel] = useState("");
  const [courseId, setCourseId] = useState("");
  const [notice, setNotice] = useState("");

  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  const levelCourses = useMemo(() => {
    return courses.filter((course) => course.level === level);
  }, [courses, level]);

  useEffect(() => {
    if (!level && levels[0]) {
      setLevel(levels[0]);
    }
  }, [levels, level]);

  useEffect(() => {
    if (!courseId || !levelCourses.some((course) => course.id === courseId)) {
      setCourseId(levelCourses[0]?.id || "");
    }
  }, [courseId, levelCourses]);

  useEffect(() => {
    if (!selectedStudent) {
      setName("");
      setEmail("");
      setStatus("Active");
      setPlan("Premium");
      setLevel(levels[0] || "");
      setCourseId("");
      return;
    }

    setName(selectedStudent.name);
    setEmail(selectedStudent.email);
    setStatus(selectedStudent.status);
    setPlan(selectedStudent.plan);
    setLevel(selectedStudent.level);
    setCourseId(selectedStudent.courseId);
  }, [selectedStudentId, students, levels, selectedStudent]);

  const activeStudents = students.filter((student) => student.status === "Active").length;
  const suspendedStudents = students.filter((student) => student.status === "Suspended").length;

  function newStudent() {
    setSelectedStudentId("");
    setName("");
    setEmail("");
    setStatus("Active");
    setPlan("Premium");
    setLevel(levels[0] || "");
    setCourseId("");
    setNotice("");
  }

  function saveStudent() {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      setNotice("Name and email are required.");
      return;
    }

    const id = selectedStudent?.id || makeId(cleanEmail);

    const payload: EnglishStudent = {
      id,
      name: cleanName,
      email: cleanEmail,
      status,
      plan: plan.trim() || "Standard",
      level,
      courseId,
      createdAt: selectedStudent?.createdAt || new Date().toISOString(),
    };

    setStudents((current) => {
      const exists = current.some((student) => student.id === id);

      if (exists) {
        return current.map((student) => (student.id === id ? payload : student));
      }

      return [payload, ...current];
    });

    setSelectedStudentId(id);
    setNotice("Student saved successfully.");
  }

  function deleteStudent() {
    if (!selectedStudent) return;

    if (!confirm("Delete this student?")) return;

    setStudents((current) => current.filter((student) => student.id !== selectedStudent.id));
    newStudent();
    setNotice("Student deleted.");
  }

  function getCourseTitle(id: string) {
    return courses.find((course) => course.id === id)?.title || "No course";
  }

  function getCourseLessons(id: string) {
    return lessons.filter((lesson) => lesson.courseId === id).length;
  }

  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Students</h1>
          <p>Manage student access by level, course, plan and account status.</p>
        </div>

        <div className="ef-admin-hero-actions">
          <button className="ef-admin-ghost-btn" onClick={resetStudents}>
            Reset students
          </button>

          <Link href="/student/account" className="ef-admin-white-btn">
            Student preview
          </Link>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat">
          <span>Students</span>
          <strong>{students.length}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Active</span>
          <strong>{activeStudents}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Suspended</span>
          <strong>{suspendedStudents}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
      </div>

      <div className="ef-students-admin-grid">
        <section className="ef-students-form-card">
          <div className="ef-students-card-head">
            <div>
              <h2>Student access</h2>
              <p>Create or update a student and assign course access.</p>
            </div>

            <div className="ef-students-icons">
              <button onClick={saveStudent} title="Save student" className="primary">
                <SmallIcon type="save" />
              </button>
              <button onClick={newStudent} title="New student">
                <SmallIcon type="plus" />
              </button>
              <button onClick={deleteStudent} title="Delete student" className="danger" disabled={!selectedStudent}>
                <SmallIcon type="trash" />
              </button>
            </div>
          </div>

          <div className="ef-form-two">
            <div className="ef-admin-field">
              <label>Student list</label>
              <select
                className="ef-admin-select"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                <option value="">Create new student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} · {student.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="ef-admin-field">
              <label>Status</label>
              <select
                className="ef-admin-select"
                value={status}
                onChange={(event) => setStatus(event.target.value as EnglishStudentStatus)}
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="ef-admin-field">
              <label>Name</label>
              <input
                className="ef-admin-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Student name"
              />
            </div>

            <div className="ef-admin-field">
              <label>Email</label>
              <input
                className="ef-admin-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@email.com"
              />
            </div>

            <div className="ef-admin-field">
              <label>Plan</label>
              <select
                className="ef-admin-select"
                value={plan}
                onChange={(event) => setPlan(event.target.value)}
              >
                <option value="Starter">Starter</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="ef-admin-field">
              <label>Level access</label>
              <select
                className="ef-admin-select"
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value);
                  setCourseId("");
                }}
              >
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="ef-admin-field full">
              <label>Course access</label>
              <select
                className="ef-admin-select"
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
              >
                {levelCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {notice && <div className="ef-students-notice">{notice}</div>}
        </section>

        <aside className="ef-students-list-card">
          <h2>Students list</h2>

          <div className="ef-students-list">
            {students.map((student) => (
              <article className="ef-student-row-admin" key={student.id}>
                <div>
                  <span className={student.status === "Active" ? "active" : "suspended"}>
                    {student.status}
                  </span>
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <small>
                    {student.plan} · {student.level} · {getCourseLessons(student.courseId)} lessons
                  </small>
                </div>

                <button onClick={() => setSelectedStudentId(student.id)} title="Edit student">
                  <SmallIcon type="edit" />
                </button>
              </article>
            ))}
          </div>
        </aside>
      </div>

      {selectedStudent && (
        <section className="ef-student-access-preview">
          <div>
            <span>Selected student</span>
            <strong>{selectedStudent.name}</strong>
          </div>

          <div>
            <span>Allowed level</span>
            <strong>{selectedStudent.level}</strong>
          </div>

          <div>
            <span>Allowed course</span>
            <strong>{getCourseTitle(selectedStudent.courseId)}</strong>
          </div>

          <div>
            <span>Plan</span>
            <strong>{selectedStudent.plan}</strong>
          </div>
        </section>
      )}
    </AdminShell>
  );
}
