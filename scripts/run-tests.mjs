// Runs every tests/*.test.ts file with the Node test runner via tsx.
// Needed because Node 20 and Windows shells do not expand globs for `node --test`.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "tests";
const files = readdirSync(dir)
  .filter((name) => name.endsWith(".test.ts"))
  .map((name) => join(dir, name));

if (files.length === 0) {
  console.error("No test files found in tests/");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--import", "tsx", "--test", ...files], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
