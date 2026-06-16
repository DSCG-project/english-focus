import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function LoginPage() {
  return (
    <div className="ef-public">
      <PublicHeader />

      <main className="ef-public-hero">
        <section>
          <h1 className="ef-public-title">
            Sign in to your <span>learning dashboard.</span>
          </h1>
          <p className="ef-public-text">
            Access courses, lessons, assessments, events and progress tracking.
          </p>
        </section>

        <section className="ef-public-preview">
          <div style={{ display: "grid", gap: 14 }}>
            <input style={{ height: 48, border: "1px solid #e5e7eb", padding: "0 14px" }} placeholder="Email" />
            <input style={{ height: 48, border: "1px solid #e5e7eb", padding: "0 14px" }} placeholder="Password" type="password" />
            <Link href="/student" className="ef-public-btn primary">Student Login</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
