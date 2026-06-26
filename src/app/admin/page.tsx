"use client";

import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { useEnglishContent } from "@/lib/useEnglishContent";
import { useEnglishStudents } from "@/lib/useEnglishStudents";

export default function AdminDashboardPage() {
  const { levels, courses, lessons } = useEnglishContent();
  const { students } = useEnglishStudents();

  const resourcesReady = lessons.filter(
    (lesson) => lesson.video || lesson.coursePdf || lesson.exercisesPdf || lesson.notesPdf
  ).length;

  const testsReady = lessons.filter((lesson) => (lesson.quiz?.length || 0) > 0).length;
  const businessCourses = courses.filter((course) => course.level === "Business English").length;

  const cards = [
    {
      title: "Content studio",
      text: "Manage levels, courses, lessons, resources and QCM tests.",
      href: "/admin/content",
      action: "Open studio",
    },
    {
      title: "Catalogue",
      text: "Review the complete course structure and empty lesson framework.",
      href: "/admin/catalogue",
      action: "View catalogue",
    },
    {
      title: "Students",
      text: "Manage student access, plan, level and course permissions.",
      href: "/admin/students",
      action: "Manage students",
    },
    {
      title: "Backup",
      text: "Export, import or reset local MVP content before database migration.",
      href: "/admin/backup",
      action: "Open backup",
    },
  ];

  return (
    <AdminShell>
      <section className="ef-admin-clean-hero">
        <div>
          <span>English Focus Admin</span>
          <h1>Dashboard</h1>
          <p>Control the catalogue, content, students and local MVP backup from one place.</p>
        </div>

        <Link href="/student" className="ef-admin-clean-preview">
          Student preview
        </Link>
      </section>

      <div className="ef-admin-clean-kpis">
        <div>
          <span>Levels</span>
          <strong>{levels.length}</strong>
        </div>
        <div>
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>{lessons.length}</strong>
        </div>
        <div>
          <span>Business courses</span>
          <strong>{businessCourses}</strong>
        </div>
        <div>
          <span>Resources ready</span>
          <strong>{resourcesReady}</strong>
        </div>
        <div>
          <span>Tests ready</span>
          <strong>{testsReady}</strong>
        </div>
        <div>
          <span>Students</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      <section className="ef-admin-clean-grid">
        {cards.map((card) => (
          <article className="ef-admin-clean-card" key={card.href}>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <Link href={card.href} className="ef-mini-primary">
              {card.action}
            </Link>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
