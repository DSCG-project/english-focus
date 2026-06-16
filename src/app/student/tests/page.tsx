import { StudentShell } from "@/components/layout/StudentShell";

export default function Page() {
  return (
    <StudentShell>
      <div className="ef-topbar">
        <div>
          <h1 className="ef-section-title">Tests</h1>
          <p className="ef-section-text">Level tests and final assessments.</p>
        </div>
      </div>
      <div className="ef-card">Placement tests and final tests will be added here.</div>
    </StudentShell>
  );
}
