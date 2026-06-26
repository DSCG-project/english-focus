"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";

const BACKUP_KEYS = [
  "english-focus-levels",
  "english-focus-courses",
  "english-focus-lessons",
  "english-focus-test-results",
  "english-focus-students",
];

type BackupPayload = {
  app: "English Focus";
  version: string;
  exportedAt: string;
  data: Record<string, unknown>;
};

function readKey(key: string) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AdminBackupPage() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<BackupPayload | null>(null);

  const counts = useMemo(() => {
    const levels = readKey("english-focus-levels") as unknown[] | null;
    const courses = readKey("english-focus-courses") as unknown[] | null;
    const lessons = readKey("english-focus-lessons") as unknown[] | null;
    const students = readKey("english-focus-students") as unknown[] | null;
    const results = readKey("english-focus-test-results") as Record<string, unknown> | null;

    return {
      levels: levels?.length || 0,
      courses: courses?.length || 0,
      lessons: lessons?.length || 0,
      students: students?.length || 0,
      results: results ? Object.keys(results).length : 0,
    };
  }, [message]);

  function exportBackup() {
    const data: Record<string, unknown> = {};

    BACKUP_KEYS.forEach((key) => {
      data[key] = readKey(key);
    });

    const payload: BackupPayload = {
      app: "English Focus",
      version: "local-mvp",
      exportedAt: new Date().toISOString(),
      data,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `english-focus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Backup exported successfully.");
  }

  async function loadBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupPayload;

      if (payload.app !== "English Focus" || !payload.data) {
        throw new Error("Invalid backup file.");
      }

      setPreview(payload);
      setMessage("Backup loaded. You can restore it now.");
    } catch (error) {
      setPreview(null);
      setMessage(error instanceof Error ? error.message : "Import failed.");
    }

    event.target.value = "";
  }

  function restoreBackup() {
    if (!preview) {
      setMessage("Choose a backup file first.");
      return;
    }

    BACKUP_KEYS.forEach((key) => {
      const value = preview.data[key];

      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    });

    setMessage("Backup restored. Reload the platform to apply changes.");
  }

  function resetDemo() {
    BACKUP_KEYS.forEach((key) => window.localStorage.removeItem(key));
    setMessage("Demo reset completed. Reload the platform to restore default content.");
  }

  return (
    <AdminShell>
      <section className="ef-admin-clean-hero">
        <div>
          <span>Local MVP safety</span>
          <h1>Backup</h1>
          <p>Export, restore or reset local data before moving to database and secure storage.</p>
        </div>

        <Link href="/admin" className="ef-admin-clean-preview">
          Admin dashboard
        </Link>
      </section>

      <div className="ef-admin-clean-kpis">
        <div><span>Levels</span><strong>{counts.levels}</strong></div>
        <div><span>Courses</span><strong>{counts.courses}</strong></div>
        <div><span>Lessons</span><strong>{counts.lessons}</strong></div>
        <div><span>Students</span><strong>{counts.students}</strong></div>
        <div><span>Results</span><strong>{counts.results}</strong></div>
      </div>

      <section className="ef-admin-backup-grid">
        <article className="ef-admin-clean-card">
          <h2>Export</h2>
          <p>Download all local levels, courses, lessons, tests, results and students as JSON.</p>
          <button className="ef-admin-action-main" onClick={exportBackup}>
            Export JSON
          </button>
        </article>

        <article className="ef-admin-clean-card">
          <h2>Import</h2>
          <p>Choose a previous English Focus JSON backup and restore it locally.</p>

          <label className="ef-admin-upload-main">
            Choose backup
            <input type="file" accept="application/json" onChange={loadBackup} />
          </label>

          <button className="ef-admin-action-soft" onClick={restoreBackup}>
            Restore backup
          </button>
        </article>

        <article className="ef-admin-clean-card danger">
          <h2>Reset</h2>
          <p>Clear all local demo data and reload default catalogue content.</p>
          <button className="ef-admin-action-danger" onClick={resetDemo}>
            Reset demo
          </button>
        </article>
      </section>

      {preview && (
        <section className="ef-admin-backup-preview">
          <div>
            <span>Backup version</span>
            <strong>{preview.version}</strong>
          </div>
          <div>
            <span>Exported at</span>
            <strong>{new Date(preview.exportedAt).toLocaleString()}</strong>
          </div>
        </section>
      )}

      {message && <div className="ef-students-notice">{message}</div>}
    </AdminShell>
  );
}
