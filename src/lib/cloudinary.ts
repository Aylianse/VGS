import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string,
) {
  const cloudinaryClient = getCloudinary();

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(
      {
        folder: `vitaglow/${folder}`,
        public_id: filename.replace(/\.[^.]+$/, ""),
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}
