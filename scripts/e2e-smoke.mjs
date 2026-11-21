#!/usr/bin/env node
/*
 * Repeatable browser smoke suite for case selection + RAG flows.
 * Usage: node scripts/e2e-smoke.mjs   (BASE_URL / CHROME_PATH are optional)
 */
import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SWITCHER = 'select[aria-label="Switch case"]';
const DEFAULT_TIMEOUT = 30_000;
const SESSION_TIMEOUT = 90_000;
const MIN_CASES = 13;

const results = [];
const log = (status, name, detail = "") => {
  results.push({ status, name, detail });
  console.log(detail ? `${status}  ${name} — ${detail}` : `${status}  ${name}`);
};
const short = (err) =>
  (err instanceof Error ? err.message : String(err)).replace(/\s+/g, " ").slice(0, 320);

async function runCheck(name, fn) {
  try {
    const result = await fn();
    if (result?.status === "SKIP") log("SKIP", name, result.detail ?? "");
    else log("PASS", name, result?.detail ?? "");
  } catch (err) {
    log("FAIL", name, short(err));
  }
}

// Wait until the case switcher is rendered, visible, enabled and fully populated.
async function waitForCaseOptions(page, { timeout = DEFAULT_TIMEOUT, inSession = false } = {}) {
  await page.waitForFunction(
    ({ selector, min, inSession }) => {
      const select = document.querySelector(selector);
      if (!select || select.disabled || select.options.length < min) return false;
      if (!select.getClientRects().length) return false;
      if (inSession) {
        // The pre-session screen also has a switcher; only accept the session view.
        const text = document.body.innerText || "";
        if (/Enter the courtroom|Starting session\.\.\./.test(text)) return false;
      }
      return true;
    },
    { selector: SWITCHER, min: MIN_CASES, inSession },
    { timeout }
  );
  return page.locator(SWITCHER).evaluate((select) => select.options.length);
}

async function expectVisibleH1(page, pattern) {
  await page.waitForFunction(
    ({ source }) => {
      const re = new RegExp(source, "i");
      return Array.from(document.querySelectorAll("h1")).some(
        (el) => re.test(el.textContent || "") && el.getClientRects().length > 0
      );
    },
    { source: pattern.source },
    { timeout: DEFAULT_TIMEOUT }
  );
  const headings = await page.locator("h1").allInnerTexts();
  assert(headings.some((text) => pattern.test(text)), `no visible h1 matching ${pattern}: ${JSON.stringify(headings)}`);
}

let browser = null;
let launchDetail = "";
try {
  try {
    browser = await chromium.launch({ headless: true });
    launchDetail = `bundled Playwright Chromium (${chromium.executablePath()})`;
  } catch (bundledError) {
    console.log(`Bundled browser unavailable (${short(bundledError)}); retrying with system Chrome.`);
    const fallback = process.env.CHROME_PATH || "/usr/bin/chromium";
    try {
      browser = await chromium.launch({
        headless: true,
        executablePath: fallback,
        args: ["--no-sandbox"],
      });
      launchDetail = `${fallback} (--no-sandbox)`;
    } catch (fallbackError) {
      launchDetail = `launch failed: ${short(fallbackError)}`;
    }
  }
  console.log(`Chromium: ${launchDetail}`);

  const context = browser ? await browser.newContext({ viewport: { width: 1440, height: 900 } }) : null;
  const page = context ? await context.newPage() : null;
  if (page) {
    page.setDefaultTimeout(DEFAULT_TIMEOUT);
    page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);
  }

  // 1. Case switcher on the courtroom setup screen.
  await runCheck("courtroom case switcher", async () => {
    if (!page) throw new Error(`browser unavailable: ${launchDetail}`);
    await page.goto(`${BASE}/case/delhi-liquor-2022/courtroom`);
    const count = await waitForCaseOptions(page);
    const current = await page.locator(SWITCHER).inputValue();
    assert.equal(current, "delhi-liquor-2022", `switcher value was ${current}`);
    await page.locator(SWITCHER).selectOption("vishaka-1997");
    await page.waitForURL("**/case/vishaka-1997/courtroom", { timeout: DEFAULT_TIMEOUT });
    await expectVisibleH1(page, /Vishaka/i);
    return { detail: `${count} options; switched to vishaka-1997` };
  });

  // 2. Start New Case modal wizard launches the selected case.
  await runCheck("start-case modal", async () => {
    if (!page) throw new Error(`browser unavailable: ${launchDetail}`);
    await page.goto(`${BASE}/dashboard`);
    await page.getByRole("button", { name: "Start New Case" }).first().click();
    await page.getByRole("button", { name: /Option A: Case Library/ }).click();
    await page.getByText("Vishaka v. State of Rajasthan", { exact: true }).first().click();
    await page.getByRole("button", { name: /^Continue$/ }).click();
    await page.getByRole("button", { name: /^Continue$/ }).click();
    await page.getByRole("button", { name: /Launch 2D Courtroom Now/ }).click();
    await page.waitForURL("**/case/vishaka-1997/courtroom", { timeout: DEFAULT_TIMEOUT });
    return { detail: "wizard launched /case/vishaka-1997/courtroom" };
  });

  // 3. Case switcher on the prep screen.
  await runCheck("prep case switcher", async () => {
    if (!page) throw new Error(`browser unavailable: ${launchDetail}`);
    await page.goto(`${BASE}/case/vishaka-1997/prep`);
    const count = await waitForCaseOptions(page);
    await page.locator(SWITCHER).selectOption("hussainara-1979");
    await page.waitForURL("**/case/hussainara-1979/prep", { timeout: DEFAULT_TIMEOUT });
    await expectVisibleH1(page, /Hussainara/i);
    return { detail: `${count} options; switched to hussainara-1979` };
  });

  // 4. RAG answer must be grounded in the Vishaka judgment.
  await runCheck("RAG grounded answer", async () => {
    const res = await fetch(`${BASE}/api/rag/ask`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: "What guidelines did the Supreme Court frame to prevent sexual harassment at the workplace?",
        caseId: "vishaka-1997",
      }),
    });
    assert.equal(res.status, 200, `status ${res.status}`);
    const json = await res.json();
    const sources = Array.isArray(json.sources) ? json.sources : [];
    assert(sources.length > 0, "sources were empty");
    const grounding = sources
      .map((s) => `${s.section_label ?? ""} ${typeof s.text === "string" ? s.text : ""}`)
      .join("\n");
    assert(
      /vishaka|AIR\s*1997\s*SC\s*3011/i.test(grounding),
      `no Vishaka/AIR 1997 SC 3011 citation in sources: ${grounding.slice(0, 200)}`
    );
    return { detail: `${sources.length} grounded sources` };
  });

  // 5. Legacy practice-library aliases resolve to canonical case ids.
  await runCheck("case alias resolution", async () => {
    const res = await fetch(`${BASE}/api/cases/pub-3`);
    assert.equal(res.status, 200, `status ${res.status}`);
    const json = await res.json();
    const id = json?.case?.id ?? json?.id;
    assert.equal(id, "hussainara-1979", `resolved id ${id}`);
    return { detail: "pub-3 → hussainara-1979" };
  });

  // 6. Dashboard docket links must use canonical slugs.
  await runCheck("docket canonical links", async () => {
    if (!page) throw new Error(`browser unavailable: ${launchDetail}`);
    // Docket links render in two passes; wait for all dashboard fetches to settle.
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => document.querySelectorAll('a[href^="/case/"]').length > 0,
      null,
      { timeout: DEFAULT_TIMEOUT }
    );
    const hrefs = await page.locator('a[href^="/case/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") || "")
    );
    assert(!hrefs.some((href) => href.includes("case-184")), `legacy link found: ${hrefs.join(", ")}`);
    assert(
      hrefs.some((href) => href.includes("electoral-bonds-2024")),
      `no canonical electoral-bonds-2024 link: ${hrefs.join(", ")}`
    );
    return { detail: `${hrefs.length} case links, all canonical` };
  });

  // 7. In-session switcher. Depends on the LLM provider, so skip if session start fails.
  await runCheck("in-session case switcher", async () => {
    if (!page) throw new Error(`browser unavailable: ${launchDetail}`);
    let count;
    try {
      await page.goto(`${BASE}/case/vishaka-1997/courtroom`);
      const enter = page.getByRole("button", { name: /Enter the courtroom/ });
      await enter.waitFor({ state: "visible", timeout: DEFAULT_TIMEOUT });
      await enter.click();
      count = await waitForCaseOptions(page, { timeout: SESSION_TIMEOUT, inSession: true });
    } catch (err) {
      const msg = short(err).toLowerCase();
      const providerIssue = /401|403|429|api[_ -]?key|openrouter/.test(msg);
      if (providerIssue) {
        return { status: "SKIP", detail: `LLM provider unavailable: ${short(err)}` };
      }
      // Any other failure is an app regression, not a missing credential.
      throw err;
    }
    assert(count >= MIN_CASES, `only ${count} switcher options`);
    await page.locator(SWITCHER).selectOption("maneka-gandhi-1978");
    await page.waitForURL("**/case/maneka-gandhi-1978/courtroom", { timeout: DEFAULT_TIMEOUT });
    return { detail: `${count} options; switched in-session to maneka-gandhi-1978` };
  });
} finally {
  if (browser) await browser.close();
}

const failed = results.filter((r) => r.status === "FAIL").length;
const skipped = results.filter((r) => r.status === "SKIP").length;
console.log(`\n${results.length} check(s): ${results.length - failed - skipped} pass, ${failed} fail, ${skipped} skip.`);
process.exit(failed ? 1 : 0);
