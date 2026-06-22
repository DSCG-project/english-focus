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

function BackupIcon({ type }: { type: "download" | "upload" | "reset" | "open" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "upload") {
    return (
      <svg {...common}>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M20 16v4H4v-4" />
      </svg>
    );
  }

  if (type === "reset") {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v6h6" />
      </svg>
    );
  }

  if (type === "open") {
    return (
      <svg {...common}>
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function AdminBackupPage() {
  const [message, setMessage] = useState("");
  const [importPreview, setImportPreview] = useState<BackupPayload | null>(null);

  const counts = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        levels: 0,
        courses: 0,
        lessons: 0,
        students: 0,
        results: 0,
      };
    }

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

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupPayload;

      if (payload.app !== "English Focus" || !payload.data) {
        throw new Error("Invalid English Focus backup file.");
      }

      setImportPreview(payload);
      setMessage("Backup file loaded. Click Restore backup to apply it.");
    } catch (error) {
      setImportPreview(null);
      setMessage(error instanceof Error ? error.message : "Import failed.");
    }

    event.target.value = "";
  }

  function restoreBackup() {
    if (!importPreview) {
      setMessage("Choose a backup file first.");
      return;
    }

    BACKUP_KEYS.forEach((key) => {
      const value = importPreview.data[key];

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
      <section className="ef-admin-hero">
        <div>
          <h1>Backup & reset</h1>
          <p>Export, restore or reset local MVP content before moving to database and secure storage.</p>
        </div>

        <div className="ef-admin-hero-actions">
          <Link href="/admin/content" className="ef-admin-white-btn">
            Content studio
          </Link>
        </div>
      </section>

      <div className="ef-admin-stats">
        <div className="ef-admin-stat">
          <span>Levels</span>
          <strong>{counts.levels}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Courses</span>
          <strong>{counts.courses}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Lessons</span>
          <strong>{counts.lessons}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Students</span>
          <strong>{counts.students}</strong>
        </div>
        <div className="ef-admin-stat">
          <span>Results</span>
          <strong>{counts.results}</strong>
        </div>
      </div>

      <section className="ef-backup-grid">
        <article className="ef-backup-card">
          <span className="ef-backup-icon">
            <BackupIcon type="download" />
          </span>
          <h2>Export backup</h2>
          <p>Download levels, courses, lessons, PDFs, tests, students and local scores as one JSON file.</p>

          <button className="ef-backup-primary" onClick={exportBackup}>
            <BackupIcon type="download" />
            Export JSON
          </button>
        </article>

        <article className="ef-backup-card">
          <span className="ef-backup-icon">
            <BackupIcon type="upload" />
          </span>
          <h2>Import backup</h2>
          <p>Choose a previous JSON backup and restore the platform content.</p>

          <label className="ef-backup-upload">
            <BackupIcon type="upload" />
            Choose backup
            <input type="file" accept="application/json" onChange={handleImport} />
          </label>

          <button className="ef-backup-secondary" onClick={restoreBackup}>
            Restore backup
          </button>
        </article>

        <article className="ef-backup-card danger">
          <span className="ef-backup-icon">
            <BackupIcon type="reset" />
          </span>
          <h2>Reset demo</h2>
          <p>Clear local data and restart from the default demo content.</p>

          <button className="ef-backup-danger" onClick={resetDemo}>
            <BackupIcon type="reset" />
            Reset demo
          </button>
        </article>
      </section>

      {importPreview && (
        <section className="ef-backup-preview">
          <div>
            <span>Backup loaded</span>
            <strong>{importPreview.version}</strong>
          </div>
          <div>
            <span>Exported at</span>
            <strong>{new Date(importPreview.exportedAt).toLocaleString()}</strong>
          </div>
        </section>
      )}

      {message && <div className="ef-students-notice">{message}</div>}
    </AdminShell>
  );
}
