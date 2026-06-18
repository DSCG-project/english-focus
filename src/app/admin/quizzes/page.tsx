import { AdminShell } from "@/components/layout/AdminShell";

export default function Page() {
  return (
    <AdminShell>
      <section className="ef-admin-hero">
        <div>
          <h1>Quizzes</h1>
          <p>Create questions, four answer choices, one correct answer and explanations.</p>
        </div>
      </section>
      <div className="ef-admin-panel">Quiz builder will be connected later.</div>
    </AdminShell>
  );
}
