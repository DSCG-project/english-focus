import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function cleanFileName(name: string) {
  const extension = path.extname(name).toLowerCase();
  const base = path
    .basename(name, extension)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${Date.now()}-${base || "file"}${extension}`;
}

function isValidUpload(type: string, file: File) {
  const mime = file.type || "";
  const name = file.name.toLowerCase();

  if (type === "video") {
    return mime.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(name);
  }

  if (type === "pdf") {
    return mime === "application/pdf" || name.endsWith(".pdf");
  }

  return false;
}

async function uploadLocal(type: "video" | "pdf", file: File, fileName: string) {
  const folder = type === "video" ? "videos" : "pdfs";
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return {
    storage: "local",
    path: `/uploads/${folder}/${fileName}`,
    bucket: "",
    key: fileName,
  };
}

async function uploadSupabase(type: "video" | "pdf", file: File, fileName: string) {
  const client = getSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const bucket = type === "video" ? "english-focus-videos" : "english-focus-pdfs";
  const key = `${type}s/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await client.storage.from(bucket).upload(key, buffer, {
    contentType: file.type || (type === "video" ? "video/mp4" : "application/pdf"),
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(key);

  return {
    storage: "supabase",
    path: data.publicUrl,
    bucket,
    key,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const rawType = String(formData.get("type") || "");
    const file = formData.get("file");

    if (rawType !== "video" && rawType !== "pdf") {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid upload type.",
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "No file received.",
        },
        { status: 400 }
      );
    }

    if (!isValidUpload(rawType, file)) {
      return NextResponse.json(
        {
          ok: false,
          error: rawType === "video" ? "Please upload a valid video file." : "Please upload a valid PDF file.",
        },
        { status: 400 }
      );
    }

    const fileName = cleanFileName(file.name);

    try {
      const supabaseResult = await uploadSupabase(rawType, file, fileName);

      if (supabaseResult) {
        return NextResponse.json({
          ok: true,
          ...supabaseResult,
        });
      }
    } catch (error) {
      console.error("Supabase upload failed, using local fallback:", error);
    }

    const localResult = await uploadLocal(rawType, file, fileName);

    return NextResponse.json({
      ok: true,
      ...localResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 }
    );
  }
}
