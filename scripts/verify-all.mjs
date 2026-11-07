import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(".cursor/verification-evidence");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const pages = [
    { url: "http://localhost:3000/", file: "01-landing-hero.png" },
    { url: "http://localhost:3000/#simulation", file: "02-courtroom-simulator.png", wait: 1000 },
    { url: "http://localhost:3000/login", file: "03-login-desktop.png" },
    { url: "http://localhost:3000/signup", file: "04-signup-desktop.png" },
    { url: "http://localhost:3000/dashboard", file: "05-dashboard-desktop.png" },
    { url: "http://localhost:3000/case/402/prep", file: "06-case-prep-studio.png" },
  ];

  for (const item of pages) {
    const page = await context.newPage();
    console.log(`Navigating to ${item.url}...`);
    await page.goto(item.url, { waitUntil: "networkidle" });
    if (item.wait) {
      await page.waitForTimeout(item.wait);
    }
    const dest = path.join(OUT_DIR, item.file);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`Saved: ${dest}`);
    await page.close();
  }

  await browser.close();
  console.log("All screenshots captured successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
