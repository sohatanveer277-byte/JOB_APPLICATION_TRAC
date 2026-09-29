# 💼 JobPulse ATS — Tech Job Application & Interview Tracker

An ATS and Notion/Linear-style fullstack dashboard designed for tech candidates to manage job applications, salary estimates, and interview countdowns with a lightweight backend.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TailwindCSS%20%7C%20Express%20%7C%20SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🖥️ Frontend (Notion / Linear Dark-Mode UI)
* **Status Pipeline (Kanban Board):**
  * Visual columns: `Bookmarked`, `Applied`, `Interviewing`, `Offered`, `Rejected`.
  * **Native Drag-and-Drop:** Move cards across stages to automatically update the backend database.
  * Quick-actions menu to edit details, move stages with 1 click, or delete.
* **Salary Insights & Analytics:**
  * Real-time salary analytics: minimum, maximum, and average annual salary across active roles.
  * Visual gradient range bar.
* **Timeline View & Interview Countdown:**
  * Chronological interview schedule with live countdown badges (`Today!`, `Tomorrow`, `In 2 days`, `In 5 days`).
  * Top alert banner for the immediate upcoming interview round.
  * Preparation notes and round labels (*System Design*, *Live Coding*, *Take-home*).
* **Notion-Style Database Table View:**
  * Sortable columns (Company, Role, Salary, Status, Interview Date).
  * Direct inline status dropdown to change application stage on the fly.
* **Global Quick Search:**
  * Search across companies, roles, notes, and locations with `⌘K` or `Ctrl+K` keyboard shortcut.

---

### ⚙️ Backend (REST API + SQLite)
* **Single-Table SQLite Architecture (`applications.db`):**
  * `id`: Primary key
  * `company_name`, `role`, `status`
  * `salary_min`, `salary_max`, `salary_estimate`
  * `location`, `work_mode` (`Remote`, `Hybrid`, `Onsite`)
  * `job_url`, `interview_date`, `interview_round`, `notes`
  * `created_at`, `updated_at`
* **Pre-seeded with realistic tech applications** (Linear, Stripe, Vercel, Supabase, GitHub, Datadog, Figma) on initial boot.
* **REST Endpoints:**
  * `GET /api/applications` — Supports `?status=...&search=...&sort=...`
  * `POST /api/applications` — Create a new application
  * `GET /api/applications/:id` — Fetch single application
  * `PUT /api/applications/:id` — Update full details
  * `PATCH /api/applications/:id/status` — Quick status advance
  * `DELETE /api/applications/:id` — Delete an application
  * `GET /api/stats` — Salary metrics (min/max/avg), status counts, upcoming interview schedule

---

## 🚀 Quick Start

### 1. Run Both Frontend and Backend Concurrently
From the project root:

```bash
npm run dev
```

This starts:
* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5001](http://localhost:5001)

---

### 2. Run Independently (Optional)

**Run Backend Only:**
```bash
npm run dev:server
# or: cd server && npm run dev
```

**Run Frontend Only:**
```bash
npm run dev:client
# or: cd client && npm run dev
```

---

## 📁 Project Structure

```text
JOB_APPLICATION_TRAC/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global search (⌘K), view switcher, +New button
│   │   │   ├── StatsOverview.jsx    # Salary insights & upcoming interview alert banner
│   │   │   ├── BoardView.jsx        # Drag-and-drop Kanban pipeline
│   │   │   ├── TableView.jsx        # Notion-style sortable table
│   │   │   ├── TimelineView.jsx     # Chronological interview countdown schedule
│   │   │   ├── ApplicationModal.jsx # Add & Edit modal dialog
│   │   │   └── DeleteConfirmModal.jsx # Delete confirmation dialog
│   │   ├── services/
│   │   │   └── api.js               # Frontend API client
│   │   ├── utils/
│   │   │   ├── constants.js         # Statuses, work modes, interview round presets
│   │   │   └── formatters.js        # Salary & countdown date formatters
│   │   ├── App.jsx                  # Main application coordinator
│   │   ├── index.css                # Tailwind CSS + custom scrollbars
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js               # Port 3000 with API proxy to port 5001
├── server/                     # Express + SQLite Backend
│   ├── src/
│   │   ├── db.js                    # SQLite initialization & realistic seed data
│   │   ├── routes.js                # REST API routes & statistics calculations
│   │   └── index.js                 # Server entry point (Port 5001)
│   └── applications.db          # Local SQLite database (created automatically)
├── package.json                 # Workspace dev script using concurrently
└── README.md
```

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express 4, better-sqlite3
* **Tooling:** Concurrently