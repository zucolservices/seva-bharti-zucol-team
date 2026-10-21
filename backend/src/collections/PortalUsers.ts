import { APIError, type CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from "@/access";
import {
  clientIp,
  enforcePasswordPolicy,
  genericLoginError,
  hardenedAuth,
  logLoginSuccess,
  revokeOtherSessions,
} from "./shared/auth";

// Logins for the Pathology and Publication portals on the public website.
// A separate auth collection: portal users have no staff role, can never open
// the CMS admin (`access.admin` is false and `admin.user` stays `users`) and
// pass none of the content-editing checks in `@/access`.
// Accounts are created by a staff admin (Admin → Portals → Portal Users);
// there is no public sign-up.
export const PortalUsers: CollectionConfig = {
  slug: "portal-users",
  labels: { singular: "Portal User", plural: "Portal Users" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "portal"],
    group: "Portals",
    enableRichTextLink: false,
    enableRichTextRelationship: false,
  },
  auth: hardenedAuth,
  access: {
    create: isAdmin,
    read: isAdminOrSelf("portal-users"),
    // Only staff admins change portal accounts (email, password, portal);
    // portal users have no self-service screen.
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
    // Portal accounts never get into the CMS admin panel.
    admin: () => false,
  },
  fields: [
    { name: "name", type: "text", maxLength: 120 },
    {
      name: "portal",
      type: "select",
      required: true,
      options: [
        { label: "Pathology", value: "pathology" },
        { label: "Publication", value: "publication" },
      ],
      saveToJWT: true,
      admin: { description: "Which portal this account can sign in to." },
      // Portal users cannot move themselves to another portal.
      access: { create: isAdminFieldLevel, update: isAdminFieldLevel },
    },
  ],
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        // No public sign-up and no first-register for portal accounts, ever
        // (`/api/portal-users/first-register` would otherwise be open while the
        // collection is empty). Admins create them through the admin panel.
        if (operation === "create" && req.payloadAPI !== "local" && !isAdmin({ req } as Parameters<typeof isAdmin>[0])) {
          req.payload.logger.warn({ msg: "auth.first_register.blocked", collection: "portal-users", ip: clientIp(req) });
          throw new APIError("Account creation is disabled.", 403);
        }
        // Payload's reset e-mail links to the admin panel, which portal users
        // cannot use — admins reset portal passwords instead.
        if (operation === "forgotPassword" && req.payloadAPI !== "local") {
          throw new APIError("Please contact Sewa Bharti to reset your password.", 403);
        }
      },
      enforcePasswordPolicy,
    ],
    afterChange: [revokeOtherSessions("portal-users")],
    afterLogin: [logLoginSuccess("portal-users")],
    afterError: [genericLoginError("portal-users")],
  },
};
