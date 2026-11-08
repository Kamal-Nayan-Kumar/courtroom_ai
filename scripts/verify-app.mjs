#!/usr/bin/env node
/*
 * Verify Courtroom AI without paid services.
 * 1) Build check (npm run build). Skip with --skip-build.
 * 2) Type check (npx tsc --noEmit). Skip with --skip-build too.
 * 3) API smoke against a local dev server (BASE_URL, default http://localhost:3000).
 *    LLM-backed endpoints are only probed for auth/validation shape when keys are empty.
 *
 * Prints a checklist with PASS / FAIL / SKIP and exits non-zero on build failure.
 */
import { execSync } from "node:child_process";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const skipBuild = process.argv.includes("--skip-build");
const results = [];

function record(status, name, detail = "") {
  results.push({ status, name, detail });
  const tag = status === "PASS" ? "PASS" : status === "FAIL" ? "FAIL" : "SKIP";
  console.log(`${tag}  ${name}${detail ? ` - ${detail}` : ""}`);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { res, json };
}

if (!skipBuild) {
  try {
    console.log("Running npm run build...");
    execSync("npm run build", { stdio: "inherit" });
    record("PASS", "npm run build");
  } catch (e) {
    record("FAIL", "npm run build", e?.message ?? "build failed");
  }
  try {
    console.log("Running npx tsc --noEmit...");
    execSync("npx tsc --noEmit", { stdio: "inherit" });
    record("PASS", "npx tsc --noEmit");
  } catch (e) {
    record("FAIL", "npx tsc --noEmit", e?.message ?? "tsc failed");
  }
} else {
  record("SKIP", "npm run build", "--skip-build");
  record("SKIP", "npx tsc --noEmit", "--skip-build");
}

let devUp = false;
try {
  const probe = await fetch(`${BASE_URL}/api/cases`, { method: "GET" });
  // A Next 404 HTML page means a different app is on this port (no API routes).
  const ctype = probe.headers.get("content-type") ?? "";
  const isApi404Page = probe.status === 404 && ctype.includes("text/html");
  if (isApi404Page) {
    record("SKIP", "dev server reachable", `${BASE_URL} serves a non-API app (HTML 404). Start this worktree: npm run dev -- -p 3001 with BASE_URL=http://localhost:3001`);
  } else {
    devUp = true;
    record("PASS", "dev server reachable", `${BASE_URL}/api/cases -> ${probe.status}`);
  }
} catch {
  record("SKIP", "dev server reachable", `start dev server: npm run dev (BASE_URL=${BASE_URL})`);
}

if (devUp) {
  try {
    const { res, json } = await fetchJson(`${BASE_URL}/api/cases`);
    const ok = res.ok && Array.isArray(json);
    record(ok ? "PASS" : "FAIL", "GET /api/cases returns array", ok ? `${json.length} cases` : `status ${res.status}`);
  } catch (e) {
    record("FAIL", "GET /api/cases", e.message);
  }

  try {
    const { res } = await fetchJson(`${BASE_URL}/api/dashboard`);
    // 401 when unauthenticated is expected shape; 200 means signed-in session exists.
    record(res.ok || res.status === 401 ? "PASS" : "FAIL", "GET /api/dashboard shape", `status ${res.status} (401 when signed out is expected)`);
  } catch (e) {
    record("FAIL", "GET /api/dashboard", e.message);
  }

  try {
    const { res, json } = await fetchJson(`${BASE_URL}/api/witness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    // Empty body must hit auth (401) or validation (400) before any LLM call.
    record([400, 401].includes(res.status) ? "PASS" : "FAIL", "POST /api/witness validation", `status ${res.status} ${json?.error ?? ""}`);
  } catch (e) {
    record("FAIL", "POST /api/witness validation", e.message);
  }

  // New Phase 2/3 routes: existence probes only (curl-style HTTP checks).
  // Signed-out requests must get 401/400, never 404.
  try {
    const { res } = await fetchJson(`${BASE_URL}/api/documents`);
    record([400, 401].includes(res.status) ? "PASS" : "FAIL", "GET /api/documents exists", `status ${res.status} (401 when signed out is expected)`);
  } catch (e) {
    record("FAIL", "GET /api/documents exists", e.message);
  }

  try {
    const { res, json } = await fetchJson(`${BASE_URL}/api/embeddings/backfill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    record([400, 401].includes(res.status) ? "PASS" : "FAIL", "POST /api/embeddings/backfill exists", `status ${res.status} ${json?.error ?? ""} (401 when signed out is expected)`);
  } catch (e) {
    record("FAIL", "POST /api/embeddings/backfill exists", e.message);
  }

  try {
    const { res, json } = await fetchJson(`${BASE_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    record([400, 401].includes(res.status) ? "PASS" : "FAIL", "POST /api/search exists", `status ${res.status} ${json?.error ?? ""} (401 when signed out is expected)`);
  } catch (e) {
    record("FAIL", "POST /api/search exists", e.message);
  }

  try {
    const { res } = await fetchJson(`${BASE_URL}/api/cases/nonexistent-case-id`);
    record(res.status === 404 ? "PASS" : "FAIL", "GET /api/cases/[id] unknown slug 404", `status ${res.status}`);
  } catch (e) {
    record("FAIL", "GET /api/cases/[id] 404", e.message);
  }
} else {
  record("SKIP", "GET /api/cases returns array");
  record("SKIP", "GET /api/dashboard shape");
  record("SKIP", "POST /api/witness validation");
  record("SKIP", "GET /api/documents exists");
  record("SKIP", "POST /api/embeddings/backfill exists");
  record("SKIP", "POST /api/search exists");
  record("SKIP", "GET /api/cases/[id] unknown slug 404");
}

console.log("\nChecklist summary:");
for (const r of results) console.log(`  [${r.status}] ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
const failed = results.filter((r) => r.status === "FAIL").length;
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed or skipped (dev server not running is a skip, not a failure).");
process.exit(failed ? 1 : 0);
