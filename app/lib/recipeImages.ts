import path from "node:path";

export const MAX_RECIPE_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const RECIPE_IMAGE_DIR =
  process.env.RECIPE_UPLOAD_DIR ??
  path.resolve(process.cwd(), "../recipe-uploads");

const imageExtensions = ["jpg", "png", "webp"] as const;

export type RecipeImageExtension = (typeof imageExtensions)[number];

export function isRecipeImageFilename(filename: string): boolean {
  const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

  return new RegExp(`^${uuid}\\.(?:${imageExtensions.join("|")})$`, "i").test(
    filename,
  );
}

export function getRecipeImagePath(filename: string): string {
  return path.join(RECIPE_IMAGE_DIR, filename);
}

export function detectRecipeImageType(
  buffer: Buffer,
): { mimeType: string; extension: RecipeImageExtension } | null {
  // JPEG
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }

  // PNG
  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mimeType: "image/png", extension: "png" };
  }

  // WebP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }

  return null;
}
