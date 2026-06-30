"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function StudentLoginPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function getNextPath() {
    if (typeof window === "undefined") return "/student";
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (next && next.startsWith("/student") && next !== "/student/login") {
      return next;
    }

    return "/student";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Access denied.");
      }

      window.location.href = getNextPath();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Access denied.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ef-student-login-page">
      <section className="ef-student-login-card">
        <Link href="/" className="ef-login-logo">
          <strong>English</strong> Focus<span>.</span>
        </Link>

        <div className="ef-login-head">
          <p>Student Access</p>
          <h1>Continue your learning path</h1>
          <span>Enter your student access code to open the learning workspace.</span>
        </div>

        <form onSubmit={submit} className="ef-login-form">
          <label htmlFor="student-access-code">Access code</label>
          <input
            id="student-access-code"
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Student access code"
            autoComplete="one-time-code"
            required
          />

          {status && <div className="ef-login-error">{status}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Open Student Area"}
          </button>
        </form>

        <Link href="/" className="ef-login-back">
          Back to website
        </Link>
      </section>
    </main>
  );
}
