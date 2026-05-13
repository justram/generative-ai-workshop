import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const oauthPagePath = path.join(root, "node_modules/@earendil-works/pi-ai/dist/utils/oauth/oauth-page.js");

const returnScript = String.raw`
    <script>
      (async () => {
        const ports = [Number(new URLSearchParams(location.search).get("returnPort")), 4174, 4175, 4173, 3000, 5173].filter(Boolean);
        for (const port of [...new Set(ports)]) {
          const target = "http://127.0.0.1:" + port + "/?auth=success";
          try {
            const response = await fetch("http://127.0.0.1:" + port + "/api/auth/status", { cache: "no-store" });
            if (response.ok) {
              location.replace(target);
              return;
            }
          } catch {}
        }
      })();
    </script>
    <p style="margin-top:16px">
      Returning to the workshop...
      <br />
      <a style="color:#bfdbfe" href="http://127.0.0.1:4174/?auth=success">Open port 4174</a>
      ·
      <a style="color:#bfdbfe" href="http://127.0.0.1:4175/?auth=success">Open port 4175</a>
    </p>`;

let source = await fs.readFile(oauthPagePath, "utf8");
if (!source.includes("Returning to the workshop...")) {
  source = source.replace(
    '    ${details ? `<div class="details">${details}</div>` : ""}',
    '    ${details ? `<div class="details">${details}</div>` : ""}\\n    ${options.success ? `' + returnScript.replaceAll("`", "\\`") + '` : ""}',
  );
  source = source.replace(
    '        message,\n    });\n}',
    '        message,\n        success: true,\n    });\n}',
  );
  await fs.writeFile(oauthPagePath, source, "utf8");
  console.log("Patched pi OAuth success page.");
} else {
  console.log("pi OAuth success page already patched.");
}
