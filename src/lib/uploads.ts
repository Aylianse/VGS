import path from "path";

const ALLOWED_FOLDERS = ["products", "blog", "general"] as const;

export type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

export function getUploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export function resolveUploadFolder(folder: string | null): UploadFolder {
  if (folder && ALLOWED_FOLDERS.includes(folder as UploadFolder)) {
    return folder as UploadFolder;
  }
  return "general";
}

export function getUploadDir(folder: UploadFolder) {
  return path.join(getUploadRoot(), folder);
}

export function getUploadPublicUrl(folder: UploadFolder, filename: string) {
  return `/uploads/${folder}/${filename}`;
}
