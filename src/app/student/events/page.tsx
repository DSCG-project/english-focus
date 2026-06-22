import { StudentShell } from "@/components/layout/StudentShell";

export default function EventsPage() {
  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Live practice</span>
          <h1>Events</h1>
          <p>Live events and speaking practice sessions will appear here.</p>
        </div>
      </section>

      <section className="ef-dashboard-panel-final">
        <div className="ef-empty-mini">
          No live events are scheduled yet.
        </div>
      </section>
    </StudentShell>
  );
}
