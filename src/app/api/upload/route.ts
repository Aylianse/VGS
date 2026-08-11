import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getAdminSession } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  getUploadDir,
  getUploadPublicUrl,
  resolveUploadFolder,
} from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const folder = resolveUploadFolder(String(formData.get("folder") || ""));
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (isCloudinaryConfigured()) {
      const url = await uploadImageToCloudinary(bytes, folder, filename);
      return NextResponse.json({ url, provider: "cloudinary" });
    }

    const uploadDir = getUploadDir(folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({
      url: getUploadPublicUrl(folder, filename),
      provider: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
