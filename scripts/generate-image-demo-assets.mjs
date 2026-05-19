import { mkdir, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const outDir = path.resolve("data/images");

const shell = (strings, ...values) =>
  String.raw({ raw: strings }, ...values).trim();

const frame = (title, body, bg = "#f8fafc") => shell`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480">
  <rect width="720" height="480" fill="${bg}"/>
  <rect x="20" y="20" width="680" height="440" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="44" y="64" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#0f172a">${title}</text>
  ${body}
</svg>`;

const assets = {
  "counting-circles.png": frame(
    "Object counting",
    shell`
      <text x="44" y="105" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#64748b">Count the circles by color.</text>
      ${[
        [105, 165, "#ef4444"], [195, 160, "#ef4444"], [302, 175, "#ef4444"], [550, 308, "#ef4444"],
        [430, 160, "#2563eb"], [520, 175, "#2563eb"], [610, 155, "#2563eb"],
        [145, 310, "#16a34a"], [250, 300, "#16a34a"], [365, 315, "#16a34a"], [475, 300, "#16a34a"],
      ].map(([cx, cy, fill]) => `<circle cx="${cx}" cy="${cy}" r="34" fill="${fill}" stroke="#0f172a" stroke-width="3"/>`).join("")}
      <text x="44" y="425" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#334155">Red: 4, Blue: 3, Green: 4, Total: 11</text>
    `,
  ),
  "precise-chart.png": frame(
    "Precise chart values",
    shell`
      <line x1="88" y1="365" x2="650" y2="365" stroke="#334155" stroke-width="3"/>
      <line x1="88" y1="125" x2="88" y2="365" stroke="#334155" stroke-width="3"/>
      ${[
        ["A", 130, 128, "#38bdf8", "31.2%"],
        ["B", 250, 255, "#f97316", "44.7%"],
        ["C", 370, 196, "#22c55e", "38.6%"],
        ["D", 490, 92, "#a855f7", "22.1%"],
      ].map(([label, x, h, fill, value]) => `
        <rect x="${x}" y="${365 - h}" width="72" height="${h}" fill="${fill}" stroke="#0f172a" stroke-width="2"/>
        <text x="${Number(x) + 36}" y="394" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#334155">${label}</text>
        <text x="${Number(x) + 36}" y="${365 - h - 12}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#0f172a">${value}</text>
      `).join("")}
      <text x="104" y="110" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#475569">Note: Product B includes returned units.</text>
    `,
  ),
  "overlapping-text.png": frame(
    "OCR challenges",
    shell`
      <text x="52" y="112" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#dc2626">VERIFY: X7K-42</text>
      <text x="130" y="240" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#0ea5e9" transform="rotate(-8 130 240)">VISION</text>
      <text x="270" y="250" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#f97316" transform="rotate(7 270 250)">TEST</text>
      <text x="215" y="238" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#22c55e" opacity="0.72" transform="rotate(3 215 238)">READ</text>
      <rect x="70" y="330" width="580" height="64" rx="10" fill="#f1f5f9" stroke="#94a3b8"/>
      <text x="98" y="371" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#0f172a">R00M: 204</text>
      <text x="390" y="371" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#0f172a">T1M3: 09:45</text>
    `,
  ),
  "spatial-relations.png": frame(
    "Spatial relationships",
    shell`
      ${[0, 1, 2].map(i => `<line x1="${170 + i * 150}" y1="118" x2="${170 + i * 150}" y2="392" stroke="#cbd5e1" stroke-width="2"/>`).join("")}
      ${[0, 1, 2].map(i => `<line x1="90" y1="${150 + i * 105}" x2="625" y2="${150 + i * 105}" stroke="#cbd5e1" stroke-width="2"/>`).join("")}
      <circle cx="170" cy="150" r="30" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/><text x="170" y="157" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">A</text>
      <rect x="320" y="120" width="60" height="60" fill="#f97316" stroke="#0f172a" stroke-width="3"/><text x="350" y="158" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">B</text>
      <polygon points="515,116 555,184 475,184" fill="#22c55e" stroke="#0f172a" stroke-width="3"/><text x="515" y="166" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">C</text>
      <polygon points="170,225 206,255 170,285 134,255" fill="#a855f7" stroke="#0f172a" stroke-width="3"/><text x="170" y="263" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">D</text>
      <circle cx="350" cy="255" r="30" fill="#eab308" stroke="#0f172a" stroke-width="3"/><text x="350" y="263" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">E</text>
      <rect x="485" y="330" width="60" height="60" rx="10" fill="#ef4444" stroke="#0f172a" stroke-width="3"/><text x="515" y="368" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700">F</text>
    `,
  ),
  "crossing-lines.png": frame(
    "Line chart tracking",
    shell`
      <line x1="82" y1="365" x2="650" y2="365" stroke="#334155" stroke-width="3"/>
      <line x1="82" y1="120" x2="82" y2="365" stroke="#334155" stroke-width="3"/>
      ${["Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => `<text x="${125 + i * 115}" y="397" text-anchor="middle" font-family="Arial" font-size="16" fill="#334155">${m}</text>`).join("")}
      <polyline points="125,310 240,250 355,215 470,190 585,140" fill="none" stroke="#2563eb" stroke-width="5"/>
      <polyline points="125,210 240,185 355,195 470,245 585,285" fill="none" stroke="#f97316" stroke-width="5"/>
      <polyline points="125,330 240,275 355,210 470,170 585,125" fill="none" stroke="#16a34a" stroke-width="5"/>
      <text x="500" y="128" font-family="Arial" font-size="16" fill="#2563eb">Alpha Nov: 92</text>
      <text x="500" y="180" font-family="Arial" font-size="16" fill="#16a34a">Gamma crosses Beta in Sep</text>
      <text x="500" y="305" font-family="Arial" font-size="16" fill="#f97316">Beta</text>
    `,
  ),
  "dot-grid.png": frame(
    "Grid patterns",
    shell`
      ${Array.from({ length: 6 }, (_, y) =>
        Array.from({ length: 8 }, (_, x) => {
          const missing = (x === 2 && y >= 2 && y <= 4) || (y === 4 && x >= 2 && x <= 5);
          return missing
            ? `<circle cx="${135 + x * 62}" cy="${130 + y * 50}" r="12" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 4"/>`
            : `<circle cx="${135 + x * 62}" cy="${130 + y * 50}" r="12" fill="#0f172a"/>`;
        }).join("")
      ).join("")}
      <text x="60" y="430" font-family="Arial" font-size="18" fill="#475569">Missing dots form an L shape.</text>
    `,
  ),
  "similar-numbers-table.png": frame(
    "Table precision",
    shell`
      <rect x="82" y="115" width="560" height="260" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      ${[0, 1, 2, 3, 4].map(i => `<line x1="82" y1="${167 + i * 52}" x2="642" y2="${167 + i * 52}" stroke="#cbd5e1" stroke-width="2"/>`).join("")}
      ${[0, 1, 2, 3].map(i => `<line x1="${222 + i * 140}" y1="115" x2="${222 + i * 140}" y2="375" stroke="#cbd5e1" stroke-width="2"/>`).join("")}
      ${["Row", "A", "B", "C"].map((h, i) => `<text x="${152 + i * 140}" y="150" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">${h}</text>`).join("")}
      ${[
        ["1", "48.73", "32.10", "47.38"],
        ["2", "47.83", "12.44", "48.37"],
        ["3", "38.47", "59.29", "47.83"],
        ["4", "83.47", "40.01", "74.38"],
      ].map((row, r) => row.map((v, c) => `<text x="${152 + c * 140}" y="${202 + r * 52}" text-anchor="middle" font-family="Arial" font-size="21" fill="${v === "47.83" ? "#dc2626" : "#0f172a"}">${v}</text>`).join("")).join("")}
    `,
  ),
  "paper-table.png": frame(
    "Academic table",
    shell`
      <text x="70" y="116" font-family="Arial" font-size="18" fill="#334155">Benchmark accuracy by task</text>
      <rect x="70" y="140" width="580" height="230" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      ${[0, 1, 2, 3].map(i => `<line x1="70" y1="${185 + i * 46}" x2="650" y2="${185 + i * 46}" stroke="#cbd5e1"/>`).join("")}
      ${[0, 1, 2, 3].map(i => `<line x1="${215 + i * 145}" y1="140" x2="${215 + i * 145}" y2="370" stroke="#cbd5e1"/>`).join("")}
      ${["Model", "Task 1", "Task 2", "Task 3"].map((h, i) => `<text x="${142 + i * 145}" y="170" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700">${h}</text>`).join("")}
      ${[
        ["BERT", "83.4", "78.2", "91.6"],
        ["RoBERTa", "84.1", "81.9†", "90.8"],
        ["GPT-small", "79.5", "76.0", "88.3"],
        ["Human", "92.0", "90.5", "96.2"],
      ].map((row, r) => row.map((v, c) => `<text x="${142 + c * 145}" y="${216 + r * 46}" text-anchor="middle" font-family="Arial" font-size="18">${v}</text>`).join("")).join("")}
      <text x="78" y="415" font-family="Arial" font-size="16" fill="#475569">† score measured with extra validation data.</text>
    `,
  ),
  "invoice.png": frame(
    "Scanned invoice",
    shell`
      <rect x="85" y="105" width="550" height="300" fill="#fffef7" stroke="#94a3b8" stroke-width="2" transform="rotate(-1 360 255)"/>
      <text x="110" y="150" font-family="Arial" font-size="24" font-weight="700" fill="#0f172a">INVOICE # SZ-2026-0515</text>
      <text x="110" y="190" font-family="Arial" font-size="17" fill="#334155">Stencilzeit Workshop Supplies</text>
      <text x="110" y="218" font-family="Arial" font-size="17" fill="#334155">8F, No. 77, Bade Rd., Taipei</text>
      <line x1="110" y1="245" x2="600" y2="245" stroke="#cbd5e1" stroke-width="2"/>
      <text x="110" y="286" font-family="Arial" font-size="18">Subtotal</text><text x="540" y="286" text-anchor="end" font-family="Arial" font-size="18">$1,200.00</text>
      <text x="110" y="326" font-family="Arial" font-size="18">Tax rate</text><text x="540" y="326" text-anchor="end" font-family="Arial" font-size="18">5%</text>
      <text x="110" y="368" font-family="Arial" font-size="24" font-weight="700">Total due</text><text x="540" y="368" text-anchor="end" font-family="Arial" font-size="24" font-weight="700">$1,260.00</text>
    `,
  ),
  "schematic.png": frame(
    "Technical diagram",
    shell`
      <rect x="295" y="135" width="130" height="185" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
      <text x="360" y="230" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700">U1</text>
      ${Array.from({ length: 8 }, (_, i) => {
        const y = 155 + i * 21;
        return `<line x1="265" y1="${y}" x2="295" y2="${y}" stroke="#0f172a" stroke-width="2"/><text x="252" y="${y + 6}" text-anchor="end" font-family="Arial" font-size="14">${i + 1}</text>
                <line x1="425" y1="${y}" x2="455" y2="${y}" stroke="#0f172a" stroke-width="2"/><text x="468" y="${y + 6}" font-family="Arial" font-size="14">${16 - i}</text>`;
      }).join("")}
      <polyline points="455,281 515,281 515,330" fill="none" stroke="#0f172a" stroke-width="3"/>
      <rect x="492" y="330" width="46" height="22" fill="#fff" stroke="#0f172a" stroke-width="2"/><text x="515" y="370" text-anchor="middle" font-family="Arial" font-size="18">R3 10k</text>
      <line x1="515" y1="352" x2="515" y2="400" stroke="#0f172a" stroke-width="3"/>
      <line x1="490" y1="400" x2="540" y2="400" stroke="#0f172a" stroke-width="3"/><line x1="500" y1="413" x2="530" y2="413" stroke="#0f172a" stroke-width="3"/><line x1="510" y1="426" x2="520" y2="426" stroke="#0f172a" stroke-width="3"/>
      <text x="75" y="420" font-family="Arial" font-size="18" fill="#475569">Pin 7 connects to R3, then to ground.</text>
    `,
  ),
  "pcb.png": frame(
    "Circuit board",
    shell`
      <rect x="78" y="112" width="560" height="300" rx="18" fill="#166534" stroke="#052e16" stroke-width="6"/>
      <rect x="295" y="190" width="130" height="92" rx="8" fill="#111827" stroke="#020617" stroke-width="3"/>
      <text x="360" y="232" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#e5e7eb">STM32F103</text>
      <text x="360" y="256" text-anchor="middle" font-family="Arial" font-size="13" fill="#cbd5e1">MAIN IC</text>
      ${[135, 190, 500, 555].map((x, i) => `<circle cx="${x}" cy="${180 + (i % 2) * 110}" r="20" fill="#fde68a" stroke="#422006" stroke-width="3"/><text x="${x}" y="${186 + (i % 2) * 110}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700">C${i + 1}</text>`).join("")}
      <rect x="90" y="245" width="78" height="54" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
      <text x="129" y="278" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#0f172a">USB-C</text>
      <path d="M168 272 C220 272 240 236 295 236" fill="none" stroke="#facc15" stroke-width="5"/>
      <path d="M425 236 C475 236 500 210 555 210" fill="none" stroke="#38bdf8" stroke-width="5"/>
      <text x="96" y="360" font-family="Arial" font-size="17" fill="#dcfce7">Label near USB: DEBUG-5V</text>
    `,
  ),
};

await mkdir(outDir, { recursive: true });

for (const [pngName, svg] of Object.entries(assets)) {
  const svgPath = path.join(outDir, pngName.replace(/\.png$/, ".svg"));
  const pngPath = path.join(outDir, pngName);
  await writeFile(svgPath, svg);
  await rm(pngPath, { force: true });
  await execFileAsync("sips", ["-s", "format", "png", svgPath, "--out", pngPath]);
}

console.log(`Generated ${Object.keys(assets).length} image demo assets in ${outDir}`);
