import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiClient";
import { getAllowedAdminRoutes, getAllowedMenuSections } from "../permissions";
import SEO from "../../components/SEO";

const routeTitleMap = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/projects": "Projects",
  "/admin/clients": "Clients",
  "/admin/services": "Services",
  "/admin/orders": "Orders",
  "/admin/openings": "Openings",
  "/admin/applications": "Applications",
  "/admin/audit-logs": "Audit Logs",
  "/admin/users": "Users",
  "/admin/portal-control": "Portal Control",
  "/admin/leads": "Leads",
  "/admin/content": "Content",
  "/admin/media": "Media",
  "/admin/integrations": "Integrations",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
  "/admin/change-password": "Change Password",
};

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState({
    leads: 0,
    applications: 0,
    orders: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarPinned, setIsDesktopSidebarPinned] = useState(false);
  const [isDesktopSidebarHoverOpen, setIsDesktopSidebarHoverOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false,
  );
  const [menuFilter, setMenuFilter] = useState("");
  const menuSections = getAllowedMenuSections(user);
  const allRoutes = getAllowedAdminRoutes(user);
  const pageTitle = routeTitleMap[location.pathname] || "Admin Panel";
  const topbarAvatar = user?.avatarUrl || "/logo.png";
  const activeSection =
    menuSections.find((section) =>
      section.items.some((item) =>
        item.to === "/admin"
          ? location.pathname === "/admin"
          : location.pathname.startsWith(item.to),
      ),
    ) || menuSections[0];
  const jumpValue = allRoutes.some((route) => route.to === location.pathname)
    ? location.pathname
    : allRoutes[0]?.to || "";
  const isSidebarOpen = isMobileView
    ? isMobileMenuOpen
    : isDesktopSidebarPinned || isDesktopSidebarHoverOpen;

  const filteredSections = useMemo(() => {
    const query = menuFilter.trim().toLowerCase();
    if (!query) return menuSections;

    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [menuFilter, menuSections]);

  const visibleIndicators = useMemo(
    () => ({
      leads: location.pathname.startsWith("/admin/leads")
        ? 0
        : Number(indicators.leads || 0),
      applications: location.pathname.startsWith("/admin/applications")
        ? 0
        : Number(indicators.applications || 0),
      orders: location.pathname.startsWith("/admin/orders")
        ? 0
        : Number(indicators.orders || 0),
    }),
    [indicators, location.pathname],
  );

  useEffect(() => {
    if (!user || user.role === "viewer") return undefined;

    let isCancelled = false;
    let intervalId = null;

    const loadIndicators = () => {
      apiRequest("/dashboard/indicators")
        .then((result) => {
          if (isCancelled) return;
          setIndicators({
            leads: Number(result?.sections?.leads || 0),
            applications: Number(result?.sections?.applications || 0),
            orders: Number(result?.sections?.orders || 0),
          });
        })
        .catch((error) => {
          if (isCancelled) return;

          const unauthorized =
            Number(error?.status) === 401 ||
            /unauthorized|invalid token/i.test(String(error?.message || ""));

          if (unauthorized) {
            if (intervalId) {
              window.clearInterval(intervalId);
              intervalId = null;
            }
            return;
          }

          setIndicators({ leads: 0, applications: 0, orders: 0 });
        });
    };

    loadIndicators();
    intervalId = window.setInterval(loadIndicators, 20000);

    return () => {
      isCancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [user, location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const syncMode = (event) => {
      const matches = Boolean(event?.matches ?? mediaQuery.matches);
      setIsMobileView(matches);
      if (matches) {
        setIsDesktopSidebarHoverOpen(false);
        setIsDesktopSidebarPinned(false);
      } else {
        setIsMobileMenuOpen(false);
      }
    };

    syncMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMode);
      return () => mediaQuery.removeEventListener("change", syncMode);
    }

    mediaQuery.addListener(syncMode);
    return () => mediaQuery.removeListener(syncMode);
  }, []);

  useEffect(() => {
    if (!isMobileView || !isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen, isMobileView]);

  function getBadgeCount(routePath) {
    if (routePath === "/admin/leads") return visibleIndicators.leads;
    if (routePath === "/admin/applications")
      return visibleIndicators.applications;
    if (routePath === "/admin/orders") return visibleIndicators.orders;
    return 0;
  }

  function handleMobileMenuToggle() {
    if (isMobileView) {
      setIsMobileMenuOpen((previous) => !previous);
      return;
    }

    setIsDesktopSidebarPinned((previous) => {
      const next = !previous;
      setIsDesktopSidebarHoverOpen(next);
      return next;
    });
  }

  function handleMobileMenuClose() {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
      return;
    }

    setIsDesktopSidebarPinned(false);
    setIsDesktopSidebarHoverOpen(false);
  }

  return (
    <div
      className={`admin-shell${
        !isMobileView
          ? isSidebarOpen
            ? " desktop-sidebar-open"
            : " desktop-sidebar-collapsed"
          : ""
      }`}
    >
      <SEO
        title={pageTitle}
        description="Indocreonix Admin Panel"
        noindex={true}
      />

      {!isMobileView ? (
        <button
          type="button"
          className="admin-sidebar-edge-trigger"
          onMouseEnter={() => setIsDesktopSidebarHoverOpen(true)}
          onFocus={() => setIsDesktopSidebarHoverOpen(true)}
          aria-label="Reveal admin menu"
        />
      ) : null}

      <aside
        className={`admin-sidebar${isMobileMenuOpen ? " mobile-open" : ""}${
          !isMobileView && isSidebarOpen ? " desktop-open" : ""
        }`}
        onMouseEnter={() => {
          if (!isMobileView) setIsDesktopSidebarHoverOpen(true);
        }}
        onMouseLeave={() => {
          if (!isMobileView && !isDesktopSidebarPinned) {
            setIsDesktopSidebarHoverOpen(false);
          }
        }}
      >
        <div className="admin-brand">
          <img src="/logo.png" alt="Indocreonix" />
          <div>
            <p className="admin-brand-title">Indocreonix</p>
            <p className="admin-brand-sub">Admin Panel</p>
          </div>
        </div>

        <div className="admin-sidebar-tools">
          <input
            className="admin-sidebar-search"
            type="search"
            placeholder="Search menu"
            value={menuFilter}
            onChange={(event) => setMenuFilter(event.target.value)}
            aria-label="Search admin menu"
          />
        </div>

        <nav className="admin-menu">
          {filteredSections.length ? (
            filteredSections.map((section) => (
              <div className="admin-menu-section" key={section.title}>
                <p className="admin-menu-section-title">{section.title}</p>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      isActive ? "admin-menu-link active" : "admin-menu-link"
                    }
                    onClick={handleMobileMenuClose}
                  >
                    <span className="admin-menu-link-content">
                      <span>{item.label}</span>
                      {getBadgeCount(item.to) > 0 ? (
                        <span className="admin-menu-badge">
                          {getBadgeCount(item.to)}
                        </span>
                      ) : null}
                    </span>
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            <p className="admin-muted">
              No matching modules found.
            </p>
          )}
        </nav>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={() => {
            handleMobileMenuClose();
            logout();
          }}
        >
          Logout
        </button>
      </aside>

      {isMobileView && isMobileMenuOpen ? (
        <button
          type="button"
          className="admin-mobile-overlay"
          onClick={handleMobileMenuClose}
          aria-label="Close menu"
        />
      ) : null}

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title-area">
            <button
              type="button"
              className={`admin-mobile-menu-btn${isSidebarOpen ? " open" : ""}`}
              onClick={handleMobileMenuToggle}
              onMouseEnter={() => {
                if (!isMobileView) setIsDesktopSidebarHoverOpen(true);
              }}
              onFocus={() => {
                if (!isMobileView) setIsDesktopSidebarHoverOpen(true);
              }}
              aria-label={
                isSidebarOpen ? "Close admin menu" : "Open admin menu"
              }
              aria-expanded={isSidebarOpen}
            >
              <span />
              <span />
              <span />
            </button>

            <div className="admin-topbar-title-wrap">
              <p className="admin-topbar-label">Admin Workspace</p>
              <h1>{pageTitle}</h1>
            </div>
          </div>
          <div className="admin-topbar-right">
            <div
              className="admin-topbar-quick-links"
              aria-label="Quick section navigation"
            >
              {activeSection.items.slice(0, 4).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="admin-topbar-quick-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {allRoutes.length ? (
              <label className="admin-topbar-jump-wrap">
                <span>Quick Jump</span>
                <select
                  className="admin-topbar-jump"
                  value={jumpValue}
                  onChange={(event) => navigate(event.target.value)}
                >
                  {allRoutes.map((item) => (
                    <option key={item.to} value={item.to}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">
                <img
                  src={topbarAvatar}
                  alt="Admin avatar"
                  className="admin-topbar-avatar-img"
                  onError={(event) => {
                    if (event.currentTarget.dataset.fallbackApplied) return;
                    event.currentTarget.dataset.fallbackApplied = "true";
                    event.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <div>
                <p className="admin-topbar-user-name">
                  {user?.name || "Admin User"}
                </p>
                <p className="admin-topbar-user-role">
                  {user?.role || "viewer"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default AdminLayout;
