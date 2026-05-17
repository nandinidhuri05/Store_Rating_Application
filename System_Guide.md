# 🌐 StoreRate Platform — Product Walkthrough

A guided overview of the StoreRate system, its role-based workflows, and the latest platform enhancements.  
Designed for a seamless experience across **Admin, Store Owners, and Users** with a focus on clarity, performance, and usability.

---

## 🔐 Access Credentials (Demo Environment)

Use the credentials below to explore the system across different roles:

| Access Level | Email | Password |
|--------------|-------|----------|
| 🛡️ Admin | admin@test.com | Password123! |
| 🏪 Store Owner | owner@test.com | Password123! |
| 👤 User | user@test.com | Password123! |

> These accounts are pre-configured for testing and demonstration purposes.

---

## ✨ Platform Evolution (Latest Updates)

The system has recently been upgraded with improved admin control, deeper insights, and UI stability enhancements.

---

### 🔁 Context Switching (Admin Impersonation)

A powerful debugging and verification feature for administrators.

- Navigate to **Admin Panel → Users**
- Select **“Login as User”**
- Instantly switch into the selected account environment
- Return to admin mode via persistent **Admin Banner**

✔ Eliminates repeated login cycles  
✔ Enables real-time user experience validation  
✔ Enhances support and debugging efficiency  

---

### 📊 Deep Store Insight Viewer

Enhanced visibility into store-level performance and engagement.

- Open any store from the **Admin → Stores section**
- Access full review history in a dedicated view
- Analyze:
  - Ratings breakdown
  - User comments
  - Timestamped feedback logs

✔ Enables performance tracking at a granular level  
✔ Helps identify trends and user sentiment  

---

### 🧩 UI Stability & Modal Architecture Upgrade

The interface has been refined for better reliability and consistency.

- Fixed modal layering conflicts (z-index isolation)
- Introduced global modal rendering system
- Improved vertical centering using grid-based alignment
- Ensured full responsiveness across device sizes

✔ No UI overlap issues  
✔ Smooth modal transitions  
✔ Improved mobile experience  

---

## 👥 Role-Based Experience Overview

The platform operates through a structured permission system ensuring secure and contextual access.

---

### 🛡️ Administrator Console

The highest level of system control.

**Capabilities:**
- Platform-wide analytics dashboard
- User and store lifecycle management
- Create and manage system entities
- Impersonate any user or store owner
- Monitor activity across the ecosystem

---

### 👤 End User Experience

A clean and intuitive store discovery interface.

**Capabilities:**
- Browse all registered stores in a responsive grid
- Real-time search by name or location
- Submit and update star ratings (1–5 scale)
- View detailed store information

---

### 🏪 Store Owner Dashboard

A focused business performance interface.

**Capabilities:**
- Dedicated analytics dashboard
- Live average rating tracking
- Access to customer feedback and reviews
- Monitor engagement and store growth trends

---

## 🎨 Design Philosophy

StoreRate is built with a modern UI system inspired by premium SaaS platforms.

- 🌑 Deep dark interface (charcoal base)
- ❤️ Accent identity: Crimson highlight system
- ✨ Glassmorphism layered cards with blur depth
- 🎬 Micro-interaction animations for fluid UX
- 📱 Fully responsive across all screen sizes
- 🧭 Minimal navigation with focus-driven layout

---

## ⚙️ Technology Overview

| Layer | Stack |
|------|------|
| Frontend | React (Vite), Framer Motion, Lucide Icons, Vanilla CSS |
| Backend | Node.js, Express.js |
| ORM | Sequelize |
| Security | JWT Authentication, Role-Based Access Control |

---

## 📌 System Summary

StoreRate is designed as a **secure, modular, and scalable rating platform** that combines:

- Strong role-based architecture  
- Real-time user feedback system  
- Admin-level control and impersonation tools  
- A polished, modern UI experience  

Built for both **functional depth and professional-grade presentation**.
