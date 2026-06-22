"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEYS = [
  "english-focus-levels",
  "english-focus-courses",
  "english-focus-lessons",
  "english-focus-test-results",
  "english-focus-students",
];

export default function ResetDemoPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    KEYS.forEach((key) => window.localStorage.removeItem(key));
    setDone(true);
  }, []);

  return (
    <main className="ef-reset-page">
      <section className="ef-reset-card">
        <span>English Focus</span>
        <h1>{done ? "Demo reset completed" : "Resetting demo..."}</h1>
        <p>
          Local demo content has been cleared. Reload the platform to restore clean default content.
        </p>

        <div className="ef-reset-actions">
          <Link href="/student" className="ef-primary-action">
            Student dashboard
          </Link>

          <Link href="/admin/content" className="ef-secondary-action">
            Admin content
          </Link>
        </div>
      </section>
    </main>
  );
}
