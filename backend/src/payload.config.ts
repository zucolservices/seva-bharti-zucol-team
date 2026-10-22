import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { LinkFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer from "nodemailer";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { PortalUsers } from "./collections/PortalUsers";
import { Registrations } from "./collections/Registrations";
import { Media } from "./collections/Media";
import { Pillars } from "./collections/Pillars";
import { Events } from "./collections/Events";
import { globals } from "./globals";
import { pageContentGlobals } from "./globals/page-content";
import { validateHref } from "./fields";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isProd = process.env.NODE_ENV === "production";

// Secrets come ONLY from the environment (see .env.example). Fail fast
// instead of silently running with a weak or missing secret.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const PAYLOAD_SECRET = requireEnv("PAYLOAD_SECRET");
if (isProd && PAYLOAD_SECRET.length < 32) {
  throw new Error("PAYLOAD_SECRET must be at least 32 characters in production.");
}

const serverURL = isProd ? requireEnv("NEXT_PUBLIC_SERVER_URL") : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
const normalizeOrigin = (o: string) => o.trim().replace(/\/+$/, "");
// CORS/CSRF allow-list: this CMS origin, the public frontend app (its server
// reads the API; a browser on that origin may too) and any explicit extras.
const allowedOrigins = [
  ...new Set(
    [
      serverURL,
      process.env.FRONTEND_URL ?? "",
      ...(process.env.EXTRA_ALLOWED_ORIGINS?.split(",") ?? []),
    ]
      .map(normalizeOrigin)
      .filter(Boolean),
  ),
];

// SMTP for password-reset / account emails. Without SMTP_HOST, Payload
// writes emails to the server console (fine for local dev only).
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: requireEnv("SMTP_FROM_ADDRESS"),
      defaultFromName: process.env.SMTP_FROM_NAME || "Sewa Bharti CMS",
      transport: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT ?? 587) === 465,
        auth: { user: requireEnv("SMTP_USER"), pass: requireEnv("SMTP_PASS") },
      }),
    })
  : undefined;

export default buildConfig({
  email,
  serverURL,
  secret: PAYLOAD_SECRET,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — Sewa Bharti CMS" },
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: {
        Logo: "/components/admin/Logo#Logo",
        Icon: "/components/admin/Icon#Icon",
      },
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
      actions: ["/components/admin/BackButton#BackButton"],
      providers: ["/components/admin/PasswordToggle#PasswordToggle"],
    },
  },
  collections: [Pillars, Events, Media, Registrations, Users, PortalUsers],
  // Locked accounts must not be distinguishable from a wrong password
  // (prevents confirming which staff emails exist).
  i18n: {
    translations: {
      en: { error: { userLocked: "The email or password provided is incorrect." } },
    },
  },
  globals: [...globals, ...pageContentGlobals],
  // Rich-text links use the same safe-scheme validator as every other link.
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => f.key !== "link"),
      LinkFeature({
        enabledCollections: ["pillars", "events"],
        fields: ({ defaultFields }) =>
          defaultFields.map((f) =>
            "name" in f && f.name === "url"
              ? {
                  ...f,
                  validate: (v: unknown, o: { siblingData?: { linkType?: string } }) =>
                    o?.siblingData?.linkType === "internal" ? true : validateHref(v),
                }
              : f,
          ) as typeof defaultFields,
      }),
    ],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: requireEnv("DATABASE_URL"),
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    },
    // Opt-in only (local dev). Never auto-push against shared/staging/prod DBs.
    push: process.env.PAYLOAD_DB_PUSH === "true",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  // GraphQL is unused by the site — disabled to shrink the attack surface.
  graphQL: { disable: true },
  // Disable Payload's built-in public /api/og image generator (unused; abusable).
  endpoints: [{ path: "/og", method: "get", handler: () => new Response(null, { status: 404 }) }],
  hooks: {
    // Payload's REST error formatter keeps per-field errors only when
    // `instanceof ValidationError` holds, which fails in the bundled production
    // build — the admin then shows a generic toast and never highlights the
    // field or its message. Re-attach the field errors in the shape the admin
    // form expects ({ name, data: { errors: [{ path, message }] }, message }).
    afterError: [
      ({ error }) => {
        const err = error as { status?: number; message?: string; data?: { errors?: unknown } };
        if (err?.status === 400 && Array.isArray(err.data?.errors)) {
          return {
            response: { errors: [{ name: "ValidationError", data: err.data, message: err.message }] },
            status: 400,
          };
        }
      },
    ],
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  upload: {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  },
  // Never leak stack traces / internals in API error responses.
  debug: !isProd,
  telemetry: false,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
