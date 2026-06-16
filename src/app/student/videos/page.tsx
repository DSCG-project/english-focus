import { StudentShell } from "@/components/layout/StudentShell";

export default function Page() {
  return (
    <StudentShell>
      <div className="ef-topbar">
        <div>
          <h1 className="ef-section-title">Videos</h1>
          <p className="ef-section-text">Short lessons organized by level, topic and skill.</p>
        </div>
      </div>
      <div className="ef-card">The secure video player will be added here.</div>
    </StudentShell>
  );
}
