import type { Access, FieldAccess, PayloadRequest } from "payload";

// Role-based access helpers. Every collection/global MUST use these —
// never write `() => true` for anything other than public reads.
//   admin  — full control, including user management
//   editor — create/edit/publish content and media; cannot manage users
//
// Two auth collections exist: `users` (CMS staff) and `portal-users`
// (Pathology / Publication portal logins). Staff roles only ever count for a
// `users`-collection account, so a portal user can never pass a staff check
// even if a `roles` value somehow ended up on its record.

type Role = "admin" | "editor";
export type AuthCollection = "users" | "portal-users";

const hasRole = (req: PayloadRequest, ...roles: Role[]) => {
  const user = req.user as { collection?: string; roles?: Role[] } | null | undefined;
  if (user?.collection !== "users") return false;
  return Boolean(user.roles?.some((r) => roles.includes(r)));
};

export const isAdmin: Access = ({ req }) => hasRole(req, "admin");

export const isAdminOrEditor: Access = ({ req }) =>
  hasRole(req, "admin", "editor");

// Who may open the CMS admin panel: staff (users collection) with a role.
export const isStaff = ({ req }: { req: PayloadRequest }) => hasRole(req, "admin", "editor");

export const isAdminFieldLevel: FieldAccess = ({ req }) =>
  hasRole(req, "admin");

// Admins see/manage every account; everyone else may only read/update their
// own record. IDs are per-collection (staff user #3 ≠ portal user #3), so the
// "self" match also requires the logged-in user to belong to `collection`.
export const isAdminOrSelf =
  (collection: AuthCollection): Access =>
  ({ req }) => {
    if (hasRole(req, "admin")) return true;
    if (req.user && req.user.collection === collection) return { id: { equals: req.user.id } };
    return false;
  };

// Public visitors only ever see published documents; signed-in staff see drafts.
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(req, "admin", "editor")) return true;
  return { _status: { equals: "published" } };
};

export const anyone: Access = () => true;
