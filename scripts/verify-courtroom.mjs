import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3005/case/402/courtroom ...");
  await page.goto("http://localhost:3005/case/402/courtroom", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Initial full 3-Pane view with expanded left drawer
  await page.screenshot({ path: "screenshot-step4-courtroom-arena.png" });
  console.log("Captured screenshot-step4-courtroom-arena.png");

  // 2. Click "Hide Case File" to test drawer collapsing & capture expanded 2D canvas
  const toggleDrawerBtn = page.locator("button:has-text('Hide Case File')");
  if (await toggleDrawerBtn.isVisible()) {
    await toggleDrawerBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "screenshot-step4-drawer-collapsed.png" });
    console.log("Captured screenshot-step4-drawer-collapsed.png");

    // Re-expand drawer
    const showDrawerBtn = page.locator("button:has-text('Show Case File')");
    await showDrawerBtn.click();
    await page.waitForTimeout(600);
  }

  // 3. Click "Insert Question into Mic/Input ➜" on Co-Counsel Whisper
  const insertBtn = page.locator("button:has-text('Insert Question into Mic/Input')");
  if (await insertBtn.isVisible()) {
    await insertBtn.click();
    console.log("Clicked Insert Question into Mic/Input");
    await page.waitForTimeout(500);
  }

  // 4. Submit question to Court
  const submitBtn = page.locator("button:has-text('Submit to Court')");
  if (await submitBtn.isVisible()) {
    await submitBtn.click();
    console.log("Clicked Submit to Court");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "screenshot-step4-witness-response.png" });
    console.log("Captured screenshot-step4-witness-response.png");
  }

  // 5. Raise Objection
  const objBtn = page.locator("button:has-text('Raise Objection')");
  if (await objBtn.isVisible()) {
    await objBtn.click();
    await page.waitForTimeout(400);
    const groundOption = page.locator("button:has-text('Inadmissible Electronic Record')");
    if (await groundOption.isVisible()) {
      await groundOption.click();
      console.log("Selected Inadmissible Electronic Record objection");
      await page.waitForTimeout(1500);
      await page.screenshot({ path: "screenshot-step4-objection-ruling.png" });
      console.log("Captured screenshot-step4-objection-ruling.png");
    }
  }

  // 6. Click Judge Bench to open Persona Modal
  const judgeDais = page.locator("text=Courtroom No. 3 · Sessions Judge Bench").first();
  if (await judgeDais.isVisible()) {
    await judgeDais.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "screenshot-step4-persona-modal.png" });
    console.log("Captured screenshot-step4-persona-modal.png");

    // Close modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // 7. Click Conclude & Request Verdict
  const verdictBtn = page.locator("button:has-text('Conclude & Request Verdict')");
  if (await verdictBtn.isVisible()) {
    await verdictBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "screenshot-step4-verdict-modal.png" });
    console.log("Captured screenshot-step4-verdict-modal.png");
  }

  await browser.close();
  console.log("All verifications and screenshots updated successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
