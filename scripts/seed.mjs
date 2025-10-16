#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(
  fileURLToPath(new URL("..", import.meta.url))
);
const OUTPUT_FILE = path.join(PROJECT_ROOT, "mocks", "db.json");

import { users, programs, applications } from "../shared/fixtures.js";

const payload = {
  users,
  programs,
  applications,
};

async function main() {
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.info(
    `Seeded dataset written to ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("Failed to seed dataset:", error);
  process.exit(1);
});
