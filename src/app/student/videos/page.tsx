import { StudentShell } from "@/components/layout/StudentShell";

export default function VideosPage() {
  return (
    <StudentShell>
      <div className="ef-section-head">
        <h1 className="ef-section-title">Videos</h1>
      </div>

      <section className="ef-event-card">
        <h3>Video library</h3>
        <p>Uploaded video lessons will be displayed here.</p>
      </section>
    </StudentShell>
  );
}
