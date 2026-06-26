"use client";

import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

const events = [
  {
    id: "speaking-club",
    title: "Speaking Club",
    date: "Coming soon",
    type: "Live practice",
    description: "Small group speaking sessions for confidence and fluency.",
  },
  {
    id: "business-workshop",
    title: "Business English Workshop",
    date: "Coming soon",
    type: "Workshop",
    description: "Professional English sessions for emails, meetings and presentations.",
  },
  {
    id: "pronunciation-clinic",
    title: "Pronunciation Clinic",
    date: "Coming soon",
    type: "Practice",
    description: "Focused pronunciation and rhythm practice.",
  },
];

export default function StudentEventsPage() {
  return (
    <StudentShell>
      <section className="ef-clean-page-head simple">
        <div>
          <span className="ef-course-eyebrow">Live learning</span>
          <h1>Events</h1>
          <p>Upcoming live sessions and workshops will appear here.</p>
        </div>

        <Link href="/student/courses" className="ef-secondary-action">
          Course library
        </Link>
      </section>

      <section className="ef-event-grid-clean">
        {events.map((event) => (
          <article className="ef-event-clean-card" key={event.id}>
            <span>{event.type}</span>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <b>{event.date}</b>
          </article>
        ))}
      </section>
    </StudentShell>
  );
}
