# Tracktern

A full-stack job search and application tracker for any field, in any of 12 countries — built to replace the browser-tabs-and-spreadsheet approach to job hunting with one tool that actually tracks where you stand.


---

## Why I built this

I wanted a single place to search for roles across fields and locations and track exactly where I stood with each one — instead of juggling a dozen browser tabs and a half-updated spreadsheet. Most job boards are built around one country or one industry; this one deliberately isn't.

## Features

- 🔍 **Search any field, any country** — live listings pulled from the Adzuna Jobs API across 12 supported countries (US, UK, India, Canada, Australia, Germany, France, New Zealand, Poland, Brazil, Austria, South Africa)
- 🏷️ **Category filtering** — browse by field (IT, Healthcare, Sales, Teaching, and more) even without a specific job title in mind
- 📌 **Save & track** — save any listing and move it through a real application pipeline: Saved → Applied → Interviewing → Offer / Rejected
- ⚡ **Fast, serverless backend** — Next.js API routes with a Supabase (PostgreSQL) database, no server to manage
- 🕸️ *(Optional)* **Company page scraping** — a Cheerio-based scraper for pulling listings directly from an individual company's careers page


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL via [Supabase](https://supabase.com) |
| Job Data | [Adzuna Jobs API](https://developer.adzuna.com/) |
| Scraping *(optional)* | Cheerio |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js v18+
- A free [Adzuna API key](https://developer.adzuna.com/)
- A free [Supabase](https://supabase.com) PostgreSQL database

### Installation

```bash
git clone https://github.com/yourusername/jobtrack.git
cd jobtrack
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run this in your Supabase project's SQL Editor to create the required table:

```sql
create table saved_jobs (
  id uuid default gen_random_uuid() primary key,
  job_id text not null,
  title text not null,
  company text not null,
  location text,
  apply_url text not null,
  status text default 'Saved' check (status in ('Saved', 'Applied', 'Interviewing', 'Rejected', 'Offer')),
  created_at timestamp default now()
);
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project Structure

```
tracktern/
├── app/
│   ├── api/
│   │   ├── categories/route.ts
│   │   ├── jobs/route.ts
│   │   ├── saved-jobs/route.ts
│   │   ├── scrape/route.ts
│   │   └── test/route.ts
│   ├── tracker/page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── JobCard.tsx
├── lib/
│   └── supabase.ts
├── public/
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

## Roadmap / Future Improvements

- [ ] User accounts, so tracked jobs persist per person instead of globally
- [ ] Email/browser notifications when a saved search has new listings
- [ ] Additional scraped sources beyond the Adzuna API
- [ ] Export tracked applications to CSV

## Author

**Vani Sharma**
[LinkedIn](www.linkedin.com/in/vani-sharma24) · [GitHub](https://github.com/vanisharma24)

## License

MIT
