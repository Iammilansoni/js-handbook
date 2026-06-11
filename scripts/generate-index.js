// Post-build script: generates dist/client/index.html for static SPA deployment
// TanStack Start (SSR) doesn't output index.html — we create the shell manually.

import { readFileSync, writeFileSync } from "fs";

const css = `
  <link rel="stylesheet" href="/assets/index-C7ixCkZR.css" />
  <link rel="stylesheet" href="/assets/styles-RgHN8cvY.css" />
`;

// Find the main entry JS from the assets folder
import { readdirSync } from "fs";
const assets = readdirSync("dist/client/assets");
const mainJs = assets.find((f) => f.startsWith("index-") && f.endsWith(".js") && !f.endsWith(".css"));
const mainCss = assets.filter((f) => f.endsWith(".css"));

const cssLinks = mainCss.map((f) => `  <link rel="stylesheet" href="/assets/${f}" />`).join("\n");
const jsScript = mainJs ? `  <script type="module" src="/assets/${mainJs}"></script>` : "";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JS Handbook | FAANG Track</title>
    <meta name="description" content="The ultimate JavaScript handbook for FAANG interview preparation." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
${jsScript}
  </body>
</html>`;

writeFileSync("dist/client/index.html", html);
console.log("✓ Generated dist/client/index.html for static deployment");
