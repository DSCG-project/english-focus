"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { useEnglishContent } from "@/lib/useEnglishContent";
import { useEnglishStudents } from "@/lib/useEnglishStudents";

export default function AccountPage() {
  const { courses } = useEnglishContent();
  const { students } = useEnglishStudents();

  const student = students.find((item) => item.status === "Active") || students[0];
  const allowedCourse = courses.find((course) => course.id === student?.courseId);

  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Settings</span>
          <h1>Account</h1>
          <p>Your learning access, plan and course permissions.</p>
        </div>
      </section>

      <section className="ef-account-premium-card">
        <div className="ef-account-avatar">
          {student?.name?.slice(0, 1).toUpperCase() || "S"}
        </div>

        <div>
          <h2>{student?.name || "Student"}</h2>
          <p>{student?.email || "student@englishfocus.local"}</p>
        </div>
      </section>

      <div className="ef-final-account-grid">
        <div>
          <span>Plan</span>
          <strong>{student?.plan || "Premium"}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{student?.status || "Active"}</strong>
        </div>

        <div>
          <span>Level access</span>
          <strong>{student?.level || "B1 Intermediate"}</strong>
        </div>
      </div>

      <section className="ef-account-course-card">
        <div>
          <span>Course access</span>
          <h3>{allowedCourse?.title || "No course assigned"}</h3>
          <p>{allowedCourse?.description || "Ask the admin to assign a course."}</p>
        </div>

        {allowedCourse && (
          <Link href={`/student/courses/${allowedCourse.id}`} className="ef-mini-primary">
            Open course
          </Link>
        )}
      </section>
    </StudentShell>
  );
}
