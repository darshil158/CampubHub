# Quadly 🎓 (Campus Hub)

> **The University Operating System for Student Life.**  
> An all-in-one, venture-backed student ecosystem for college commerce, flexible campus jobs, roommate matching, peer tutoring, and lecture notes.

---

## 🚀 Key Modules & Ecosystem

- **🛍️ Campus Marketplace**: Buy and sell textbooks, electronics, dorm essentials, and college gear within your verified university network with zero platform surcharges.
- **💼 Jobs & Gigs**: Discover and post part-time roles, research assistantships, on-campus employment, and student freelance gigs.
- **🏠 Housing & Roommates**: Connect with verified student roommates, open rooms, subleases, and off-campus apartments.
- **🎓 Peer Tutoring**: Learn from top-performing classmates in STEM, economics, computer science, and humanities.
- **⚡ Skill Exchange**: Trade talents including pair programming, languages, graphic design, and audio production.
- **📝 Study Notes & Guides**: Share and access crowdsourced lecture summaries, practice midterm exams, and formula cheat sheets.
- **👤 Student Profile & Dashboard**: Comprehensive multi-tab activity center for user listings, job posts, housing offers, and settings.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom CSS variable design tokens and glassmorphism in `src/index.css`
- **Component Design System**: Quadly Design System (`src/components/ui/`):
  - `BrandLogo.jsx`: Scalable geometric vector SVG symbol + wordmark
  - `Button.jsx`: Spring hover states, glow variants, Radix `asChild` support, and loading spinners
  - `Card.jsx`: Glass border highlights, interactive hover lift, responsive padding
  - `Input.jsx` & `Select.jsx`: Glowing focus rings, error states, and icon slots
  - `Badge.jsx` / `Tag.jsx`: Status indicators (Verified, Urgent, Active, Remote)
  - `Modal.jsx` & `Drawer.jsx`: Framer Motion backdrop transitions and mobile bottom sheets
- **Motion & Micro-interactions**: Framer Motion v13
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Storage, Auth)
- **Deployment**: Vercel & Render (configured with SPA rewrites)

---

## 🏁 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/darshil158/CampubHub.git
cd CampubHub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Setup (Supabase)
Run the SQL migration in your Supabase SQL Editor:
- `supabase/phase4_schema.sql` (Creates `jobs`, `roommates`, `tutors`, `notes`, `skills`, and `profiles` tables with RLS policies).

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment (Vercel & Render)

### Deploying on Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. `vercel.json` is included for SPA route rewrites (`/* -> /index.html`).

### Deploying on Render
1. Create a **Static Site** on [Render](https://render.com) using the included `render.yaml`.
2. Build Command: `npm run build`.
3. Publish Directory: `./dist`.
4. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. SPA routing rewrite is configured automatically via `render.yaml`.
