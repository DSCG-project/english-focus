"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";

type HealthResponse = {
  ok: boolean;
  mode: string;
  message: string;
  env: Record<string, boolean>;
};

type CountsResponse = {
  ok: boolean;
  message: string;
  counts: Record<string, number>;
};

type SeedResponse = {
  ok: boolean;
  message: string;
  counts?: Record<string, number>;
};

type ContentResponse = {
  ok: boolean;
  source: string;
  message: string;
  counts?: {
    levels: number;
    courses: number;
    lessons: number;
    questions: number;
  };
};

type StorageResponse = {
  ok: boolean;
  mode: string;
  message: string;
  buckets: Record<string, boolean>;
};

export default function AdminDatabasePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [counts, setCounts] = useState<CountsResponse | null>(null);
  const [seedResult, setSeedResult] = useState<SeedResponse | null>(null);
  const [contentSource, setContentSource] = useState<ContentResponse | null>(null);
  const [storage, setStorage] = useState<StorageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function checkHealth() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/database/health", {
        cache: "no-store",
      });

      const data = await response.json();
      setHealth(data);
    } catch {
      setHealth({
        ok: false,
        mode: "localStorage",
        message: "Unable to check database status.",
        env: {},
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadCounts() {
    try {
      const response = await fetch("/api/admin/database/counts", {
        cache: "no-store",
      });

      const data = await response.json();
      setCounts(data);
    } catch {
      setCounts({
        ok: false,
        message: "Unable to load database counts.",
        counts: {},
      });
    }
  }

  async function loadContentSource() {
    try {
      const response = await fetch("/api/content", {
        cache: "no-store",
      });

      const data = await response.json();
      setContentSource(data);
    } catch {
      setContentSource({
        ok: false,
        source: "unknown",
        message: "Unable to load content source.",
      });
    }
  }

  async function loadStorageStatus() {
    try {
      const response = await fetch("/api/admin/storage/health", {
        cache: "no-store",
      });

      const data = await response.json();
      setStorage(data);
    } catch {
      setStorage({
        ok: false,
        mode: "unknown",
        message: "Unable to load storage status.",
        buckets: {},
      });
    }
  }

  async function seedDatabase() {
    if (!confirm("Seed Supabase with the default English Focus catalogue?")) return;

    setSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch("/api/admin/database/seed", {
        method: "POST",
      });

      const data = await response.json();
      setSeedResult(data);

      await refreshAll();
    } catch {
      setSeedResult({
        ok: false,
        message: "Seed request failed.",
      });
    } finally {
      setSeeding(false);
    }
  }

  async function refreshAll() {
    await checkHealth();
    await loadCounts();
    await loadContentSource();
    await loadStorageStatus();
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const mode = loading ? "Checking..." : health?.mode || "localStorage";
  const isSupabaseReady = Boolean(health?.ok && health.mode === "supabase");

  return (
    <AdminShell>
      <section className="ef-admin-clean-hero">
        <div>
          <span>Database preparation</span>
          <h1>Database</h1>
          <p>Connect Supabase, seed the catalogue and verify database tables.</p>
        </div>

        <Link href="/admin/backup" className="ef-admin-clean-preview">
          Backup first
        </Link>
      </section>

      <div className="ef-db-status-card">
        <div>
          <span>Current mode</span>
          <strong>{mode}</strong>
          <p>{health?.message || "Checking database status..."}</p>
        </div>

        <div className="ef-db-status-actions">
          <button onClick={refreshAll} className="ef-admin-action-soft">
            Refresh status
          </button>

          <button
            onClick={seedDatabase}
            className="ef-admin-action-main"
            disabled={!isSupabaseReady || seeding}
          >
            {seeding ? "Seeding..." : "Seed database"}
          </button>
        </div>
      </div>

      <div className="ef-admin-clean-kpis">
        <div>
          <span>Levels</span>
          <strong>{counts?.counts?.english_levels || 0}</strong>
        </div>
        <div>
          <span>Courses</span>
          <strong>{counts?.counts?.english_courses || 0}</strong>
        </div>
        <div>
          <span>Lessons</span>
          <strong>{counts?.counts?.english_lessons || 0}</strong>
        </div>
        <div>
          <span>Questions</span>
          <strong>{counts?.counts?.english_quiz_questions || 0}</strong>
        </div>
        <div>
          <span>Students</span>
          <strong>{counts?.counts?.english_students || 0}</strong>
        </div>
        <div>
          <span>Results</span>
          <strong>{counts?.counts?.english_test_results || 0}</strong>
        </div>
      </div>

      {storage && (
        <section className={storage.ok ? "ef-db-message ok" : "ef-db-message"}>
          <strong>Storage: {storage.mode}</strong>
          <p>{storage.message}</p>

          <div>
            {Object.entries(storage.buckets || {}).map(([key, value]) => (
              <span key={key}>{key}: {value ? "ready" : "missing"}</span>
            ))}
          </div>
        </section>
      )}

      {contentSource && (
        <section className={contentSource.source === "supabase" ? "ef-db-message ok" : "ef-db-message"}>
          <strong>Content source: {contentSource.source}</strong>
          <p>{contentSource.message}</p>

          {contentSource.counts && (
            <div>
              <span>levels: {contentSource.counts.levels}</span>
              <span>courses: {contentSource.counts.courses}</span>
              <span>lessons: {contentSource.counts.lessons}</span>
              <span>questions: {contentSource.counts.questions}</span>
            </div>
          )}
        </section>
      )}

      {seedResult && (
        <section className={seedResult.ok ? "ef-db-message ok" : "ef-db-message"}>
          <strong>{seedResult.ok ? "Success" : "Error"}</strong>
          <p>{seedResult.message}</p>

          {seedResult.counts && (
            <div>
              {Object.entries(seedResult.counts).map(([key, value]) => (
                <span key={key}>
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="ef-db-grid">
        <article className="ef-admin-clean-card">
          <h2>1. SQL schema</h2>
          <p>Run this file in Supabase SQL Editor before seeding:</p>
          <code>supabase/english-focus-schema.sql</code>
        </article>

        <article className="ef-admin-clean-card">
          <h2>2. Storage buckets</h2>
          <p>Create these buckets in Supabase Storage:</p>
          <code>english-focus-videos</code>
          <code>english-focus-pdfs</code>
        </article>

        <article className="ef-admin-clean-card">
          <h2>3. Environment keys</h2>
          <p>Add your Supabase URL, publishable/anon key and secret/service key in `.env.local`.</p>
        </article>

        <article className="ef-admin-clean-card">
          <h2>4. Seed catalogue</h2>
          <p>Use the Seed database button after health status becomes Supabase connected.</p>
        </article>
      </section>

      <section className="ef-db-env-panel">
        <h2>Environment status</h2>

        {[
          "NEXT_PUBLIC_SUPABASE_URL",
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
          "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          "SUPABASE_SECRET_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
        ].map((key) => (
          <div key={key}>
            <span>{key}</span>
            <strong className={health?.env?.[key] ? "ok" : ""}>
              {health?.env?.[key] ? "Configured" : "Missing"}
            </strong>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
