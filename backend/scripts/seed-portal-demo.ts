// Creates (or resets) one DEMO account per portal so the Pathology Lab and
// Publication logins can be tried out. Touches only these two portal users.
//   npx payload run scripts/seed-portal-demo.ts
//   DEMO_PASSWORD='…12+ chars…' npx payload run scripts/seed-portal-demo.ts   # custom password
// Delete the demo accounts (Admin → Portals → Portal Users) before real use.
import { getPayload } from "payload";
import config from "@payload-config";

const DEMO_USERS = [
  {
    portal: "pathology",
    email: "demo.pathology@sewabharti.test",
    name: "Demo Pathology User",
    password: process.env.DEMO_PASSWORD || "Pathology@Demo2026",
  },
  {
    portal: "publication",
    email: "demo.publication@sewabharti.test",
    name: "Demo Publication User",
    password: process.env.DEMO_PASSWORD || "Publication@Demo2026",
  },
] as const;

const payload = await getPayload({ config });

for (const u of DEMO_USERS) {
  const existing = await payload.find({
    collection: "portal-users",
    where: { email: { equals: u.email } },
    limit: 1,
    depth: 0,
  });
  const data = { email: u.email, name: u.name, portal: u.portal, password: u.password };
  if (existing.docs[0]) {
    const id = existing.docs[0].id;
    await payload.update({ collection: "portal-users", id, data });
    // Clear any lockout from earlier failed attempts.
    await payload.unlock({ collection: "portal-users", data: { email: u.email, password: u.password }, overrideAccess: true });
    console.log(`reset   ${u.portal.padEnd(11)} ${u.email}`);
  } else {
    await payload.create({ collection: "portal-users", data });
    console.log(`created ${u.portal.padEnd(11)} ${u.email}`);
  }
}

process.exit(0);
