import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function ProgramPage() {
  return (
    <div className="ef-public">
      <PublicHeader />
      <main className="ef-public-hero">
        <section>
          <h1 className="ef-public-title">English program from <span>A1 to Business English.</span></h1>
          <p className="ef-public-text">Courses, lessons, assessments and practical learning paths.</p>
          <Link href="/student/login" className="ef-public-btn primary">View Courses</Link>
        </section>
      </main>
    </div>
  );
}
