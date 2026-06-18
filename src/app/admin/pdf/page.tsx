import { AdminShell } from "@/components/layout/AdminShell";

export default function Page() {
  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>PDF Notes</h1>
          <p>Upload summaries, vocabulary sheets, lesson notes and exercise files.</p>
        </div>
      </section>
      <div className="ef-admin-panel">PDF management system will be connected later.</div>
    </AdminShell>
  );
}
