import { AdminShell } from "@/components/layout/AdminShell";
import { adminRows } from "@/data/english";

export default function AdminPage() {
  return (
    <AdminShell>
      <div className="ef-topbar">
        <div>
          <div className="ef-kicker">
            <span className="ef-kicker-dot" />
            Back office
          </div>
          <h1 className="ef-section-title">English Focus administration</h1>
          <p className="ef-section-text">Manage levels, content, videos, PDFs, quizzes, plans and students.</p>
        </div>
        <button className="ef-btn ef-btn-primary">Add new content</button>
      </div>

      <div className="ef-stat-grid">
        <div className="ef-stat-card">
          <span>Total lessons</span>
          <strong>86</strong>
        </div>
        <div className="ef-stat-card">
          <span>Videos</span>
          <strong>51</strong>
        </div>
        <div className="ef-stat-card">
          <span>PDF notes</span>
          <strong>64</strong>
        </div>
        <div className="ef-stat-card">
          <span>Quizzes</span>
          <strong>46</strong>
        </div>
      </div>

      <div className="ef-grid">
        <article className="ef-card ef-card-feature">
          <div>
            <div className="ef-card-icon">01</div>
            <h3>Levels</h3>
            <p>Create and edit A1, A2, B1, B2, C1 and Business English.</p>
          </div>
          <span className="ef-badge ef-badge-red">Structure</span>
        </article>

        <article className="ef-card ef-card-feature">
          <div>
            <div className="ef-card-icon">02</div>
            <h3>Content</h3>
            <p>Add chapters, lessons, notes, exercises and key takeaways.</p>
          </div>
          <span className="ef-badge ef-badge-red">Lessons</span>
        </article>

        <article className="ef-card ef-card-feature">
          <div>
            <div className="ef-card-icon">03</div>
            <h3>Quizzes</h3>
            <p>Create questions, choices, correct answers and explanations.</p>
          </div>
          <span className="ef-badge ef-badge-red">Assessment</span>
        </article>
      </div>

      <br />

      <section className="ef-card">
        <h3>Content overview</h3>
        <br />
        <table className="ef-admin-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Lessons</th>
              <th>Videos</th>
              <th>Quizzes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adminRows.map((row) => (
              <tr key={row.section}>
                <td><strong>{row.section}</strong></td>
                <td>{row.lessons}</td>
                <td>{row.videos}</td>
                <td>{row.quizzes}</td>
                <td>
                  <span className={row.status === "Published" ? "ef-badge ef-badge-red" : "ef-badge"}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
