import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient";

const careerStatusOptions = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];
const projectStatusOptions = [
  "new",
  "qualified",
  "proposal_shared",
  "in_discussion",
  "won",
  "lost",
];
const roleTypeOptions = ["internship", "job"];
const projectCategoryOptions = [
  "website",
  "web-app",
  "android-app",
  "ios-app",
  "software",
  "other",
];

function AdminPortalControlPage() {
  const [portalUsers, setPortalUsers] = useState([]);
  const [careerItems, setCareerItems] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [editPanel, setEditPanel] = useState({
    open: false,
    type: "",
    title: "",
    itemId: "",
    userId: "",
    data: {},
    submitting: false,
  });

  function formatDate(value) {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString();
  }

  function getInitials(value) {
    const text = String(value || "").trim();
    if (!text) return "U";
    const parts = text.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      const [usersResult, careersResult, projectsResult] = await Promise.all([
        apiRequest("/portal/admin/users"),
        apiRequest("/portal/admin/career-applications"),
        apiRequest("/portal/admin/projects"),
      ]);

      setPortalUsers(usersResult.items || []);
      setCareerItems(careersResult.items || []);
      setProjectItems(projectsResult.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function updatePortalUser(userId, payload) {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/portal/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await loadAll();
      setSuccess("Portal user updated successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateCareerItem(itemId, payload) {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/portal/admin/career-applications/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await loadAll();
      setSuccess("Career application updated successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateProjectItem(itemId, payload) {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/portal/admin/projects/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await loadAll();
      setSuccess("Project request updated successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  async function openUserDetails(userId) {
    setError("");
    setSelectedDetails(null);
    setDetailsLoading(true);

    try {
      const result = await apiRequest(`/portal/admin/users/${userId}/details`);
      setSelectedDetails(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  async function refreshSelectedDetails(userId) {
    if (!userId) return;

    try {
      const result = await apiRequest(`/portal/admin/users/${userId}/details`);
      setSelectedDetails(result);
    } catch {
      // Keep current details if silent refresh fails.
    }
  }

  function openUserEditForm(user) {
    setEditPanel({
      open: true,
      type: "user",
      title: "Edit Portal User",
      itemId: user.id,
      userId: user.id,
      data: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        organization: user.organization || "",
        roleTitle: user.roleTitle || "",
        location: user.location || "",
        bio: user.bio || "",
      },
      submitting: false,
    });
  }

  function openCareerEditForm(item) {
    const relatedUser = portalUsers.find(
      (user) =>
        String(user.email || "").toLowerCase() ===
        String(item.email || "").toLowerCase(),
    );
    setEditPanel({
      open: true,
      type: "career",
      title: "Edit Career Application",
      itemId: item._id,
      userId: relatedUser?.id || selectedDetails?.user?.id || "",
      data: {
        fullName: item.fullName || "",
        email: item.email || "",
        phone: item.phone || "",
        city: item.city || "",
        qualification: item.qualification || "",
        skills: item.skills || "",
        experience: item.experience || "",
        portfolio: item.portfolio || "",
        message: item.message || "",
        roleType: item.roleType || "job",
        status: item.status || "new",
        adminNotes: item.adminNotes || "",
      },
      submitting: false,
    });
  }

  function openProjectEditForm(item) {
    const relatedUser = portalUsers.find(
      (user) =>
        String(user.email || "").toLowerCase() ===
        String(item.email || "").toLowerCase(),
    );
    setEditPanel({
      open: true,
      type: "project",
      title: "Edit Project Request",
      itemId: item._id,
      userId: relatedUser?.id || selectedDetails?.user?.id || "",
      data: {
        fullName: item.fullName || "",
        email: item.email || "",
        phone: item.phone || "",
        company: item.company || "",
        targetBudget: item.targetBudget || "",
        targetTimeline: item.targetTimeline || "",
        projectCategory: item.projectCategory || "website",
        projectSubtype: item.projectSubtype || "",
        projectSummary: item.projectSummary || "",
        featureRequirements: item.featureRequirements || "",
        status: item.status || "new",
        adminNotes: item.adminNotes || "",
      },
      submitting: false,
    });
  }

  function closeEditPanel() {
    setEditPanel({
      open: false,
      type: "",
      title: "",
      itemId: "",
      userId: "",
      data: {},
      submitting: false,
    });
  }

  function onEditFieldChange(event) {
    const { name, value } = event.target;
    setEditPanel((previous) => ({
      ...previous,
      data: {
        ...previous.data,
        [name]: value,
      },
    }));
  }

  async function submitEditPanel(event) {
    event.preventDefault();
    if (!editPanel.type || !editPanel.itemId) return;

    setError("");
    setSuccess("");
    setEditPanel((previous) => ({ ...previous, submitting: true }));

    try {
      if (editPanel.type === "user") {
        await apiRequest(`/portal/admin/users/${editPanel.itemId}`, {
          method: "PATCH",
          body: JSON.stringify(editPanel.data),
        });
        setSuccess("Portal user profile updated successfully");
      }

      if (editPanel.type === "career") {
        await apiRequest(
          `/portal/admin/career-applications/${editPanel.itemId}`,
          {
            method: "PATCH",
            body: JSON.stringify(editPanel.data),
          },
        );
        setSuccess("Career application details updated successfully");
      }

      if (editPanel.type === "project") {
        await apiRequest(`/portal/admin/projects/${editPanel.itemId}`, {
          method: "PATCH",
          body: JSON.stringify(editPanel.data),
        });
        setSuccess("Project request details updated successfully");
      }

      const relatedUserId = editPanel.userId;
      closeEditPanel();
      await loadAll();
      if (selectedDetails?.user?.id || relatedUserId) {
        await refreshSelectedDetails(
          selectedDetails?.user?.id || relatedUserId,
        );
      }
    } catch (err) {
      setError(err.message);
      setEditPanel((previous) => ({ ...previous, submitting: false }));
    }
  }

  async function deletePortalUser(user) {
    const confirmed = window.confirm(
      `Delete portal user ${user.name || user.email}? This will remove the portal account and all related career/project records.`,
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingUserId(user.id);

    try {
      const result = await apiRequest(`/portal/admin/users/${user.id}`, {
        method: "DELETE",
      });
      await loadAll();

      if (selectedDetails?.user?.id === user.id) {
        setSelectedDetails(null);
      }

      const deletedCareer = result?.deleted?.careerApplications ?? 0;
      const deletedProjects = result?.deleted?.projectRequests ?? 0;
      setSuccess(
        `Portal user deleted. Removed ${deletedCareer} career applications and ${deletedProjects} project requests.`,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUserId("");
    }
  }

  return (
    <article className="admin-card wide">
      <h3>Portal Control Center</h3>
      <p>
        Manage career and project portal users, control access, and update
        progress for candidates and client projects.
      </p>

      {loading ? <p className="admin-muted">Loading portal data...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <section className="admin-page-stack">
        <article className="admin-card wide">
          <h3>Portal Users</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Career Access</th>
                  <th>Project Access</th>
                  <th>Email Verified</th>
                  <th>Account Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portalUsers.length ? (
                  portalUsers.map((user) => {
                    const careerChecked = Boolean(user.access?.career);
                    const projectChecked = Boolean(user.access?.project);
                    const activeChecked = Boolean(user.isActive);

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-portal-user-cell">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.name || "Portal user"}
                                className="admin-portal-user-avatar"
                              />
                            ) : (
                              <span
                                className="admin-portal-user-avatar admin-portal-user-avatar-fallback"
                                aria-hidden="true"
                              >
                                {getInitials(user.name || user.email)}
                              </span>
                            )}
                            <span className="admin-portal-user-name">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <input
                            type="checkbox"
                            defaultChecked={careerChecked}
                            onChange={(event) => {
                              updatePortalUser(user.id, {
                                access: {
                                  career: event.target.checked,
                                  project: projectChecked,
                                },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            defaultChecked={projectChecked}
                            onChange={(event) => {
                              updatePortalUser(user.id, {
                                access: {
                                  career: careerChecked,
                                  project: event.target.checked,
                                },
                              });
                            }}
                          />
                        </td>
                        <td>{user.isEmailVerified ? "Yes" : "No"}</td>
                        <td>
                          <input
                            type="checkbox"
                            defaultChecked={activeChecked}
                            onChange={(event) => {
                              updatePortalUser(user.id, {
                                isActive: event.target.checked,
                              });
                            }}
                          />
                        </td>
                        <td>
                          <div className="admin-action-group">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => openUserDetails(user.id)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary admin-btn-glow"
                              onClick={() => openUserEditForm(user)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary admin-btn-danger"
                              onClick={() => deletePortalUser(user)}
                              disabled={deletingUserId === user.id}
                            >
                              {deletingUserId === user.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={loadAll}
                            >
                              Refresh
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>No portal users found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card wide">
          <h3>Career Application Progress</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Role Type</th>
                  <th>Status</th>
                  <th>Admin Notes</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {careerItems.length ? (
                  careerItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.fullName}</td>
                      <td>{item.email}</td>
                      <td>{item.opportunity?.title || item.roleType}</td>
                      <td>
                        <select
                          className="admin-select"
                          defaultValue={item.status}
                          onChange={(event) =>
                            updateCareerItem(item._id, {
                              status: event.target.value,
                            })
                          }
                        >
                          {careerStatusOptions.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item.adminNotes || "-"}</td>
                      <td>
                        <div className="admin-action-group">
                          <button
                            type="button"
                            className="btn btn-secondary admin-btn-glow"
                            onClick={() =>
                              updateCareerItem(item._id, {
                                adminNotes: item.adminNotes || "",
                              })
                            }
                          >
                            Save Notes
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openCareerEditForm(item)}
                          >
                            Edit Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No career applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card wide">
          <h3>Project Progress Control</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Timeline</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {projectItems.length ? (
                  projectItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.fullName}</td>
                      <td>{item.email}</td>
                      <td>
                        {item.projectSummary ||
                          `${item.projectCategory}/${item.projectSubtype || "-"}`}
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          defaultValue={item.status}
                          onChange={(event) =>
                            updateProjectItem(item._id, {
                              status: event.target.value,
                            })
                          }
                        >
                          {projectStatusOptions.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item.targetTimeline || "-"}</td>
                      <td>
                        <div className="admin-action-group">
                          <button
                            type="button"
                            className="btn btn-secondary admin-btn-glow"
                            onClick={() =>
                              updateProjectItem(item._id, {
                                adminNotes: item.adminNotes || "",
                              })
                            }
                          >
                            Save Notes
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openProjectEditForm(item)}
                          >
                            Edit Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No project requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {detailsLoading ? (
        <p className="admin-muted">Loading detailed user dashboard...</p>
      ) : null}

      {selectedDetails ? (
        <div
          className="admin-portal-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Portal user details dashboard"
        >
          <section className="admin-card wide admin-portal-details-modal admin-portal-details-modal-sheet">
            <div className="admin-portal-details-head">
              <div>
                <h3>Portal User Dashboard</h3>
                <p className="admin-user-access-copy">
                  Dedicated profile and activity view for this portal user.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedDetails(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-portal-details-layout">
              <article className="admin-user-access-box admin-portal-profile-panel">
                <p className="admin-user-access-title">Profile</p>
                <div className="admin-portal-profile-hero">
                  {selectedDetails.user?.avatarUrl ? (
                    <img
                      src={selectedDetails.user.avatarUrl}
                      alt={selectedDetails.user?.name || "Portal user"}
                      className="admin-portal-profile-avatar"
                    />
                  ) : (
                    <span
                      className="admin-portal-profile-avatar admin-portal-user-avatar-fallback"
                      aria-hidden="true"
                    >
                      {getInitials(
                        selectedDetails.user?.name ||
                          selectedDetails.user?.email,
                      )}
                    </span>
                  )}
                  <div className="admin-portal-profile-copy">
                    <h4>{selectedDetails.user?.name || "N/A"}</h4>
                    <p>{selectedDetails.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="admin-portal-profile-meta">
                  <p>
                    <span>Name</span>
                    <strong>{selectedDetails.user?.name || "N/A"}</strong>
                  </p>
                  <p>
                    <span>Email</span>
                    <strong>{selectedDetails.user?.email || "N/A"}</strong>
                  </p>
                  <p>
                    <span>Phone</span>
                    <strong>{selectedDetails.user?.phone || "N/A"}</strong>
                  </p>
                  <p>
                    <span>Organization</span>
                    <strong>
                      {selectedDetails.user?.organization || "N/A"}
                    </strong>
                  </p>
                  <p>
                    <span>Role</span>
                    <strong>{selectedDetails.user?.roleTitle || "N/A"}</strong>
                  </p>
                  <p>
                    <span>Location</span>
                    <strong>{selectedDetails.user?.location || "N/A"}</strong>
                  </p>
                  <p>
                    <span>Bio</span>
                    <strong>{selectedDetails.user?.bio || "N/A"}</strong>
                  </p>
                </div>
                <div
                  className="admin-portal-access-chips"
                  aria-label="Access status"
                >
                  <span
                    className={
                      selectedDetails.user?.access?.career
                        ? "admin-user-status enabled"
                        : "admin-user-status disabled"
                    }
                  >
                    Career{" "}
                    {selectedDetails.user?.access?.career
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                  <span
                    className={
                      selectedDetails.user?.access?.project
                        ? "admin-user-status enabled"
                        : "admin-user-status disabled"
                    }
                  >
                    Project{" "}
                    {selectedDetails.user?.access?.project
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <div className="admin-portal-profile-meta admin-portal-profile-meta-foot">
                  <p>
                    <span>Created</span>
                    <strong>
                      {formatDate(selectedDetails.user?.createdAt)}
                    </strong>
                  </p>
                  <p>
                    <span>Last Login</span>
                    <strong>
                      {formatDate(selectedDetails.user?.lastLoginAt)}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary admin-btn-glow"
                  onClick={() => openUserEditForm(selectedDetails.user)}
                >
                  Edit Profile Details
                </button>
              </article>

              <div className="admin-portal-tracks">
                <article className="admin-user-access-box">
                  <p className="admin-user-access-title">
                    Career Applications (
                    {selectedDetails.careerApplications?.length || 0})
                  </p>
                  {(selectedDetails.careerApplications || []).length ? (
                    <div className="admin-portal-track-list">
                      {selectedDetails.careerApplications.map((item) => (
                        <div key={item._id} className="admin-portal-track-card">
                          <div className="admin-portal-track-head">
                            <h4>
                              {item.opportunity?.title ||
                                item.roleType ||
                                "N/A"}
                            </h4>
                            <span className="admin-user-status enabled">
                              {item.status || "N/A"}
                            </span>
                          </div>
                          <p className="admin-portal-track-meta">
                            <strong>Applied:</strong>{" "}
                            {formatDate(item.createdAt)}
                          </p>
                          <p className="admin-portal-track-meta">
                            <strong>Notes:</strong> {item.adminNotes || "-"}
                          </p>
                          <div className="admin-action-group end">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => openCareerEditForm(item)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-muted">No career applications found.</p>
                  )}
                </article>

                <article className="admin-user-access-box">
                  <p className="admin-user-access-title">
                    Project Requests (
                    {selectedDetails.projectRequests?.length || 0})
                  </p>
                  {(selectedDetails.projectRequests || []).length ? (
                    <div className="admin-portal-track-list">
                      {selectedDetails.projectRequests.map((item) => (
                        <div key={item._id} className="admin-portal-track-card">
                          <div className="admin-portal-track-head">
                            <h4>
                              {item.projectSummary ||
                                `${item.projectCategory}/${item.projectSubtype || "-"}`}
                            </h4>
                            <span className="admin-user-status enabled">
                              {item.status || "N/A"}
                            </span>
                          </div>
                          <p className="admin-portal-track-meta">
                            <strong>Timeline:</strong>{" "}
                            {item.targetTimeline || "-"}
                          </p>
                          <p className="admin-portal-track-meta">
                            <strong>Notes:</strong> {item.adminNotes || "-"}
                          </p>
                          <div className="admin-action-group end">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => openProjectEditForm(item)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-muted">No project requests found.</p>
                  )}
                </article>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {editPanel.open ? (
        <div
          className="admin-portal-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Edit portal details form"
        >
          <section className="admin-card wide admin-portal-edit-modal">
            <div className="admin-action-group end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeEditPanel}
              >
                Close
              </button>
            </div>

            <h3>{editPanel.title}</h3>
            <form className="admin-portal-edit-form" onSubmit={submitEditPanel}>
              {editPanel.type === "user" ? (
                <div className="admin-portal-edit-grid">
                  <label>
                    Full Name
                    <input
                      name="name"
                      value={editPanel.data.name || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      value={editPanel.data.email || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      name="phone"
                      value={editPanel.data.phone || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Organization
                    <input
                      name="organization"
                      value={editPanel.data.organization || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Role Title
                    <input
                      name="roleTitle"
                      value={editPanel.data.roleTitle || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Location
                    <input
                      name="location"
                      value={editPanel.data.location || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label className="full-width">
                    Bio
                    <textarea
                      name="bio"
                      rows={3}
                      value={editPanel.data.bio || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                </div>
              ) : null}

              {editPanel.type === "career" ? (
                <div className="admin-portal-edit-grid">
                  <label>
                    Full Name
                    <input
                      name="fullName"
                      value={editPanel.data.fullName || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      value={editPanel.data.email || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      name="phone"
                      value={editPanel.data.phone || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    City
                    <input
                      name="city"
                      value={editPanel.data.city || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Qualification
                    <input
                      name="qualification"
                      value={editPanel.data.qualification || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Skills
                    <input
                      name="skills"
                      value={editPanel.data.skills || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Experience
                    <input
                      name="experience"
                      value={editPanel.data.experience || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Portfolio
                    <input
                      name="portfolio"
                      value={editPanel.data.portfolio || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Role Type
                    <select
                      className="admin-select"
                      name="roleType"
                      value={editPanel.data.roleType || "job"}
                      onChange={onEditFieldChange}
                    >
                      {roleTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      className="admin-select"
                      name="status"
                      value={editPanel.data.status || "new"}
                      onChange={onEditFieldChange}
                    >
                      {careerStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="full-width">
                    Candidate Message
                    <textarea
                      name="message"
                      rows={3}
                      value={editPanel.data.message || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label className="full-width">
                    Admin Notes
                    <textarea
                      name="adminNotes"
                      rows={3}
                      value={editPanel.data.adminNotes || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                </div>
              ) : null}

              {editPanel.type === "project" ? (
                <div className="admin-portal-edit-grid">
                  <label>
                    Full Name
                    <input
                      name="fullName"
                      value={editPanel.data.fullName || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      value={editPanel.data.email || ""}
                      onChange={onEditFieldChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      name="phone"
                      value={editPanel.data.phone || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Company
                    <input
                      name="company"
                      value={editPanel.data.company || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Target Budget
                    <input
                      name="targetBudget"
                      value={editPanel.data.targetBudget || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Target Timeline
                    <input
                      name="targetTimeline"
                      value={editPanel.data.targetTimeline || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Project Category
                    <select
                      className="admin-select"
                      name="projectCategory"
                      value={editPanel.data.projectCategory || "website"}
                      onChange={onEditFieldChange}
                    >
                      {projectCategoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Project Subtype
                    <input
                      name="projectSubtype"
                      value={editPanel.data.projectSubtype || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      className="admin-select"
                      name="status"
                      value={editPanel.data.status || "new"}
                      onChange={onEditFieldChange}
                    >
                      {projectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="full-width">
                    Project Summary
                    <textarea
                      name="projectSummary"
                      rows={3}
                      value={editPanel.data.projectSummary || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label className="full-width">
                    Feature Requirements
                    <textarea
                      name="featureRequirements"
                      rows={3}
                      value={editPanel.data.featureRequirements || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                  <label className="full-width">
                    Admin Notes
                    <textarea
                      name="adminNotes"
                      rows={3}
                      value={editPanel.data.adminNotes || ""}
                      onChange={onEditFieldChange}
                    />
                  </label>
                </div>
              ) : null}

              <div className="admin-action-group end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditPanel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary admin-btn-glow"
                  disabled={editPanel.submitting}
                >
                  {editPanel.submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </article>
  );
}

export default AdminPortalControlPage;
