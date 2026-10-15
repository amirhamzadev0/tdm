// Crawls the header and footer links from the home page and checks that each resolves.
// Usage: node scripts/verify-navigation.mjs   (server must be running)
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3120";

const html = await fetch(`${BASE}/`).then((response) => response.text());

function linksWithin(tag) {
  const match = html.match(new RegExp(`<${tag}[\\s\\S]*?</${tag}>`, "i"));
  if (!match) return [];
  return [...match[0].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
}

const hrefs = [...new Set([...linksWithin("header"), ...linksWithin("footer")])].filter(
  (href) => href.startsWith("/") && !href.startsWith("//"),
);

let failures = 0;
for (const href of hrefs) {
  const path = href.split("#")[0] || "/";
  const response = await fetch(BASE + path, { redirect: "manual" });
  const ok = response.status === 200;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${href} -> ${response.status}`);
}

if (hrefs.length === 0) {
  console.log("FAIL  no header/footer links found");
  failures += 1;
}

console.log(failures === 0 ? `\n${hrefs.length} links resolved.` : `\n${failures} link(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
