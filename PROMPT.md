# PROMPT.md — How Cine-Stream Was Built

This file documents the original design intent, the decisions made along the way, and what the AI was prompted to build. If you're trying to understand why something was built a certain way, or you want to fork and extend this, this should help.

---

## The original idea

The prompt started simple: build a movie discovery app that uses AI to match films to your mood. Not a search engine. Not a recommendation system based on watch history. Something more instinctive — you say how you're feeling, and it finds a film for that feeling.

The second requirement was that it should look premium. Not a side project. Something that could pass as a real product — dark, cinematic, polished. The kind of UI that makes you want to interact with it.

---

## What was asked of the AI

The core prompt given to the AI to build this project was roughly:

> Build a cinematic, dark-themed movie discovery SPA using React, Tailwind CSS v4, Vite, and an Express backend. It should have an AI mood matcher powered by Gemini, TMDB integration for real movie data, a hero carousel, infinite scroll movie grid with genre filters, movie detail pages with trailer playback, and a favorites library stored in localStorage. Design it to feel like a premium streaming platform — not a side project. Use a pre-seeded movie catalog as fallback when API keys are missing.

From there, iteration happened across several sessions:

- The mood matching started with just keyword scoring, then Gemini was layered on top
- TMDB was added as a second tier — real movies instead of fictional ones
- The fallback chain (Gemini+TMDB → Gemini+local → keyword) was built iteratively
- Light mode was added after dark mode was stable
- The hero carousel was refined to include dot indicators and arrow controls that only appear on hover

---

## Mood matching — how it actually works

The mood matcher has three layers, tried in order:

**1. Gemini + TMDB (when both keys are present)**
The user's mood text is sent to Gemini 2.5 Flash with a structured schema. Gemini returns a TMDB search query and a personalized reasoning paragraph. That query hits TMDB's search endpoint and returns the first result. This gives you real, current movies.

**2. Gemini + pre-seeded catalog (when only Gemini is present)**
The full catalog of 14 pre-seeded films is sent to Gemini as JSON context. Gemini picks the best match by ID and writes a reasoning paragraph. This is slower but still AI-powered.

**3. Local keyword matching (zero API keys)**
The mood text is tokenized, stop words are removed, synonyms are expanded (e.g. "breakup" → heartbreak, romance, melancholic), and each film is scored against the resulting keyword set. Genre matches score highest, then custom keyword tags, then title/tagline/overview matches. The highest-scoring film wins. A reasoning paragraph is generated from the matched keywords.

The synonym map and movie keyword tags were both hand-written to make the matching feel more human. A movie tagged "lonely, solitude, minimalist" will match moods like "I want something quiet and isolating" even though those exact words don't appear in the film's description.

---

## The pre-seeded film catalog

The 14 films in the catalog are fictional — created specifically for this project, not real TMDB entries. They were designed to cover a range of moods and aesthetics: cyberpunk, art house, melancholic drama, surreal experimental, retro nostalgia, and so on. Each film has a poster and backdrop image, a tagline, overview, director, and mood keywords.

They exist so the app works and feels complete with zero API configuration. Anyone cloning the repo can run it immediately and the mood matcher will return something sensible.

---

## Architecture decisions

**Why Express for local dev?**
Vite's dev server doesn't support custom API routes without plugins. Rather than fighting Vite middleware config, a simple Express server runs alongside it — Express handles API routes, Vite handles the frontend with HMR. One command starts both.

**Why Vercel serverless for production?**
The Express server can't run as a long-lived process on Vercel. Serverless functions are the right fit — each API route becomes its own function with zero cold-start overhead for this traffic level. The `api/` folder structure maps directly to routes, which keeps things obvious.

**Why no state management library?**
The app's state is simple enough to live in React's built-in hooks. There's no deeply nested shared state, no async caching complexity that would warrant Zustand or Redux. `useState` and `useEffect` handle everything cleanly.

**Why localStorage for favorites?**
No accounts, no backend persistence, no friction. The feature works offline and survives page refreshes. For a discovery app where the point is exploration, this is the right tradeoff.

---

## Design intent

The visual direction was "premium streaming platform meets A24 film aesthetic." Specific choices:

- **Background**: Near-black (`#0A0A0B`) rather than pure black — softer, more cinematic
- **Accent**: Brand crimson (`#E50914`) pulled from Netflix's palette as a familiar reference point for streaming
- **AI sections**: Blue (`#00A3FF`) to visually separate AI-powered features from human-curated ones
- **Typography**: System sans-serif for body, tight tracking for labels, monospace for metadata — mixing three type registers creates hierarchy without needing many font weights
- **Motion**: Subtle. Fade-in on page transitions, scale on hover, shimmer on loading skeletons. Nothing that would distract from the content.
- **Light mode**: Exists and is intentional. Zinc tones, soft shadows, all the same layout. Some people prefer it.

---

## If you want to extend this

A few things that would be natural next steps:

- **User accounts** — swap localStorage for a database, add auth, make favorites persistent across devices
- **Watch providers** — TMDB has a `/watch/providers` endpoint, could show where to actually stream each film
- **More mood granularity** — the synonym map is hand-written, it could be replaced with an embedding-based similarity search for more nuanced matching
- **Trailer modal** — currently opens YouTube in a new tab or embeds inline, could be a proper modal overlay
- **Collections** — let users create named lists beyond a single favorites folder
