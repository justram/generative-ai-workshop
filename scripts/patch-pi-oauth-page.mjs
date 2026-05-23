import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const oauthPagePath = path.join(
  root,
  "node_modules/@earendil-works/pi-ai/dist/utils/oauth/oauth-page.js",
);

const returnScript = String.raw`
    <script>
      (async () => {
        const ports = [Number(new URLSearchParams(location.search).get("returnPort")), 4174, 4175, 4173, 3000, 5173].filter(Boolean);
        for (const port of [...new Set(ports)]) {
          try {
            const response = await fetch("http://127.0.0.1:" + port + "/api/auth/status", { cache: "no-store" });
            if (response.ok) {
              if (window.opener && !window.opener.closed) window.opener.focus();
              window.close();
              setTimeout(() => {
                document.querySelector("[data-close-hint]")?.removeAttribute("hidden");
              }, 500);
              return;
            }
          } catch {}
        }
        document.querySelector("[data-close-hint]")?.removeAttribute("hidden");
      })();
    </script>
    <p data-close-hint hidden style="margin-top:16px">
      ChatGPT 登入已完成。可以關閉這個視窗，回到工作坊。
      <br />
      <a style="color:#bfdbfe" href="http://127.0.0.1:4174/?auth=success">開啟 4174 埠</a>
      ·
      <a style="color:#bfdbfe" href="http://127.0.0.1:4175/?auth=success">開啟 4175 埠</a>
    </p>`;

let source = await fs.readFile(oauthPagePath, "utf8");
let changed = false;

if (!source.includes("data-close-hint")) {
  source = source.replace(
    /\n    <script>\n      \(async \(\) => \{[\s\S]*?Returning to the workshop\.\.\.[\s\S]*?Open port 4175<\/a>\n    <\/p>/,
    "",
  );
  source = source.replace(
    '    ${details ? `<div class="details">${details}</div>` : ""}',
    '    ${details ? `<div class="details">${details}</div>` : ""}\\n    ${options.success ? `' +
      returnScript.replaceAll("`", "\\`") +
      '` : ""}',
  );
  source = source.replace(
    "        message,\n    });\n}",
    "        message,\n        success: true,\n    });\n}",
  );
  changed = true;
}

if (source.includes("Login is complete.")) {
  source = source
    .replace(
      "Login is complete. You can close this window and return to the workshop.",
      "ChatGPT 登入已完成。可以關閉這個視窗，回到工作坊。",
    )
    .replace("Open port 4174", "開啟 4174 埠")
    .replace("Open port 4175", "開啟 4175 埠");
  changed = true;
}

if (source.includes('title: "Authentication successful"')) {
  source = source
    .replace('title: "Authentication successful"', 'title: "ChatGPT 登入完成"')
    .replace('heading: "Authentication successful"', 'heading: "ChatGPT 登入完成"');
  changed = true;
}

if (changed) {
  await fs.writeFile(oauthPagePath, source, "utf8");
  console.log("Patched pi OAuth success page.");
} else {
  console.log("pi OAuth success page already patched.");
}
