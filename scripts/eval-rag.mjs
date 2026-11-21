/**
 * Thin wrapper for backward-compatible CLI.
 * Delegates to the unified harness that measures src/lib/retrieval.ts.
 *
 * Usage:
 *   node scripts/eval-rag.mjs
 *   node scripts/eval-rag.mjs --check
 *   node scripts/eval-rag.mjs --check --baseline PATH
 *   node scripts/eval-rag.mjs --check --from data/eval-results.json
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./eval-retrieval.mts", import.meta.url));
const args = process.argv.slice(2);

try {
  execFileSync(process.execPath, ["--experimental-strip-types", script, ...args], {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  if (err && typeof err === "object" && "status" in err && typeof err.status === "number") {
    process.exit(err.status);
  }
  throw err;
}
