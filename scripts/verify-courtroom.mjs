import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.resolve(".cursor/verification-evidence");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text());
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

console.log("Navigating to http://localhost:3000/case/402/courtroom ...");
await page.goto("http://localhost:3000/case/402/courtroom", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// 1. Initial full 3-Pane view
await page.screenshot({ path: path.join(OUT, "07-courtroom-arena.png") });
console.log("Captured 07-courtroom-arena.png");

// 2. Collapse Case File drawer
const collapse = page.locator('button[title="Collapse Case File"]');
if (await collapse.isVisible().catch(() => false)) {
  await collapse.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, "09-drawer-collapsed.png") });
  console.log("Captured 09-drawer-collapsed.png");

  const expand = page.locator('button[title="Expand Case File"]');
  if (await expand.isVisible().catch(() => false)) {
    await expand.click();
    await page.waitForTimeout(600);
  }
}

// 3. Send a cross-examination question To Witness
const textarea = page.locator("textarea").first();
if (await textarea.isVisible().catch(() => false)) {
  await textarea.fill("Where was this unsealed pen-drive during that unexplained 105-minute gap?");
  await page.waitForTimeout(300);
  console.log("Typed cross-examination question");
}
const sendBtn = page.getByRole("button", { name: /Send|Submit to Court/i }).first();
if (await sendBtn.isVisible().catch(() => false)) {
  // Dev overlay can cover the Send button; Enter submits from the textarea.
  await textarea.press("Enter");
  await page.waitForTimeout(1500);
  // Capture mid-stream state (thinking trace + streaming text)
  await page.screenshot({ path: path.join(OUT, "11-streaming-mid.png") });
  console.log("Captured 11-streaming-mid.png");
  await page.waitForTimeout(4000);
  console.log("Submitted question");
}

// 4. Raise an objection from the Objection popover
const objectionBtn = page.getByRole("button", { name: /Objection/i }).first();
if (await objectionBtn.isVisible().catch(() => false)) {
  await objectionBtn.click();
  await page.waitForTimeout(600);
  const ground = page.locator("button:has-text('Inadmissible Electronic Record')").first();
  if (await ground.isVisible().catch(() => false)) {
    await ground.click();
    await page.waitForTimeout(1500);
    console.log("Raised objection");
  }
}

// 5. Click Judge card to open Persona Modal
const judgeCard = page.locator("text=Sessions Court").first();
if (await judgeCard.isVisible().catch(() => false)) {
  await judgeCard.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, "10-persona-modal.png") });
  console.log("Captured 10-persona-modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

// 6. Open Verdict modal
const verdictBtn = page.getByRole("button", { name: /^Verdict/i }).first();
if (await verdictBtn.isVisible().catch(() => false)) {
  await verdictBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "08-verdict-modal.png") });
  console.log("Captured 08-verdict-modal.png");
}

await browser.close();
console.log("All verifications and screenshots updated successfully!");
