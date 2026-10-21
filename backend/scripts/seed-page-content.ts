// Fills the Page Content globals (home-content, about-content, …) with the
// original page copy. Idempotent and safe on production.
//   npx payload run scripts/seed-page-content.ts          # fills EMPTY fields only (editor changes are kept)
//   FORCE=1 npx payload run scripts/seed-page-content.ts  # overwrites existing values
import { getPayload } from "payload";
import config from "@payload-config";
import { PAGE_CONTENT } from "../src/seed/data/page-content";

const force = process.env.FORCE === "1";
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isEmpty = (v: unknown) =>
  v == null || v === "" || (Array.isArray(v) && v.length === 0);

// Merge `seed` into `current`: keep what is already set, fill the rest.
function fill(current: unknown, seed: unknown): unknown {
  if (isObj(seed)) {
    const cur = isObj(current) ? current : {};
    const out: Record<string, unknown> = { ...cur };
    for (const [k, v] of Object.entries(seed)) out[k] = fill(cur[k], v);
    return out;
  }
  return isEmpty(current) ? seed : current;
}

const payload = await getPayload({ config });
for (const [slug, seed] of Object.entries(PAGE_CONTENT)) {
  const current = await payload.findGlobal({ slug: slug as never, depth: 0 });
  const data = force ? seed : (fill(current, seed) as Record<string, unknown>);
  await payload.updateGlobal({ slug: slug as never, data: data as never, depth: 0 });
  console.log(`${slug}: ${force ? "overwritten" : "filled empty fields"}`);
}
await new Promise((r) => setTimeout(r, 2000)); // let the website-refresh webhooks go out
process.exit(0);
