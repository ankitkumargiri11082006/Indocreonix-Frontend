import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { apiRequest } from "../lib/apiClient";
import StatusModal from "../components/StatusModal";
import { getPortalUser } from "./portalAuthShared";

const projectCategoryOptions = [
  { value: "website", label: "Website" },
  { value: "web-app", label: "Web Application" },
  { value: "android-app", label: "Android Application" },
  { value: "ios-app", label: "iOS Application" },
  { value: "software", label: "Custom Software" },
  { value: "other", label: "Other" },
];

const categorySubtypeOptions = {
  website: {
    label: "Website Type",
    placeholder: "Select website type",
    options: [
      "Static Website",
      "Dynamic Website",
      "Landing Page",
      "E-commerce Website",
      "Portal / Dashboard",
    ],
  },
  "web-app": {
    label: "Web App Type",
    placeholder: "Select web app type",
    options: [
      "SaaS Platform",
      "Admin Dashboard",
      "Customer Portal",
      "Marketplace",
      "CRM / ERP Web App",
    ],
  },
  "android-app": {
    label: "Android App Type",
    placeholder: "Select Android app type",
    options: [
      "E-commerce App",
      "On-Demand Service App",
      "Social / Community App",
      "Business Utility App",
      "Enterprise Android App",
    ],
  },
  "ios-app": {
    label: "iOS App Type",
    placeholder: "Select iOS app type",
    options: [
      "Consumer iOS App",
      "Business iOS App",
      "Subscription-Based App",
      "Marketplace iOS App",
      "Enterprise iOS App",
    ],
  },
  software: {
    label: "Software Type",
    placeholder: "Select software type",
    options: [
      "ERP System",
      "CRM System",
      "Inventory / Billing Software",
      "Automation Software",
      "Custom Internal Software",
    ],
  },
};

const OTHER_OPTION_VALUE = "__other__";
const MAX_PRD_BYTES = 8 * 1024 * 1024; // 8 MB (matches backend Multer limit)
const MAX_SUPPORTING_BYTES = 5 * 1024 * 1024; // 5 MB cap per supporting document
const MAX_SUPPORTING_FILES = 3;

function ProjectRequestPage() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialProduct = searchParams.get("product") || "";
  const initialProjectReference = searchParams.get("project") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialCompany = searchParams.get("company") || "";
  const hasLockedProjectReference = Boolean(initialProjectReference);

  function buildInitialFormData(user = null) {
    const profile = user || getPortalUser() || {};
    return {
      fullName: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      company: initialCompany || profile.organization || "",
      targetBudget: "",
      targetTimeline: "",
      projectCategory: "website",
      projectSubtype: initialCategory,
      projectSubtypeOther: "",
      requestedService: initialService,
      requestedProduct: initialProduct,
      projectReference: initialProjectReference,
      businessGoals: "",
      projectSummary: "",
      featureRequirements: "",
    };
  }

  const [formData, setFormData] = useState(() =>
    buildInitialFormData(getPortalUser()),
  );
  const [prdFile, setPrdFile] = useState(null);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const prdInputRef = useRef(null);
  const supportingDocsRef = useRef(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });
  const [submitting, setSubmitting] = useState(false);
  const activeSubtypeConfig = categorySubtypeOptions[formData.projectCategory];
  const openModal = (payload) =>
    setModalState((previous) => ({
      ...previous,
      ...payload,
      isOpen: true,
    }));

  const sourceContext = useMemo(() => {
    const source = searchParams.get("source");
    if (!source) return "";

    if (source === "client") {
      return "You are requesting a project from a client reference path. Include your expected scale and timeline for accurate estimation.";
    }

    return "You are submitting a direct project request. Provide your technical requirements for faster qualification.";
  }, [searchParams]);

  useEffect(() => {
    const syncPortalProfile = () => {
      const user = getPortalUser();
      if (!user) return;

      setFormData((previous) => ({
        ...previous,
        ...(user.name && user.name !== previous.fullName
          ? { fullName: user.name }
          : {}),
        ...(user.email && user.email !== previous.email
          ? { email: user.email }
          : {}),
        ...(user.phone && user.phone !== previous.phone
          ? { phone: user.phone }
          : {}),
        ...(user.organization && !previous.company
          ? { company: user.organization }
          : {}),
      }));
    };

    syncPortalProfile();

    window.addEventListener("portal-session-updated", syncPortalProfile);
    window.addEventListener("storage", syncPortalProfile);

    return () => {
      window.removeEventListener("portal-session-updated", syncPortalProfile);
      window.removeEventListener("storage", syncPortalProfile);
    };
  }, []);

  function onInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "projectSubtype" && value !== OTHER_OPTION_VALUE
        ? { projectSubtypeOther: "" }
        : {}),
    }));
  }

  function onCategoryChange(event) {
    const nextCategory = event.target.value;
    setFormData((previous) => ({
      ...previous,
      projectCategory: nextCategory,
      projectSubtype: "",
      projectSubtypeOther: "",
    }));
  }

  function handlePrdInputChange(event) {
    const file = event.target.files?.[0] || null;
    if (file && file.size > MAX_PRD_BYTES) {
      openModal({
        title: "PRD is too large",
        message: "Please upload a PDF up to 8 MB so our system can accept it.",
        type: "error",
      });
      event.target.value = "";
      setPrdFile(null);
      return;
    }
    setPrdFile(file);
  }

  function handleSupportingDocsChange(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setSupportingDocs([]);
      return;
    }

    const accepted = [];
    const rejected = [];

    files.slice(0, MAX_SUPPORTING_FILES).forEach((file) => {
      if (file.size > MAX_SUPPORTING_BYTES) {
        rejected.push(file.name);
      } else {
        accepted.push(file);
      }
    });

    if (rejected.length) {
      openModal({
        title: "Supporting file too large",
        message: `The following files exceed ${(
          MAX_SUPPORTING_BYTES /
          (1024 * 1024)
        ).toFixed(1)} MB and were skipped: ${rejected.join(", ")}`,
        type: "error",
      });
    }

    if (!accepted.length) {
      event.target.value = "";
      setSupportingDocs([]);
      return;
    }

    setSupportingDocs(accepted);
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const body = new FormData();
      const normalizedSubtype =
        formData.projectSubtype === OTHER_OPTION_VALUE
          ? formData.projectSubtypeOther.trim()
          : formData.projectSubtype;

      if (activeSubtypeConfig && !normalizedSubtype) {
        throw new Error(
          `Please select ${activeSubtypeConfig.label.toLowerCase()} or specify an other option`,
        );
      }

      if (
        formData.projectCategory === "other" &&
        !String(formData.projectSubtype || "").trim()
      ) {
        throw new Error("Please specify your project type");
      }

      const payload = {
        ...formData,
        projectSubtype: normalizedSubtype || formData.projectSubtype,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "projectSubtypeOther") return;
        body.append(key, value);
      });

      if (prdFile) {
        body.append("prd", prdFile);
      }

      supportingDocs.forEach((file) => {
        body.append("supportingDocs", file);
      });

      await apiRequest("/orders", {
        method: "POST",
        body,
        timeoutMs: 60000,
      });

      openModal({
        title: "Project Request Received",
        message:
          "Thank you for choosing Indocreonix. Your project brief has been successfully submitted to our solutions architecture team. We will review your requirements and a technical consultant will contact you shortly to discuss the next steps and provide a formal proposal.",
        type: "success",
      });

      setFormData((previous) => ({
        ...buildInitialFormData(getPortalUser()),
        targetBudget: "",
        targetTimeline: "",
        businessGoals: "",
        projectSummary: "",
        featureRequirements: "",
      }));
      setPrdFile(null);
      setSupportingDocs([]);
      if (prdInputRef.current) {
        prdInputRef.current.value = "";
      }
      if (supportingDocsRef.current) {
        supportingDocsRef.current.value = "";
      }
    } catch (error) {
      openModal({
        title: "Submission Error",
        message:
          error.message ||
          "We encountered an error while processing your request. Please check your connection and try again, or reach out to our support team.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Project Request"
        title="Request a Professional Project Quote"
        subtitle="Share your website, app, iOS, or software requirements with optional PRD upload. Our team will review and provide a structured proposal."
        theme="theme-launch"
        metrics={[
          {
            value: "Web · Android · iOS · Software",
            label: "Project Coverage",
          },
          { value: "PRD PDF Optional", label: "Documentation" },
          { value: "Technical Qualification", label: "Review Model" },
        ]}
      />

      <section className="container content-section quote-form-wrap">
        <article className="info-card quote-form-card">
          <h3>Project Discovery Form</h3>
          <p>
            Submit your project brief, budget expectations, and technical scope.
            This form is designed for website development, app development, iOS
            applications, and custom software engagements.
          </p>

          {sourceContext ? (
            <p className="quote-form-context">{sourceContext}</p>
          ) : null}

          <form className="quote-form-grid" onSubmit={onSubmit}>
            <label>
              Full Name
              <input
                name="fullName"
                value={formData.fullName}
                onChange={onInputChange}
                required
              />
            </label>

            <label>
              Business Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                required
              />
            </label>

            <label>
              Contact Number
              <input
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                required
              />
            </label>

            <label>
              Company Name
              <input
                name="company"
                value={formData.company}
                onChange={onInputChange}
              />
            </label>

            <label>
              Project Type
              <select
                name="projectCategory"
                value={formData.projectCategory}
                onChange={onCategoryChange}
              >
                {projectCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Requested Service
              <input
                name="requestedService"
                value={formData.requestedService}
                onChange={onInputChange}
                placeholder="Example: Website Development"
              />
            </label>

            <label>
              Requested Product
              <input
                name="requestedProduct"
                value={formData.requestedProduct}
                onChange={onInputChange}
                placeholder="Example: Workflow Management System"
              />
            </label>

            <label>
              Project Reference
              <input
                name="projectReference"
                value={formData.projectReference}
                onChange={onInputChange}
                placeholder="Example: Similar to Volkswagen Dealer Portal"
                readOnly={hasLockedProjectReference}
              />
              {hasLockedProjectReference ? (
                <small>
                  Reference is auto-selected from the project you chose.
                </small>
              ) : null}
            </label>

            <label>
              Target Budget
              <input
                name="targetBudget"
                value={formData.targetBudget}
                onChange={onInputChange}
                placeholder="Example: INR 2,50,000 - 4,00,000"
              />
            </label>

            <label>
              Target Timeline
              <input
                name="targetTimeline"
                value={formData.targetTimeline}
                onChange={onInputChange}
                placeholder="Example: 10-12 weeks"
              />
            </label>

            {activeSubtypeConfig ? (
              <label>
                {activeSubtypeConfig.label}
                <select
                  name="projectSubtype"
                  value={formData.projectSubtype}
                  onChange={onInputChange}
                  required
                >
                  <option value="">{activeSubtypeConfig.placeholder}</option>
                  {activeSubtypeConfig.options.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  <option value={OTHER_OPTION_VALUE}>
                    Other (Please specify)
                  </option>
                </select>

                {formData.projectSubtype === OTHER_OPTION_VALUE ? (
                  <input
                    name="projectSubtypeOther"
                    value={formData.projectSubtypeOther}
                    onChange={onInputChange}
                    placeholder={`Specify ${activeSubtypeConfig.label.toLowerCase()}`}
                    required
                  />
                ) : null}
              </label>
            ) : (
              <label>
                Project Subtype
                <input
                  name="projectSubtype"
                  value={formData.projectSubtype}
                  onChange={onInputChange}
                  placeholder="Example: SaaS Platform / CRM / Marketplace"
                />
              </label>
            )}

            <label className="quote-full-row">
              Business Objective
              <textarea
                rows="3"
                name="businessGoals"
                value={formData.businessGoals}
                onChange={onInputChange}
                required
                placeholder="Describe your business objective and expected outcomes"
              />
            </label>

            <label className="quote-full-row">
              Project Summary
              <textarea
                rows="5"
                name="projectSummary"
                value={formData.projectSummary}
                onChange={onInputChange}
                required
                placeholder="Provide a concise brief of your idea, required modules, and users"
              />
            </label>

            <label className="quote-full-row">
              Functional Requirements
              <textarea
                rows="4"
                name="featureRequirements"
                value={formData.featureRequirements}
                onChange={onInputChange}
                placeholder="List core features, integrations, security requirements, and platforms"
              />
            </label>

            <label className="quote-full-row quote-upload-zone">
              Optional PRD Upload (PDF)
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePrdInputChange}
                ref={prdInputRef}
              />
              <small>
                Upload your Product Requirement Document with project idea and
                scope details (optional).
              </small>
              {prdFile ? (
                <p className="quote-file-name">Selected: {prdFile.name}</p>
              ) : null}
            </label>

            <label className="quote-full-row quote-upload-zone">
              Supporting Documents (Optional)
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                multiple
                onChange={handleSupportingDocsChange}
                ref={supportingDocsRef}
              />
              <small>
                Attach additional reference files such as wireframes, design
                notes, or requirement snapshots.
              </small>
              {supportingDocs.length ? (
                <ul className="quote-file-list">
                  {supportingDocs.map((file) => (
                    <li key={`${file.name}-${file.size}`}>{file.name}</li>
                  ))}
                </ul>
              ) : null}
            </label>

            <div className="quote-full-row quote-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting Request..."
                  : "Submit Project Request"}
              </button>
            </div>
          </form>
        </article>
      </section>

      <StatusModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </>
  );
}

export default ProjectRequestPage;
