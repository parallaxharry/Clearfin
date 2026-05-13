import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const BUCKET = "statement_uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["pdf", "csv", "xlsx"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function normalizeEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return email;
}

function getExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext && ALLOWED_EXTENSIONS.has(ext) ? ext : null;
}

function safeFileName(fileName: string) {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Statement storage is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const email = normalizeEmail(formData.get("email"));
    const fileValue = formData.get("file");

    if (!email) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "Statement file required." }, { status: 400 });
    }

    const extension = getExtension(fileValue.name);
    const fileType = fileValue.type || "application/octet-stream";

    if (!extension || !ALLOWED_MIME_TYPES.has(fileType)) {
      return NextResponse.json(
        { error: "Upload a PDF, CSV, or XLSX statement." },
        { status: 400 }
      );
    }

    if (fileValue.size <= 0 || fileValue.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Statement must be 10MB or smaller." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    await supabase
      .from("waitlist_users")
      .upsert(
        { email, source: "statement_upload" },
        { onConflict: "email", ignoreDuplicates: true }
      );

    const uploadId = randomUUID();
    const datePrefix = new Date().toISOString().slice(0, 10);
    const originalName = safeFileName(fileValue.name);
    const filePath = `${datePrefix}/${uploadId}-${originalName}`;
    const fileBuffer = Buffer.from(await fileValue.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: fileType,
        upsert: false,
        cacheControl: "0",
      });

    if (uploadError) {
      console.error("Statement storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to store statement." },
        { status: 500 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("statement_uploads")
      .insert({
        email,
        file_path: filePath,
        file_name: originalName,
        file_type: fileType,
        file_size: fileValue.size,
        status: "received",
      })
      .select("id, file_name, status, created_at")
      .single();

    if (insertError) {
      console.error("Statement metadata insert error:", insertError);
      await supabase.storage.from(BUCKET).remove([filePath]);
      return NextResponse.json(
        { error: "Failed to record statement upload." },
        { status: 500 }
      );
    }

    return NextResponse.json({ upload: data }, { status: 200 });
  } catch (err) {
    console.error("Statement upload API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
