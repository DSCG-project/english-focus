import { StudentShell } from "@/components/layout/StudentShell";

export default function Page() {
  return (
    <StudentShell>
      <div className="ef-topbar">
        <div>
          <h1 className="ef-section-title">Quizzes</h1>
          <p className="ef-section-text">Practice questions with automatic correction and explanations.</p>
        </div>
      </div>
      <div className="ef-card">Quizzes will be connected to lessons and levels.</div>
    </StudentShell>
  );
}
