/** Upload images from the Lexical editor via VGS /api/upload (Cloudinary or local). */
export async function uploadLexicalImage(
  folder: string,
  _fileType: string,
  formData: FormData,
) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No image file selected.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder === "research-file" ? "blog" : folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body,
  });

  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "Image upload failed.");
  }

  return { data: { url: result.url } };
}
