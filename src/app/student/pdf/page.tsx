import { StudentShell } from "@/components/layout/StudentShell";

export default function Page() {
  return (
    <StudentShell>
      <div className="ef-topbar">
        <div>
          <h1 className="ef-section-title">PDF notes</h1>
          <p className="ef-section-text">Clean lesson notes, vocabulary sheets and summaries.</p>
        </div>
      </div>
      <div className="ef-card">PDF files uploaded by the admin will be displayed here.</div>
    </StudentShell>
  );
}
