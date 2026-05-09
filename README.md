# Saffron & Sage

A recipe for a delicious future.

Your intelligent YouTube sous-chef. Sync recipes with video, manage your pantry, and plan meals with AI-driven insights.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4
- Supabase (auth + Postgres)
- YouTube Data API v3
- Motion (Framer Motion), lucide-react

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in:
   ```
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
   VITE_YOUTUBE_API_KEY=<your-youtube-data-api-key>
   ```

3. Start the dev server:
   ```
   npm run dev
   ```

   App runs on http://localhost:3000

### Windows note

If the project folder name contains `&`, npm scripts can fail because `cmd.exe` treats `&` as a command separator. Switch the script shell to PowerShell:

```
npm config set script-shell "powershell.exe"
```

## Supabase setup

The app expects two tables in your Supabase project:

- `pantry` — pantry items per user
- `meal_plan` — recipes added to the user's planner

Both should have a `user_id` column wired to `auth.users.id` with row-level security policies restricting access to the row owner.
