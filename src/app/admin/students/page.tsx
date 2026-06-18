import { AdminShell } from "@/components/layout/AdminShell";

export default function Page() {
  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Students</h1>
          <p>Manage student accounts, plans, course access and progress tracking.</p>
        </div>
      </section>
      <div className="ef-admin-panel">Student management will be connected later.</div>
    </AdminShell>
  );
}
