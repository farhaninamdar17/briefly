# BRIEFLY

> **“Your areas. Your interests. Just the news that matters.”**

**BRIEFLY** is a polished, production-ready, mobile-first personalized news platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and PostgreSQL/Supabase. It combines local, national, and international reporting, short vertical video briefings, AI-assisted editorial clarity, official disaster warnings, and multi-source transparency.

---

## 🌟 Core Product Features

### 1. 5-Second First-Time User Experience
- **Simple 3-Screen Onboarding:** Select followed areas (e.g. Pune, Mumbai, Maharashtra, India) → choose key beats (Technology, Science, Business, Sports) → set alert rules → *Build My Brief*.
- **Homepage Priority Hierarchy:**
  1. Top Verified Stories
  2. 5-Minute Morning Briefing
  3. Short Vertical Video Briefings (9:16 Shorts-style)
  4. Official Disaster & Civil Alerts (NDMA SACHET / IMD)
  5. Today in Your Areas
  6. Explore Topics & Trending Signals

### 2. Multi-Format 5-Minute Daily Briefing
- **One-Tap Start:** Fast curated walkthrough through **Local → National → World → Interests**.
- **3 Consumption Modes:**
  - 📖 **READ Mode:** Clean, distraction-free cards with read timers.
  - 🎬 **WATCH Mode:** Curated 60-second video updates.
  - 🎙️ **LISTEN Mode:** Studio voice synthesizer with speed controls (1x, 1.25x, 1.5x) and 15s skip.
- **Reading Streaks:** Interactive streak tracking and shareable completion summaries.

### 3. "Why It Matters" Clarity Structure
Every major story is decomposed into a fact-grounded 4-part breakdown:
1. **What happened?** (Concise verified facts)
2. **Why it matters** (Direct civic and economic impact)
3. **Who is affected** (Stakeholders and local residents)
4. **What happens next** (Upcoming milestones and dates)

### 4. Source Transparency & Perspective Comparison
- **What different sources are reporting:** Side-by-side comparison cards displaying reporting angles from independent publishers without biased ranking.
- **Developing Story Timelines:** Real-time chronological update feed with timestamped milestones and source citations.
- **“Why am I seeing this?”:** Contextual transparency pills on every card explaining why it appeared in the user's feed.

### 5. Official Disaster & Emergency Alerts
- Direct integration pipeline for **NDMA SACHET**, IMD, and State Disaster Management Authorities.
- Strict anti-hallucination constraint: AI models are prohibited from generating synthetic emergency events.
- Actionable civil safety instructions, authority validation badges, and emergency hotline references.

### 6. Administration & Security Control Center (`/admin`)
- Role-Protected routes with server-side authorization checks (`ADMIN`, `EDITOR`, `USER`).
- Live system health monitor and feed latency checker.
- Official Disaster Alert dispatcher and story publishing workflow.
- Real-time security audit log tracking admin actions, rate-limit events, and actor IP hashes.

---

## 🛡️ Security — Defense in Depth

The application is **security-hardened with defense-in-depth protections**:

1. **Server-Side Authorization:** Admin and Editor operations verify permissions on the server via session tokens. Client requests never dictate user IDs or roles.
2. **SSRF & External URL Protection:** [`src/lib/security/urlValidator.ts`](src/lib/security/urlValidator.ts) blocks internal IP ranges (RFC 1918, RFC 3927), AWS/GCP instance metadata (`169.254.169.254`), `localhost`, `javascript:`, and `data:` schemes.
3. **Sliding-Window Rate Limiting:** [`src/lib/security/rateLimiter.ts`](src/lib/security/rateLimiter.ts) enforces dedicated rate tiers:
   - Auth endpoints: `5 requests/min`
   - Search: `30 requests/min`
   - News queries: `60 requests/min`
   - AI / pipeline triggers: `10 requests/min`
4. **Data Access Layer (DAL) & Explicit DTOs:** [`src/lib/dal/dto.ts`](src/lib/dal/dto.ts) ensures internal database credentials or sensitive columns are never exposed to the client.
5. **Content Security Policy & Strict Headers:** Configured in Next.js middleware with `frame-src https://www.youtube-nocookie.com`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
6. **Input Validation:** Zod schemas validate every API query parameter and mutation body.

---

## 🗄️ Database & Row Level Security (RLS)

The database schema in [`src/lib/db/schema.sql`](src/lib/db/schema.sql) defines 20 tables with PostgreSQL Row Level Security:

- `users`, `profiles`, `admin_users`
- `locations`, `user_locations`
- `topics`, `user_topics`
- `sources`, `source_articles`
- `stories`, `story_sources`, `story_updates`
- `videos`, `story_videos`
- `alerts`, `notifications`, `user_notification_preferences`
- `saved_stories`, `saved_videos`
- `daily_briefings`, `audit_logs`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `20.x` or `22.x`+
- npm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/briefly.git
cd briefly

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running the Test Suite
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## ☁️ Vercel Deployment

Deploying **BRIEFLY** to Vercel is seamless:

1. Push your repository to GitHub / GitLab.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Add any optional production environment variables from `.env.example` (such as `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`).
4. Click **Deploy**.

---

## 👥 Demo Credentials

For testing and demonstration, use the quick 1-tap sign-in buttons in the header or the accounts below:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@briefly.news` | `password123` | Full access, alert dispatcher, story delete, audit logs |
| **Editor** | `editor@briefly.news` | `password123` | Story publishing, pipeline sync, system health |
| **Reader** | `reader@briefly.news` | `password123` | Personalized feed, bookmarks, notification preferences |

---

## 📄 License
MIT © BRIEFLY Media.
