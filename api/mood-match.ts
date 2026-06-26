import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";
import { PRE_SEEDED_MOVIES, fetchFromTmdb, mapTmdbMovie } from "./_lib/movies-data";

const MOOD_STOP_WORDS = new Set([
  "a","an","and","are","be","but","by","for","from","i","im","in","into","is",
  "it","its","like","me","movie","movies","my","of","on","or","show","something",
  "that","the","this","to","want","watch","with",
]);

const MOOD_SYNONYMS: Record<string, string[]> = {
  breakup: ["heartbreak","romance","melancholic","lonely","poetic","drama"],
  broken: ["heartbreak","melancholic","drama"],
  lonely: ["melancholic","poetic","drama","solitude"],
  love: ["romance","poetic","drama","intimate"],
  romantic: ["romance","poetic","drama","dreamy"],
  heartbreak: ["breakup","melancholic","romance","drama"],
  horror: ["fear","dark","thriller","mystery","surreal"],
  scary: ["horror","dark","thriller"],
  creepy: ["horror","mystery","dark","surreal"],
  suspense: ["thriller","mystery","noir","dark"],
  thriller: ["suspense","mystery","noir","dark"],
  noir: ["thriller","mystery","dark","crime"],
  cyberpunk: ["sci-fi","tech","neon","future","thriller"],
  futuristic: ["sci-fi","cyberpunk","tech","future"],
  "sci-fi": ["cyberpunk","future","tech","mystery"],
  nostalgic: ["retro","cinema","poetic","historical"],
  retro: ["nostalgic","cinema","poetic"],
  cozy: ["warm","gentle","poetic","dreamy"],
  sad: ["melancholic","drama","poetic","solitude"],
  melancholic: ["sad","poetic","drama","solitude"],
  happy: ["uplifting","adventure","dreamy"],
  uplifting: ["hopeful","adventure","dreamy"],
  surreal: ["dreamy","fantasy","experimental","visuals"],
  artistic: ["art","experimental","visuals","cinematography"],
  visual: ["visuals","cinematography","art","experimental"],
  atmospheric: ["moody","poetic","mystery","visuals"],
};

const MOVIE_KEYWORDS: Record<string, string[]> = {
  "chronos-unbound": ["sci-fi","mystery","noir","haunting","futuristic","dark","architect","memory"],
  "eternity-beyond": ["romance","melancholic","sci-fi","thriller","heartbreak","memory","moody","neo-noir"],
  "nocturnal-syndicate": ["cyberpunk","action","mystery","dark","neon","rebellion","thriller","gritty"],
  "the-silence-of-stone": ["lonely","solitude","minimalist","drama","art house","quiet","introspective","melancholic"],
  "the-crimson-silence": ["romance","fantasy","indie","poetic","dreamy","fashion","desert","moody"],
  "techno-lens": ["documentary","tech","retro","nostalgic","cinematography","analog","digital"],
  "veils-of-void": ["experimental","surreal","visuals","art","abstract","silent","dreamy"],
  "system-override": ["cyberpunk","thriller","mind-bend","tech","future","dark","glitch","sci-fi"],
  "the-neon-desert": ["sci-fi","cinematic","art house","visuals","desert","dreamy","atmospheric"],
  "velvet-shadows": ["nostalgic","retro","cinema","historical","poetic","lonely","melancholic"],
  "cinematheque": ["cinematography","art house","experimental","visuals","film","retro","poetic"],
  "crimson-convertible": ["adventure","indie","poetic","road trip","freedom","night","nostalgic"],
  "woman-underwater": ["surreal","fantasy","drama","dreamy","romantic","poetic","melancholic"],
  "brutalist-stairs": ["thriller","mystery","minimalist","dark","suspense","architectural","moody"],
};

function buildMovieSearchText(movie: any) {
  return [movie.title, movie.tagline || "", movie.overview, movie.director, movie.language, ...movie.genres, ...(MOVIE_KEYWORDS[movie.id] || [])]
    .join(" ").toLowerCase();
}

function scoreMovie(movie: any, keywords: string[]) {
  const searchable = buildMovieSearchText(movie);
  let score = 0;
  for (const keyword of keywords) {
    const lk = keyword.toLowerCase();
    if (movie.genres.some((g: string) => g.toLowerCase() === lk)) { score += 12; continue; }
    if ((MOVIE_KEYWORDS[movie.id] || []).some((k: string) => k.toLowerCase() === lk)) { score += 10; continue; }
    if (movie.genres.some((g: string) => g.toLowerCase().includes(lk))) score += 8;
    if ((MOVIE_KEYWORDS[movie.id] || []).some((k: string) => k.toLowerCase().includes(lk))) score += 7;
    if (movie.title.toLowerCase().includes(lk)) score += 6;
    if ((movie.tagline || "").toLowerCase().includes(lk)) score += 4;
    if (movie.overview.toLowerCase().includes(lk)) score += 3;
    if (searchable.includes(lk)) score += 1;
  }
  return score;
}

function tokenizeMood(mood: string) {
  const base = mood.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/)
    .map((t) => t.trim()).filter((t) => t.length > 1 && !MOOD_STOP_WORDS.has(t));
  const expanded = new Set(base);
  for (const token of base) for (const syn of MOOD_SYNONYMS[token] || []) expanded.add(syn);
  return [...expanded];
}

function findLocalMoodMatch(mood: string) {
  const keywords = tokenizeMood(mood);
  const ranked = PRE_SEEDED_MOVIES
    .map((m) => ({ movie: m, score: scoreMovie(m, keywords), matched: keywords.filter((k) => buildMovieSearchText(m).includes(k)) }))
    .sort((a, b) => b.score - a.score || b.movie.popularity - a.movie.popularity);

  const best = ranked[0];
  if (!best) return null;
  const movie = best.score > 0 ? best.movie : PRE_SEEDED_MOVIES[0];
  const kw = best.score > 0 ? best.matched : movie.genres.slice(0, 2).map((g) => g.toLowerCase());
  const keywordText = kw.length > 0 ? kw.join(", ") : movie.genres.slice(0, 2).join(", ");
  return {
    matchedMovieId: movie.id,
    reasoning: `You asked for ${mood.trim()}, so this match leans into ${keywordText}. "${movie.title}" fits through its ${movie.genres.join(", ").toLowerCase()} texture and the mood already present in its story world.`,
  };
}

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("GEMINI_API_KEY environment variable is not defined.");
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { mood } = req.body;
    if (!mood || typeof mood !== "string" || !mood.trim()) {
      return res.status(400).json({ error: "Mood input is required." });
    }

    const ai = getAiClient();
    const tmdbApiKey = process.env.TMDB_API_KEY;

    if (tmdbApiKey && tmdbApiKey.trim() !== "") {
      try {
        const systemInstruction = `You are a world-class cinematic recommendation AI for Cine-Stream.\nAnalyze the user's mood and recommend a real movie search direction.\nReturn strict JSON with:\n1. searchQuery: a specific movie title or tightly focused search phrase for TMDB.\n2. reasoning: a poetic, personalized explanation in 2-3 sentences.`;
        const prompt = `The user mood is: "${mood}". Generate a strong TMDB search query and a short personalized reasoning.`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["searchQuery", "reasoning"],
              properties: { searchQuery: { type: Type.STRING }, reasoning: { type: Type.STRING } },
            },
          },
        });
        const aiResponse = JSON.parse(response.text?.trim() || "{}");
        const searchQuery = typeof aiResponse.searchQuery === "string" ? aiResponse.searchQuery : "";
        const reasoning = typeof aiResponse.reasoning === "string" ? aiResponse.reasoning : "";
        if (searchQuery && reasoning) {
          const searchData = await fetchFromTmdb("/search/movie", { query: searchQuery, page: "1", include_adult: "false" });
          if (searchData.results && searchData.results.length > 0) {
            return res.json({ matchedMovieId: "none", reasoning, newMovie: mapTmdbMovie(searchData.results[0]) });
          }
        }
      } catch (err: any) {
        console.warn("Gemini TMDB recommendation failed, falling back to local matching:", err);
      }
    }

    try {
      const movieCandidates = PRE_SEEDED_MOVIES.map((m) => ({ id: m.id, title: m.title, overview: m.overview, genres: m.genres, director: m.director }));
      const systemInstruction = `You are a premium movie recommendation AI for Cine-Stream.\nChoose the single best movie from the provided catalog for the user's mood.\nReturn strict JSON with:\n1. matchedMovieId: exact id from the provided list\n2. reasoning: a cinematic, warm explanation in 2-3 sentences`;
      const prompt = `The user's mood is: "${mood}".\nMovie catalog:\n${JSON.stringify(movieCandidates, null, 2)}\n\nReturn the best match in JSON only.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["matchedMovieId", "reasoning"],
            properties: { matchedMovieId: { type: Type.STRING }, reasoning: { type: Type.STRING } },
          },
        },
      });
      const rec = JSON.parse(response.text?.trim() || "{}");
      const matchedMovieId = typeof rec.matchedMovieId === "string" ? rec.matchedMovieId : "";
      const reasoning = typeof rec.reasoning === "string" ? rec.reasoning : "";
      if (matchedMovieId && reasoning && PRE_SEEDED_MOVIES.some((m) => m.id === matchedMovieId)) {
        return res.json({ matchedMovieId, reasoning });
      }
    } catch (err: any) {
      console.warn("Gemini local recommendation failed, falling back to keyword matching:", err);
    }

    const fallback = findLocalMoodMatch(mood);
    if (!fallback) return res.status(404).json({ error: "No suitable movie match was found." });
    return res.json(fallback);
  } catch (error: any) {
    console.error("Mood Match Error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred during mood matching." });
  }
}
