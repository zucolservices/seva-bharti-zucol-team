import type { CollectionConfig } from "payload";
import { fromFrontendServer, isAdmin, isAdminOrEditor } from "@/access";

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
  },
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
