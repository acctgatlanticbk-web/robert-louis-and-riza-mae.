import fs from "fs"
import path from "path"

const GALLERY_FOLDERS = ["desktop-background", "mobile-background"] as const
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])

/** Encode each path segment so spaces/parentheses work in production URLs. */
export function encodePublicImagePath(src: string): string {
  return (
    "/" +
    src
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/")
  )
}

function listImagesInFolder(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/${folder}/${file}`)
}

/** Gallery images from public/desktop-background and public/mobile-background only. */
export async function fetchGalleryImages(): Promise<string[]> {
  const images = GALLERY_FOLDERS.flatMap(listImagesInFolder)
  return images.map(encodePublicImagePath)
}
