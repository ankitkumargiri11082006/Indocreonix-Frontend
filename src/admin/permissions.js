export const ADMIN_MENU_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/admin", permission: "dashboard" },
      { label: "Analytics", to: "/admin/analytics", permission: "analytics" },
      { label: "Audit Logs", to: "/admin/audit-logs", permission: "auditLogs" },
    ],
  },
  {
    title: "Website Data",
    items: [
      { label: "Projects", to: "/admin/projects", permission: "projects" },
      { label: "Clients", to: "/admin/clients", permission: "clients" },
      { label: "Services", to: "/admin/services", permission: "services" },
      { label: "Content", to: "/admin/content", permission: "content" },
      { label: "Media", to: "/admin/media", permission: "media" },
      { label: "Leads", to: "/admin/leads", permission: "leads" },
      { label: "Orders", to: "/admin/orders", permission: "orders" },
    ],
  },
  {
    title: "Careers",
    items: [
      { label: "Openings", to: "/admin/openings", permission: "openings" },
      {
        label: "Applications",
        to: "/admin/applications",
        permission: "applications",
      },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Users", to: "/admin/users", permission: "users" },
      {
        label: "Portal Control",
        to: "/admin/portal-control",
        permission: "portalControl",
      },
      {
        label: "Integrations",
        to: "/admin/integrations",
        permission: "integrations",
      },
      { label: "Settings", to: "/admin/settings", permission: "settings" },
      { label: "Profile", to: "/admin/profile", permission: "profile" },
      {
        label: "Change Password",
        to: "/admin/change-password",
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
