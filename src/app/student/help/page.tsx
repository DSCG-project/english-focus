import { StudentShell } from "@/components/layout/StudentShell";

export default function HelpPage() {
  return (
    <StudentShell>
      <section className="ef-courses-page-head">
        <div>
          <span className="ef-course-eyebrow">Support</span>
          <h1>Help</h1>
          <p>Find help for lessons, PDFs, tests and account access.</p>
        </div>
      </section>

      <section className="ef-dashboard-panel-final">
        <div className="ef-help-grid-final">
          <article>
            <h3>Lessons</h3>
            <p>Open a course, choose a lesson and start the video.</p>
          </article>
          <article>
            <h3>PDF documents</h3>
            <p>Use the eye icon to open the internal PDF viewer or the download icon to save the file.</p>
          </article>
          <article>
            <h3>Tests</h3>
            <p>Answers are submitted at the end. Score and corrections appear only after completion.</p>
          </article>
        </div>
      </section>
    </StudentShell>
  );
}
