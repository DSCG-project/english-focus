"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

const helpItems = [
  {
    title: "How do I start a lesson?",
    text: "Open Courses, choose your level or Business English subject, then click Start or Open.",
  },
  {
    title: "Where are PDFs?",
    text: "PDFs appear in the lesson page and in PDF resources after the admin uploads them.",
  },
  {
    title: "How do tests work?",
    text: "QCM tests show one question at a time. Score and corrections appear only at the end.",
  },
  {
    title: "Why is a course empty?",
    text: "The catalogue structure is ready. Videos, PDFs and tests are added gradually from the admin studio.",
  },
];

export default function StudentHelpPage() {
  return (
    <StudentShell>
      <section className="ef-clean-page-head simple">
        <div>
          <span className="ef-course-eyebrow">Support</span>
          <h1>Help</h1>
          <p>Quick answers for using the English Focus learning platform.</p>
        </div>

        <Link href="/student/courses" className="ef-secondary-action">
          Browse courses
        </Link>
      </section>

      <section className="ef-help-clean-grid">
        {helpItems.map((item) => (
          <article className="ef-help-clean-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </StudentShell>
  );
}
