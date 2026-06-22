import { StudentShell } from "@/components/layout/StudentShell";

export default function TestsPage() {
  return (
    <StudentShell>
      <div className="ef-section-head">
        <h1 className="ef-section-title">Tests</h1>
      </div>

      <section className="ef-event-card">
        <h3>Level tests</h3>
        <p>Placement tests and final assessments will be displayed here.</p>
      </section>
    </StudentShell>
  );
}
