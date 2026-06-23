import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import { validateUpload } from "@/lib/blob/upload";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN no configurado" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const validation = validateUpload(file);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const pathname = `uploads/${validation.kind}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({
    url: blob.url,
    kind: validation.kind,
  });
}
