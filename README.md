# Cine-Stream

A premium, AI-powered movie discovery platform. You describe how you're feeling, and it finds the right film for you. Built with React, Gemini AI, and TMDB — with a hand-curated fallback library when no API keys are present.

---

## What this is

Cine-Stream is more of a mood-based film discovery experience than a traditional movie search tool. Instead of typing a title, you describe a feeling — *"something slow and melancholic, like a foggy city at 2am"* — and the AI matches it to a film. It pulls from TMDB for real-world movies, or from a built-in curated list if TMDB isn't configured.

The interface is dark, cinematic, and intentionally minimal. There's a hero carousel, genre filters, infinite scroll, a favorites library, and a light/dark theme toggle.

---

## Tech stack

- **React 19** with TypeScript
- **Vite** for dev and bundling
- **Tailwind CSS v4** for styling
- **Express** for the local dev server
- **Gemini 2.5 Flash** for AI mood matching
- **TMDB API** for real movie data (optional)
- **Vercel** for production deployment (serverless functions)

---

## Running locally

You'll need Node.js (v18 or higher) installed.

```bash
# 1. Install dependencies
npm install

# 2. Add your keys
# Create a .env.local file in the root and add:
GEMINI_API_KEY=your_gemini_key_here
TMDB_API_KEY=your_tmdb_key_here   # optional but recommended

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

If you skip the TMDB key, the app falls back to the 14 pre-seeded films. If you skip the Gemini key, the mood matcher uses local keyword matching instead of AI. Both fallbacks work fine for testing.

---

## Getting API keys

**Gemini API key** — Go to [Google AI Studio](https://aistudio.google.com/app/apikey), create a key, and paste it into `.env.local`. The free tier is more than enough for this app.

**TMDB API key** — Create a free account at [themoviedb.org](https://www.themoviedb.org/settings/api), request an API key (takes about 30 seconds), and add it. The v3 key and the v4 read access token both work.

---

## Deploying to Vercel

The project is already set up for Vercel. The Express server is only used in local dev — in production, all API routes run as Vercel serverless functions under the `api/` directory.

```bash
# Make sure Vercel CLI is installed
npm install -g vercel

# Deploy
vercel deploy
```

After deploying, go to your project in the [Vercel dashboard](https://vercel.com/dashboard), open **Settings → Environment Variables**, and add:

```
GEMINI_API_KEY   →  your_gemini_key
TMDB_API_KEY     →  your_tmdb_key
```

Redeploy once after adding the variables and everything should work end to end.

---

## Project structure

```
├── api/                        # Vercel serverless functions
│   ├── _lib/
│   │   └── movies-data.ts      # Shared TMDB helpers + pre-seeded data
│   ├── movies.ts               # GET /api/movies
│   ├── movies/
│   │   ├── [id].ts             # GET /api/movies/:id
│   │   └── [id]/
│   │       └── similar.ts      # GET /api/movies/:id/similar
│   └── mood-match.ts           # POST /api/mood-match
├── src/
│   ├── components/
│   │   ├── Hero.tsx            # Autoplay carousel
│   │   ├── MoodMatcher.tsx     # AI mood input + result
│   │   ├── MovieCard.tsx       # Grid card with favorite toggle
│   │   ├── MovieDetailPage.tsx # Full detail view with trailer
│   │   ├── Navbar.tsx          # Top nav with tabs and theme toggle
│   │   ├── Footer.tsx
│   │   └── ThemeContext.tsx    # Dark/light theme provider
│   ├── data/
│   │   └── movies.ts           # Pre-seeded film catalog + genre/mood exports
│   ├── App.tsx                 # Main app shell
│   └── main.tsx
├── server.ts                   # Local Express + Vite dev server
├── vercel.json                 # Vercel routing config
└── vite.config.ts
```

---

## Notes

- The mood matcher runs a three-tier fallback: Gemini + TMDB → Gemini + pre-seeded catalog → local keyword matching. So it always returns something, even with zero API keys.
- Favorites are stored in `localStorage` — no backend, no account needed.
- The TMDB key supports both v3 API keys and v4 Read Access Tokens. The server detects which one you've pasted by checking key length.
- Light mode exists and actually looks good. Toggle it from the sun icon in the navbar.

# CineStream
