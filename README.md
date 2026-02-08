# BillBolo — Voice-to-Invoice Automation Platform

BillBolo is a **backend-driven invoice automation system** built using **Next.js (full-stack)**.
It enables shop owners to generate structured invoices from **voice input**, store them reliably, and manage invoices through a modern dashboard.

The project focuses on **backend workflows, async processing, database modeling, and external integrations**, with a React-based UI for interaction.

🌐 **Live Application:**
👉 [https://billbolo.vercel.app/](https://billbolo.vercel.app/)

---

## 🎯 Core Idea

> Convert **voice input into structured invoices**, persist them in a database, and optionally deliver invoices via external channels (e.g. WhatsApp).

---

## 🚀 Key Features

### 🔐 Authentication

* Authentication implemented using **Clerk**
* Designed as a **single-tenant system** (shop owner only)
* No authorization layer by design (all authenticated users are owners)

---

### 🎙️ Voice → Invoice Workflow

* Voice input captured from the frontend
* Audio processed asynchronously by a background worker
* Voice converted into structured invoice data
* Invoice records persisted in PostgreSQL
* Optional WhatsApp delivery flow prepared

---

### 🧾 Invoice Management

* View generated invoices
* Download invoice PDFs
* Responsive invoice listing:

  * Table view on desktop
  * Card-based layout on mobile
* Expandable invoice details

---

### 📊 Business Dashboard

* Total revenue (formatted in INR)
* Total orders overview
* System sync status indicator
* Shop context (Shop ID and owner details)

---

## 🏗️ System Architecture

```
Frontend (Next.js / React)
        ↓
API Routes (Next.js backend)
        ↓
Business Logic Layer
        ↓
PostgreSQL (Prisma ORM)
        ↓
Background Worker (Voice → Invoice)
        ↓
External Integrations (WhatsApp - optional)
```

---

## 🛠️ Technical Stack

### Backend & System

* **Next.js** (full-stack: frontend + backend APIs)
* **Prisma ORM**
* **PostgreSQL**
* **Background worker** for async voice processing
* REST-style API routes

### Authentication

* **Clerk**

### Frontend

* React (TypeScript)
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Infrastructure

* **Frontend & API:** Vercel
* **Worker:** Railway (free tier)
* **Database:** PostgreSQL

---

## ⚙️ Local Development

### Prerequisites

* Node.js v18+
* PostgreSQL database
* Clerk credentials

---

### Setup

```bash
git clone https://github.com/rajandevstudio/BillBolo.git
cd BillBolo
npm install
```

---

### Environment Variables

```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=...
CLERK_PUBLISHABLE_KEY=...
```

---

### Run Locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 Current Status & Limitations

* ✅ Voice → Invoice flow tested via frontend
* ✅ Invoice persistence verified in PostgreSQL
* ⚠️ Background worker runs on **Railway free tier**

  * May sleep or stop in the future due to free-tier limits
* ⚠️ WhatsApp integration prepared but not fully tested

  * Pending WhatsApp API approval and production credentials

These limitations are **infrastructure-related**, not architectural.

---

## 🔮 Future Improvements

* Reliable worker hosting (paid tier / cloud scheduler)
* Retry & monitoring for background jobs
* WhatsApp webhook-based delivery confirmation
* Multi-shop support with authorization roles
* Audit logs for invoice lifecycle

---

## 🧠 Why This Project Matters

This project demonstrates:

* Backend system design inside a modern full-stack framework
* Async/background processing
* Real authentication using Clerk
* Database modeling with Prisma
* External integration patterns (AI, WhatsApp)
* Ability to adapt beyond Python-only stacks

BillBolo complements a traditional Django backend project by showcasing **modern backend adaptability**.

---

## 👤 Author

**Rajan Bagoriya**
Backend Engineer (Python • APIs • Systems)
GitHub: [https://github.com/rajandevstudio](https://github.com/rajandevstudio)

---
