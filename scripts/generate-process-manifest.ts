/**
 * Generate process model manifest for the BpmnViewer dashboard.
 *
 * Walks architecture/processes/, imports every .bpmn.ts and .dmn.ts file,
 * extracts XML metadata, and writes a JSON manifest + individual XML files
 * to tools/bpmn-viewer/public/.
 */

import fs from "fs";
import path from "path";

const PROCESSES_DIR = "architecture/processes";
const OUT_DIR = "tools/bpmn-viewer/public";

interface ModelEntry {
  id: string;
  name: string;
  path: string;
  category: string;
  subdomain: string | null;
  filename: string;
}

/** Walk a directory recursively and return .bpmn.ts / .dmn.ts files */
function walk(dir: string, results: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (
      entry.name.endsWith(".bpmn.ts") ||
      entry.name.endsWith(".dmn.ts")
    ) {
      results.push(full);
    }
  }
  return results;
}

/** Extract the relative category and subdomain from a file path */
function categorize(relativePath: string): {
  category: string;
  subdomain: string | null;
} {
  const parts = relativePath.replaceAll("\\", "/").split("/");
  // e.g. ["system", "ingestion", "feed-ingestion.bpmn.ts"]
  const category = parts[0];
  const subdomain = parts.length >= 3 ? parts[1] : null;
  return { category, subdomain };
}

/** Derive a human-readable name from the filename */
function deriveName(filename: string): string {
  // "feed-ingestion.bpmn.ts" -> "Feed Ingestion"
  const base = filename.replace(/\.(bpmn|dmn)\.ts$/, "");
  return base
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function main() {
  const files = walk(PROCESSES_DIR);
  const models: ModelEntry[] = [];

  // Ensure output directories exist
  fs.mkdirSync(path.join(OUT_DIR, "models"), { recursive: true });

  for (const file of files) {
    const relative = path.relative(PROCESSES_DIR, file);
    const { category, subdomain } = categorize(relative);
    const filename = path.basename(file);
    const name = deriveName(filename);
    const id = filename.replace(/\.(bpmn|dmn)\.ts$/, "");

    try {
      const mod = await import("file://" + path.resolve(file));
      if (typeof mod.xml !== "string" || mod.xml.length < 50) {
        console.warn(`⚠  ${relative} — invalid or empty xml, skipping`);
        continue;
      }

      models.push({ id, name, path: relative, category, subdomain, filename });

      // Write individual XML file
      const xmlPath = path.join(OUT_DIR, "models", `${id}.xml`);
      fs.writeFileSync(xmlPath, mod.xml, "utf-8");

      console.log(`✓  ${relative}`);
    } catch (e: any) {
      console.warn(`✗  ${relative} — ${e.message}`);
    }
  }

  // Write manifest
  const manifest = { models };
  const manifestPath = path.join(OUT_DIR, "models.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`\nDone. ${models.length} models written to ${OUT_DIR}`);
}

main().catch(console.error);
