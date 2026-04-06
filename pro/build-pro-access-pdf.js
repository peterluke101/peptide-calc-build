#!/usr/bin/env node
/**
 * Peptide Calc Pro — Access PDF Builder
 * Usage: node build-pro-access-pdf.js [CODE]
 * Example: node build-pro-access-pdf.js PCPRO-8FDEVYRX
 *
 * Requires: npm install puppeteer
 * Output: peptide-calc-pro-access-[CODE].pdf
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const code = process.argv[2] || 'PCPRO-XXXXXXXX';

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a2e; }

  .page { width: 210mm; padding: 40px 50px; page-break-after: always; }
  .page:last-child { page-break-after: avoid; }

  /* Cover Page */
  .cover {
    background: #0a0f1e;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 297mm; text-align: center;
    padding: 60px;
  }
  .cover-label { color: #3DE8C3; font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; }
  .cover-title { color: #ffffff; font-size: 96px; font-weight: 800; line-height: 1; margin-bottom: 20px; }
  .cover-divider { width: 120px; height: 2px; background: #3DE8C3; margin: 20px auto; }
  .cover-sub { color: #c8cad6; font-size: 22px; font-weight: 400; margin-bottom: 40px; }
  .cover-congrats { color: #3DE8C3; font-size: 18px; font-weight: 600; }
  .cover-desc { color: #8890a4; font-size: 14px; margin-top: 8px; }
  .cover-brand { color: #3DE8C3; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 60px; }

  /* Activation Page */
  .activation { padding: 60px 60px; }
  .section-label { color: #3DE8C3; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .section-title { font-size: 32px; font-weight: 800; color: #0a0f1e; margin-bottom: 32px; }
  .code-box {
    background: #0a0f1e; border-radius: 12px;
    padding: 24px 32px; margin: 0 0 40px 0;
    text-align: center;
  }
  .code-label { color: #8890a4; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .code-value { color: #3DE8C3; font-size: 28px; font-weight: 700; letter-spacing: 4px; font-family: monospace; }
  .steps-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; color: #0a0f1e; }
  .step { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
  .step-num { background: #3DE8C3; color: #0a0f1e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
  .step-text { font-size: 15px; color: #2a2a3e; line-height: 1.6; }
  .step-url { color: #3DE8C3; font-weight: 600; }
  .features-title { font-size: 18px; font-weight: 700; margin: 40px 0 20px; color: #0a0f1e; }
  .feature { padding: 16px 20px; background: #f8f9ff; border-radius: 10px; margin-bottom: 12px; border-left: 3px solid #3DE8C3; }
  .feature-name { font-weight: 700; font-size: 14px; color: #0a0f1e; margin-bottom: 4px; }
  .feature-desc { font-size: 13px; color: #5a5a7a; line-height: 1.5; }

  /* Quick Start Page */
  .quickstart { padding: 60px 60px; }
  .qs-section { margin-bottom: 32px; }
  .qs-section-title { font-size: 16px; font-weight: 700; color: #0a0f1e; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #3DE8C3; }
  .qs-step { font-size: 14px; color: #3a3a5a; line-height: 1.7; padding: 4px 0 4px 16px; border-left: 2px solid #e8eaf0; margin-bottom: 4px; }
  .tip-box { background: #0a0f1e; border-radius: 10px; padding: 20px 24px; margin-top: 32px; }
  .tip-label { color: #3DE8C3; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .tip { font-size: 13px; color: #c8cad6; line-height: 1.7; margin-bottom: 6px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e8eaf0; }
  .footer-brand { color: #3DE8C3; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .footer-disclaimer { font-size: 11px; color: #9a9ab0; line-height: 1.5; }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="cover-label">Peptide Schedule Calculator</div>
  <div class="cover-title">Pro</div>
  <div class="cover-divider"></div>
  <div class="cover-sub">Lifetime Access — One Time</div>
  <div class="cover-congrats">You're in.</div>
  <div class="cover-desc">Your access code and activation guide are on the next page.</div>
  <div class="cover-brand">Peter Luke Digital</div>
</div>

<!-- PAGE 2: ACTIVATION -->
<div class="page activation">
  <div class="section-label">Your Access</div>
  <div class="section-title">Activate Pro in 60 seconds</div>

  <div class="code-box">
    <div class="code-label">Your Lifetime Access Code</div>
    <div class="code-value">${code}</div>
  </div>

  <div class="steps-title">How to Activate</div>

  <div class="step">
    <div class="step-num">1</div>
    <div class="step-text">Go to <span class="step-url">peptide-calc-48x.pages.dev</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-text">Tap the ⚙️ settings icon in the top right corner</div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-text">Scroll to <strong>Pro Access</strong> → enter your code above → tap <strong>Activate</strong></div>
  </div>
  <div class="step">
    <div class="step-num">4</div>
    <div class="step-text">You'll see a green ✓ and a <strong>PRO</strong> badge. Features unlock immediately.</div>
  </div>

  <div class="features-title">What Just Unlocked</div>

  <div class="feature">
    <div class="feature-name">Advanced Stack Builder</div>
    <div class="feature-desc">7 pre-built stacks for your specific goal. One-tap load — GLP-1 Recovery, Lean Bulk, Longevity, Cognitive, Body Recomp, Sleep Quality, Anti-Aging.</div>
  </div>
  <div class="feature">
    <div class="feature-name">Injection Site Rotation Log</div>
    <div class="feature-desc">Track sites, flag overworked areas, and get rotation recommendations based on your history.</div>
  </div>
  <div class="feature">
    <div class="feature-name">Full GLP-1 Titration Protocols</div>
    <div class="feature-desc">All 5 titration ladders side by side: Semaglutide, Tirzepatide, Retatrutide, Cagrilintide, Cagri+Sema combo.</div>
  </div>
  <div class="feature">
    <div class="feature-name">Cycle Sync + Break Planner</div>
    <div class="feature-desc">12-month cycle map, projected restart dates, calendar export.</div>
  </div>
  <div class="feature">
    <div class="feature-name">PDF + CSV Export</div>
    <div class="feature-desc">Export your full protocol for your physician or a spreadsheet. One tap.</div>
  </div>
</div>

<!-- PAGE 3: QUICK START -->
<div class="page quickstart">
  <div class="section-label">Quick Start</div>
  <div class="section-title">First 5 Minutes With Pro</div>

  <div class="qs-section">
    <div class="qs-section-title">If you're on a GLP-1 (Sema / Tirz / Reta)</div>
    <div class="qs-step">1. Open Stack Builder → tap "GLP-1 Recovery" → Load Stack</div>
    <div class="qs-step">2. Adjust to your current week's dose</div>
    <div class="qs-step">3. Check the titration protocol — find your week, confirm next dose</div>
  </div>

  <div class="qs-section">
    <div class="qs-section-title">If you're running a healing stack (BPC-157 / TB-500)</div>
    <div class="qs-step">1. Stack Builder → "GLP-1 Recovery" includes a BPC+TB healing add-on</div>
    <div class="qs-step">2. Or load the standalone healing config — timing is pre-set</div>
  </div>

  <div class="qs-section">
    <div class="qs-section-title">If you're focused on longevity</div>
    <div class="qs-step">1. Stack Builder → "Longevity Stack" → loads NAD+ + Epitalon + GHK-Cu + MOTS-C</div>
    <div class="qs-step">2. Adjust your doses. Timing and frequency are pre-configured.</div>
  </div>

  <div class="qs-section">
    <div class="qs-section-title">To track injection sites</div>
    <div class="qs-step">1. Log an injection as usual</div>
    <div class="qs-step">2. A "Site" field appears — tap your injection location</div>
    <div class="qs-step">3. After 3+ logs, check "Site Rotation" view for your recommendation</div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Tips</div>
    <div class="tip">→ Export to PDF before any doctor's appointment — formats cleanly</div>
    <div class="tip">→ 12-month cycle planner is in Schedule tab, scroll to the bottom</div>
    <div class="tip">→ If you clear browser data, just re-enter your code in Settings</div>
    <div class="tip">→ Works on any device — just re-enter your code</div>
  </div>

  <div class="footer">
    <div class="footer-brand">Peter Luke Digital — peterlukedigital.com</div>
    <div class="footer-disclaimer">
      Questions? aresmastercontrol101@gmail.com · 24–48h response<br>
      For personal tracking only. Not medical advice. Consult a qualified healthcare provider before starting any peptide protocol.
    </div>
  </div>
</div>

</body>
</html>`;

async function buildPDF() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const filename = `peptide-calc-pro-access-${code}.pdf`;
  await page.pdf({
    path: filename,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  console.log(`✅ Generated: ${filename}`);
}

buildPDF().catch(err => {
  console.error('Error:', err.message);
  console.log('\nNote: Install puppeteer first: npm install puppeteer');
  process.exit(1);
});
