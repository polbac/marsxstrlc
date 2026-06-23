import fs from "fs";
import path from "path";

const HEADER_PATH = path.join(process.cwd(), "public/header.png");

export function getHeaderImageSrc() {
  let version = "1";

  try {
    version = String(fs.statSync(HEADER_PATH).mtimeMs);
  } catch {
    // fallback if file is missing at build/runtime
  }

  return `/header.png?v=${version}`;
}
