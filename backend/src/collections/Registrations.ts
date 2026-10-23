import type { CollectionConfig, PayloadRequest } from "payload";
import { fromFrontendServer, isAdmin, isAdminOrEditor } from "@/access";
import type { Registration } from "@/payload-types";

// CSV export (GET /api/registrations/export, the "Export to Excel" button
// above the list). Staff only. Excel-friendly: UTF-8 BOM so Hindi shows
// correctly, CRLF line ends, every field quoted.
const COLUMNS: { header: string; value: (r: Registration) => string }[] = [
  { header: "नाम (Name)", value: (r) => r.name },
  { header: "दूरभाष (Phone)", value: (r) => r.phone },
  { header: "कार्य व्यवसाय (Occupation)", value: (r) => r.occupation ?? "" },
  { header: "पता (Address)", value: (r) => r.address ?? "" },
  { header: "ई मेल (Email)", value: (r) => r.email ?? "" },
  {
    header: "Submitted on (IST)",
    value: (r) =>
      r.createdAt
        ? new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(r.createdAt))
        : "",
  },
];

const PHONE_RE = /^\+?\d{10,13}$/;

function csvCell(value: string, header: string): string {
  // Phone numbers as ="+91…" so Excel keeps them as text (no 9.19E+11, no
  // lost "+"). Safe: the value is validated digits only.
  if (header.startsWith("दूरभाष") && PHONE_RE.test(value)) return `"=""${value}"""`;
  // Neutralise spreadsheet formulas in visitor-typed text (CSV injection).
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

async function exportCsv(req: PayloadRequest): Promise<Response> {
  if (!(await isAdminOrEditor({ req } as Parameters<typeof isAdminOrEditor>[0]))) {
    return Response.json({ errors: [{ message: "You are not allowed to perform this action." }] }, { status: 403 });
  }
  const { docs } = await req.payload.find({
    collection: "registrations",
    sort: "-createdAt",
    pagination: false,
    depth: 0,
    overrideAccess: false,
    req,
  });
  const lines = [
    ["क्रमांक (S.No.)", ...COLUMNS.map((c) => c.header)].map((h) => csvCell(h, "")).join(","),
    ...docs.map((doc, i) =>
      [csvCell(String(i + 1), ""), ...COLUMNS.map((c) => csvCell(c.value(doc), c.header))].join(","),
    ),
  ];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  req.payload.logger.info({ msg: "registrations.export", rows: docs.length, user: req.user?.id });
  return new Response("\uFEFF" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

// Entries from the public registration form (website /form, reached by
// QR code). Visitors never call the CMS directly: the website's server
// submits on their behalf with the shared frontend key, so anonymous API
// writes are refused. Personal data — staff can read, only admins edit/delete.
export const Registrations: CollectionConfig = {
  slug: "registrations",
  labels: { singular: "Registration", plural: "Registrations" },
  admin: {
    group: "Forms",
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "occupation", "email", "createdAt"],
    description: "Entries submitted through the registration form on the website (/form).",
    components: { beforeListTable: ["/components/admin/ExportRegistrations#ExportRegistrations"] },
  },
  endpoints: [{ path: "/export", method: "get", handler: exportCsv }],
  defaultSort: "-createdAt",
  access: {
    create: fromFrontendServer,
    read: isAdminOrEditor,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120, label: "नाम (Name)" },
    {
      name: "phone",
      type: "text",
      required: true,
      maxLength: 15,
      label: "दूरभाष (Phone)",
      validate: (v: unknown) =>
        typeof v === "string" && /^\+?\d{10,13}$/.test(v) ? true : "Enter a valid phone number (10–13 digits).",
    },
    { name: "occupation", type: "text", required: true, maxLength: 200, label: "कार्य व्यवसाय (Occupation)" },
    { name: "address", type: "textarea", required: true, maxLength: 500, label: "पता (Address)" },
    { name: "email", type: "email", required: true, label: "ई मेल (Email)" },
  ],
};
