import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanFileName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = String(formData.get("type") || "");
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
    }

    if (type !== "video" && type !== "pdf") {
      return NextResponse.json({ ok: false, error: "Invalid upload type." }, { status: 400 });
    }

    const folder = type === "pdf" ? "pdfs" : "videos";
    const safeName = `${Date.now()}-${cleanFileName(file.name)}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    const uploadPath = path.join(uploadDir, safeName);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(uploadPath, Buffer.from(bytes));

    return NextResponse.json({
      ok: true,
      path: `/uploads/${folder}/${safeName}`,
      originalName: file.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
