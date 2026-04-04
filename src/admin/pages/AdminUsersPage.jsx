import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";

const permissionOptions = [
  { key: "dashboard", label: "Dashboard" },
  { key: "analytics", label: "Analytics" },
  { key: "auditLogs", label: "Audit Logs" },
  { key: "projects", label: "Projects" },
  { key: "clients", label: "Clients" },
  { key: "services", label: "Services" },
  { key: "content", label: "Content" },
  { key: "media", label: "Media" },
  { key: "leads", label: "Leads" },
  { key: "orders", label: "Orders" },
  { key: "openings", label: "Openings" },
  { key: "applications", label: "Applications" },
  { key: "users", label: "Users" },
  { key: "portalControl", label: "Portal Control" },
  { key: "integrations", label: "Integrations" },
  { key: "settings", label: "Settings" },
  { key: "profile", label: "Profile" },
];

const roleOptions = ["admin", "editor", "viewer"];

function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [roleDrafts, setRoleDrafts] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingPermissionKey, setLoadingPermissionKey] = useState("");
  const [loadingAllPermissionsUserId, setLoadingAllPermissionsUserId] =
    useState("");
  const [savingRoleUserId, setSavingRoleUserId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");

  const isSuperadmin = currentUser?.role === "superadmin";

  async function loadUsers() {
    try {
      const result = await apiRequest("/users");
      const nextUsers = result.users || [];
      setUsers(nextUsers);
      setRoleDrafts(
        nextUsers.reduce((accumulator, user) => {
          accumulator[user._id] = user.role;
          return accumulator;
        }, {}),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleStatus(user) {
    if (!isSuperadmin) return;

    try {
      setError("");
      setSuccess("");
      await apiRequest(`/users/${user._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function togglePermission(targetUser, permissionKey) {
    if (!isSuperadmin || targetUser.role !== "admin") return;

    const nextValue = !targetUser.permissions?.[permissionKey];
    const nextPermissions = {
      ...(targetUser.permissions || {}),
      [permissionKey]: nextValue,
    };

    const loadingKey = `${targetUser._id}:${permissionKey}`;

    setLoadingPermissionKey(loadingKey);
    setError("");

    try {
      await apiRequest(`/users/${targetUser._id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions: nextPermissions }),
      });

      setUsers((previous) =>
        previous.map((user) =>
          user._id === targetUser._id
            ? {
                ...user,
                permissions: nextPermissions,
              }
            : user,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPermissionKey("");
    }
  }

  async function toggleAllPermissions(targetUser) {
    if (!isSuperadmin || targetUser.role !== "admin") return;

    const allEnabled = permissionOptions.every((permission) =>
      Boolean(targetUser.permissions?.[permission.key]),
    );
    const nextPermissions = permissionOptions.reduce(
      (accumulator, permission) => {
        accumulator[permission.key] = !allEnabled;
        return accumulator;
      },
      {},
    );

    setLoadingAllPermissionsUserId(targetUser._id);
    setError("");

    try {
      await apiRequest(`/users/${targetUser._id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions: nextPermissions }),
      });

      setUsers((previous) =>
        previous.map((user) =>
          user._id === targetUser._id
            ? {
                ...user,
                permissions: nextPermissions,
              }
            : user,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAllPermissionsUserId("");
    }
  }

  async function saveRole(targetUser) {
    if (!isSuperadmin) return;

    const nextRole = roleDrafts[targetUser._id];
    if (!nextRole || nextRole === targetUser.role) return;

    setSavingRoleUserId(targetUser._id);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/users/${targetUser._id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      await loadUsers();
      setSuccess("Role updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingRoleUserId("");
    }
  }

  async function createUserWithRole(event) {
    event.preventDefault();
    if (!isSuperadmin) return;

    setCreatingUser(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      setCreateForm({ name: "", email: "", password: "", role: "admin" });
      await loadUsers();
      setSuccess("User created and role assigned successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingUser(false);
    }
  }

  async function deleteUserRole(targetUser) {
    if (!isSuperadmin || targetUser._id === currentUser?._id) return;

    const confirmed = window.confirm(
      `Permanently delete ${targetUser.name || targetUser.email}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingUserId(targetUser._id);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/users/${targetUser._id}`, { method: "DELETE" });
      await loadUsers();
      setSuccess("User role account deleted permanently");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUserId("");
    }
  }

  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <article className="admin-card wide">
      <h3>User Management</h3>
      {isSuperadmin ? (
        <p className="admin-muted">
          Superadmin controls: assign roles first, then use{" "}
          <strong>Manage Access</strong> for admin permission toggles. Admins:{" "}
          {adminCount}
        </p>
      ) : null}
      {isSuperadmin ? (
        <section className="admin-user-access-box">
          <div>
            <p className="admin-user-access-title">Superadmin Role Controls</p>
            <p className="admin-user-access-copy">
              Create admin/editor/viewer accounts, assign roles, and permanently
              delete role accounts.
            </p>
          </div>

          <form className="admin-form-grid" onSubmit={createUserWithRole}>
            <label>
              Full name
              <input
                type="text"
                value={createForm.name}
                onChange={(event) =>
                  setCreateForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="Full name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={createForm.email}
                onChange={(event) =>
                  setCreateForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                placeholder="user@indocreonix.com"
                required
              />
            </label>

            <label>
              Temporary password
              <input
                type="password"
                value={createForm.password}
                onChange={(event) =>
                  setCreateForm((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </label>

            <label>
              Role
              <select
                className="admin-select"
                value={createForm.role}
                onChange={(event) =>
                  setCreateForm((previous) => ({
                    ...previous,
                    role: event.target.value,
                  }))
                }
              >
                {roleOptions.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
                  </option>
                ))}
              </select>
            </label>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creatingUser}
              >
                {creatingUser ? "Creating..." : "Create Role Account"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}
      <div className="admin-user-cards">
        {users.map((user) => {
          const canEditUser = isSuperadmin && user._id !== currentUser?._id;
          const canManagePermissions = isSuperadmin && user.role === "admin";
          const allEnabled = permissionOptions.every((permission) =>
            Boolean(user.permissions?.[permission.key]),
          );

          return (
            <section className="admin-user-card" key={user._id}>
              <header className="admin-user-head">
                <div className="admin-user-avatar">
                  <img
                    src={user.avatarUrl || "/logo.png"}
                    alt={`${user.name || "User"} profile`}
                    className="admin-user-avatar-img"
                    onError={(event) => {
                      if (event.currentTarget.dataset.fallbackApplied) return;
                      event.currentTarget.dataset.fallbackApplied = "true";
                      event.currentTarget.src = "/logo.png";
                    }}
                  />
                </div>
                <div className="admin-user-meta">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <span className={`admin-user-role-badge ${user.role}`}>
                  {user.role}
                </span>
              </header>

              <div className="admin-user-row">
                <p className="admin-user-label">Role</p>
                <div className="admin-action-group">
                  <select
                    className="admin-select"
                    value={roleDrafts[user._id] || user.role}
                    onChange={(event) =>
                      setRoleDrafts((previous) => ({
                        ...previous,
                        [user._id]: event.target.value,
                      }))
                    }
                    disabled={!canEditUser || savingRoleUserId === user._id}
                  >
                    <option value="superadmin">superadmin</option>
                    {roleOptions.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                  {isSuperadmin ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => saveRole(user)}
                      disabled={
                        !canEditUser ||
                        savingRoleUserId === user._id ||
                        (roleDrafts[user._id] || user.role) === user.role
                      }
                    >
                      {savingRoleUserId === user._id
                        ? "Saving..."
                        : "Save Role"}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="admin-user-row admin-user-row-status">
                <p className="admin-user-label">Status</p>
                <div className="admin-action-group">
                  <span
                    className={`admin-user-status ${user.isActive ? "active" : "disabled"}`}
                  >
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                  {isSuperadmin ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => toggleStatus(user)}
                      disabled={!canEditUser}
                    >
                      {user.isActive ? "Disable" : "Enable"}
                    </button>
                  ) : null}
                </div>
              </div>

              {isSuperadmin ? (
                <div className="admin-user-row">
                  <p className="admin-user-label">Superadmin Only</p>
                  <div className="admin-action-group">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteUserRole(user)}
                      disabled={!canEditUser || deletingUserId === user._id}
                    >
                      {deletingUserId === user._id
                        ? "Deleting..."
                        : "Delete Permanently"}
                    </button>
                  </div>
                </div>
              ) : null}

              {canManagePermissions ? (
                <div className="admin-user-access-box">
                  <div className="admin-user-access-top">
                    <div>
                      <p className="admin-user-access-title">All Access</p>
                      <p className="admin-user-access-copy">
                        Enable or remove all module permissions in one action.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => toggleAllPermissions(user)}
                      disabled={loadingAllPermissionsUserId === user._id}
                    >
                      {loadingAllPermissionsUserId === user._id
                        ? "Saving..."
                        : allEnabled
                          ? "All Off"
                          : "All On"}
                    </button>
                  </div>

                  <div className="admin-user-permissions-grid">
                    {permissionOptions.map((permission) => {
                      const controlId = `${user._id}-${permission.key}`;
                      const loadingKey = `${user._id}:${permission.key}`;

                      return (
                        <label
                          htmlFor={controlId}
                          key={permission.key}
                          className="admin-permission-toggle"
                        >
                          <span>{permission.label}</span>
                          <input
                            id={controlId}
                            type="checkbox"
                            checked={Boolean(
                              user.permissions?.[permission.key],
                            )}
                            disabled={
                              loadingPermissionKey === loadingKey ||
                              loadingAllPermissionsUserId === user._id
                            }
                            onChange={() =>
                              togglePermission(user, permission.key)
                            }
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="admin-user-access-box muted">
                  <p className="admin-user-access-title">Permissions</p>
                  <p className="admin-user-access-copy">
                    Module-level access controls appear when role is set to
                    admin.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}

export default AdminUsersPage;
