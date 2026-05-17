# 🌟 StoreRate — Premium Store Rating Platform

StoreRate is a full-stack web application designed to provide a **modern, secure, and scalable store rating system**.  
It allows users to discover and rate stores, while giving admins and store owners powerful tools for management, insights, and monitoring — all wrapped in a premium **Glassmorphism UI experience**.

---

## 🚀 Overview

StoreRate is built as an enterprise-style platform where three types of users interact seamlessly:

- Customers explore and rate stores
- Store owners monitor feedback and performance
- Administrators manage the entire system with advanced controls

The platform focuses on **usability, security, and clean UI/UX design**.

---

## ✨ Core Features

### 👤 User Management System
- Secure registration and login system
- Role-based access control (Admin / Owner / User)
- Password encryption using **Bcrypt**
- JWT-based authentication for secure sessions

---

### 🏪 Store Exploration & Ratings
- Browse available stores with details
- Submit star ratings and feedback
- View average ratings of each store
- User-friendly rating experience

---

### 🛡️ Admin Dashboard
- Complete control over users and stores
- View system-wide analytics
- Manage platform data efficiently
- Monitor store activity and user behavior

---

### 🔁 Advanced Admin Capability
- **User Impersonation Feature**
  - Admin can log in as any user or store owner
  - Helps in debugging and verifying user experience
  - No need for passwords

---

### 📊 Store Owner Dashboard
- View store performance metrics
- Analyze customer ratings and reviews
- Understand user feedback trends
- Improve business decisions

---

## 🎨 UI / UX Design System

StoreRate uses a premium visual system designed for modern web applications:

- 🌑 Dark theme (Charcoal Black base)
- ❤️ Accent color: Deep Crimson `#991b1b`
- ✨ Glassmorphism cards with blur effects
- 🎬 Smooth animations using Framer Motion
- 📱 Fully responsive layout (mobile + desktop)
- 🧭 Clean navigation and minimal UI clutter

---

## 🧰 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React (Vite), Axios, Framer Motion, Lucide Icons, CSS |
| Backend    | Node.js, Express.js |
| Database   | SQLite (easily upgradeable to PostgreSQL) |
| ORM        | Sequelize |
| Security   | JWT Authentication, Bcrypt |

---

## ⚙️ Installation & Setup

Follow these steps carefully to run the project locally:

---

### 📌 1. Prerequisites
Make sure you have installed:
- Node.js (v16 or above)
- npm (comes with Node.js)

---

### 📌 2. Backend Setup

Navigate to backend folder:

```bash
cd backend
npm install
