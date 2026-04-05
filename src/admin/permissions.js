import { adminPath } from "./adminPath";

export const ADMIN_MENU_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: adminPath(""), permission: "dashboard" },
      { label: "Analytics", to: adminPath("analytics"), permission: "analytics" },
      { label: "Audit Logs", to: adminPath("audit-logs"), permission: "auditLogs" },
    ],
  },
  {
    title: "Website Data",
    items: [
      { label: "Projects", to: adminPath("projects"), permission: "projects" },
      { label: "Clients", to: adminPath("clients"), permission: "clients" },
      { label: "Services", to: adminPath("services"), permission: "services" },
      { label: "Content", to: adminPath("content"), permission: "content" },
      { label: "Media", to: adminPath("media"), permission: "media" },
      { label: "Leads", to: adminPath("leads"), permission: "leads" },
      { label: "Orders", to: adminPath("orders"), permission: "orders" },
    ],
  },
  {
    title: "Careers",
    items: [
      { label: "Openings", to: adminPath("openings"), permission: "openings" },
      {
        label: "Applications",
        to: adminPath("applications"),
        permission: "applications",
      },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Users", to: adminPath("users"), permission: "users" },
      {
        label: "Portal Control",
        to: adminPath("portal-control"),
        permission: "portalControl",
      },
      {
        label: "Integrations",
        to: adminPath("integrations"),
        permission: "integrations",
      },
      { label: "Settings", to: adminPath("settings"), permission: "settings" },
      { label: "Profile", to: adminPath("profile"), permission: "profile" },
      {
        label: "Change Password",
        to: adminPath("change-password"),
        permission: "profile",
      },
    ],
  },
];

export function hasAdminPermission(user, permissionKey) {
  if (!permissionKey) return true;
  if (!user) return false;

  if (user.role === "superadmin") return true;
  if (user.role === "editor") return true;
  if (user.role === "admin" && permissionKey === "portalControl") return true;
  if (user.role !== "admin") return false;

  return Boolean(user.permissions?.[permissionKey]);
}

export function getAllowedMenuSections(user) {
  return ADMIN_MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      hasAdminPermission(user, item.permission),
    ),
  })).filter((section) => section.items.length);
}

export function getAllowedAdminRoutes(user) {
  return getAllowedMenuSections(user).flatMap((section) => section.items);
}

export function getFirstAllowedAdminRoute(user) {
  const first = getAllowedAdminRoutes(user)[0];
  return first?.to || "";
}
