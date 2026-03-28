# ✨ Indocreonix — Futuristic Digital Ecosystem

A high-performance, immersive React application designed to represent the Indocreonix brand's commitment to digital innovation and engineering excellence.

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
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth Web Client ID for admin SSO.
- `VITE_CHAT_PROVIDER`: Choose between `openai` or `gemini`.
- `VITE_OPENAI_API_KEY`: Required if using OpenAI as the AI provider.

### **2. Google Sign-In (Admin Login)**

The admin login page supports both password login and Google SSO.

Frontend requirements:

- Set `VITE_GOOGLE_CLIENT_ID` in `.env`.
- Add your local and production frontend URLs in Google OAuth authorized JavaScript origins.

Backend requirements:

- Implement `POST /api/auth/google` to accept `{ credential }` (Google ID token), verify it, map/create admin user, and return:

```json
{
  "token": "your_app_jwt",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin"
  }
}
```

- Ensure backend CORS allows your frontend origin.

If `VITE_GOOGLE_CLIENT_ID` is missing, the login page automatically shows a guided fallback message and keeps email/password login available.

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

## 📝 Developer Notes

This application was engineered using **Antigravity (Gemini 2.0 Pro)** for state-of-the-art UI implementation and interaction design. The system follows a component-first architecture for extreme scalability and maintainability.

> Update confirmed 2026-03-29: README change merged and push retry pending.

