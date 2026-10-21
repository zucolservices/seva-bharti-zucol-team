import { APIError, type CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel, isAdminOrSelf, isStaff } from "@/access";
import {
  clientIp,
  enforcePasswordPolicy,
  genericLoginError,
  hardenedAuth,
  logLoginSuccess,
  revokeOtherSessions,
} from "./shared/auth";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "roles"],
    group: "Admin",
    // Staff accounts must never be linkable from rich text.
    enableRichTextLink: false,
    enableRichTextRelationship: false,
  },
  // 15-min sessions, server-side sessions, lockout, HttpOnly Strict cookie.
  auth: hardenedAuth,
  access: {
    // No public sign-up. Only admins create accounts. The one-time
    // "create first user" route is disabled unless ALLOW_FIRST_REGISTER=true
    // (see beforeOperation) — production creates the first admin via the seed.
    create: isAdmin,
    read: isAdminOrSelf("users"),
    update: isAdminOrSelf("users"),
    delete: isAdmin,
    unlock: isAdmin,
    // Only staff (users collection, admin/editor role) may open /admin.
    admin: isStaff,
  },
  fields: [
    { name: "name", type: "text", maxLength: 120 },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      saveToJWT: true,
      // Editors cannot promote themselves.
      access: { create: isAdminFieldLevel, update: isAdminFieldLevel },
    },
  ],
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        // Block anonymous account creation over HTTP (first-register takeover).
        if (
          operation === "create" &&
          !req.user &&
          req.payloadAPI !== "local" &&
          process.env.ALLOW_FIRST_REGISTER !== "true"
        ) {
          req.payload.logger.warn({ msg: "auth.first_register.blocked", collection: "users", ip: clientIp(req) });
          throw new APIError("Account creation is disabled.", 403);
        }
      },
      enforcePasswordPolicy,
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account is always an admin, so someone can manage users.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", req, overrideAccess: true });
          if (totalDocs === 0) data.roles = ["admin"];
        }
        return data;
      },
    ],
    afterChange: [revokeOtherSessions("users")],
    afterLogin: [logLoginSuccess("users")],
    afterError: [genericLoginError("users")],
  },
};
