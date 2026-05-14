# ✨ Indocreonix — Futuristic Digital Ecosystem (Updated)

A high-performance, immersive React application designed to represent the Indocreonix brand's commitment to digital innovation and engineering excellence.

> NOTE: UI labels were recently optimized for compact display and better mobile fit.

---

## 🎨 Design Aesthetics & UX

### 1. Visual Language

- **Glassmorphism:** Premium frosted-glass UI elements for a modern, transparent look.
- **Micro-Animations:** Fluid transitions and hover effects powered by `framer-motion`.
- **Indocreonix Palette:** Deep Navys, Electric Cyans, and sophisticated Greys.








### 2. Immersive Experiences

- **Project Quote Builder:** A step-by-step interactive form for detailed project discovery.
- **Service Catalog:** Dynamic categorization of Web, Mobile, and Software solutions.
- **AI-Powered Sidekick:** Integrated ChatGPT/Gemini assistant for 24/7 site navigation.

---

## 🚀 Key Functionalities

### 💻 Client-Facing Pages

- **Interactive Home:** High-hero metrics and value proposition highlights.
- **Services:** Detailed deep-dives into specialized engineering modules.
- **Careers:** Specialized portals for Job and Internship applications with asset tracking.
- **Contact:** Real-time lead capture with instant automated email confirmations.
- **Accessibility:** WCAG 2.2 AA compliance and keyboard navigation support.

### 🛡️ Admin Command Center

- **Performance Analytics:** Centralized health monitoring for leads and traffic.
- **User Management:** Superadmin-level role and permission (RBAC) control.
- **Project Inbox:** Unified interface to review, qualify, and manage incoming orders.
- **Asset Hub:** Direct Cloudinary integration for managing site-wide media.

---

## 🛠️ Technology Stack

| Layer              | Technology           | Purpose                                                |
| :----------------- | :------------------- | :----------------------------------------------------- |
| **Framework**      | React 19 + Vite      | Ultra-fast rendering and Hot Module Replacement        |
| **Styling**        | Vanilla CSS (Layers) | High-precision design system with 0-CSS-in-JS overhead |
| **Icons**          | Lucide Icons         | Minimalist, scalable vector iconography                |
| **Animation**      | Framer Motion        | Direct-manipulation physics-based animations           |
| **AI Integration** | OpenAI / Gemini      | Real-time site assistant and content intelligence      |

---

## 🏗️ Architecture & Paradigms

> README updated at 2026-03-29 to confirm new content and push attempt.


1. **Context-Driven State:** Global authentication and UI states.
2. **Atomic Components:** Reusable layouts for Forms, Buttons, and Cards.
3. **API Orchestration:** High-level `apiClient` for centralized request handling.
4. **Conditional Routing:** Protected admin routes with role verification.

---

## ⚙️ Operation & Setup

### **1. Integration Configuration**

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL`: Pointer to the Indocreonix backend.
- `VITE_CHAT_PROVIDER`: Choose between `openai` or `gemini`.
- `VITE_OPENAI_API_KEY`: Required if using OpenAI as the AI provider.
- `VITE_ADMIN_PATH`: Optional secret admin base route (default: `/admin`).
- `VITE_SESSION_TIMEOUT_MINUTES`: Session timeout in minutes for both admin and portal users (default fallback: `30`).

### **2. Google Sign-In (Admin + Portal)**

Google sign-in uses **OAuth redirect** via the backend (no iframe button). This avoids browser console CSP/frame warnings and reduces third-party iframe/font noise.

Frontend requirements:
- Set `VITE_API_BASE_URL` to your backend (example: `https://api.yourdomain.com/api`).

Backend requirements:
- Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`.
- Set `FRONTEND_REDIRECT_URI` to your frontend origin (example: `https://indocreonix.com`).
- Add Google Console authorized redirect URIs (admin + portal):
  - `https://<BACKEND_HOST>/api/auth/google/callback`
  - `https://<BACKEND_HOST>/api/portal/auth/google/callback`

Optional compatibility: the backend also supports legacy callback paths:
- `https://<BACKEND_HOST>/api/auth/oauth/google/callback`
- `https://<BACKEND_HOST>/api/portal/auth/oauth/google/callback`

### **3. Development Commands**

```bash
# Install core dependencies
npm install

# Live development environment
npm run dev

# Optimized production build
npm run build
```

---

> Update confirmed 2026-03-29: README change merged and push retry pending.

