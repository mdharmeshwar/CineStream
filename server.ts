import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PRE_SEEDED_MOVIES, Movie } from "./src/data/movies";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("GEMINI_API_KEY environment variable is not defined.");
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

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

function tokenizeMood(mood: string) {
  const baseTokens = mood
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !MOOD_STOP_WORDS.has(t));

  const expanded = new Set(baseTokens);
  for (const token of baseTokens) {
    for (const syn of MOOD_SYNONYMS[token] || []) expanded.add(syn);
  }
  return [...expanded];
}

function buildMovieSearchText(movie: Movie) {
  return [movie.title, movie.tagline || "", movie.overview, movie.director, movie.language, ...movie.genres, ...(MOVIE_KEYWORDS[movie.id] || [])]
    .join(" ")
    .toLowerCase();
}

function scoreMovieAgainstKeywords(movie: Movie, keywords: string[]) {
  const searchable = buildMovieSearchText(movie);
  let score = 0;
  for (const keyword of keywords) {
    const lk = keyword.toLowerCase();
    if (movie.genres.some((g) => g.toLowerCase() === lk)) { score += 12; continue; }
    if ((MOVIE_KEYWORDS[movie.id] || []).some((k) => k.toLowerCase() === lk)) { score += 10; continue; }
    if (movie.genres.some((g) => g.toLowerCase().includes(lk))) score += 8;
    if ((MOVIE_KEYWORDS[movie.id] || []).some((k) => k.toLowerCase().includes(lk))) score += 7;
    if (movie.title.toLowerCase().includes(lk)) score += 6;
    if ((movie.tagline || "").toLowerCase().includes(lk)) score += 4;
    if (movie.overview.toLowerCase().includes(lk)) score += 3;
    if (searchable.includes(lk)) score += 1;
  }
  return score;
}

function buildKeywordReasoning(mood: string, movie: Movie, matchedKeywords: string[]) {
  const keywordText = matchedKeywords.length > 0 ? matchedKeywords.join(", ") : movie.genres.slice(0, 2).join(", ");
  return `You asked for ${mood.trim()}, so this match leans into ${keywordText}. "${movie.title}" fits through its ${movie.genres.join(", ").toLowerCase()} texture and the mood already present in its story world.`;
}

function findLocalMoodMatch(mood: string) {
  const keywords = tokenizeMood(mood);
  const ranked = PRE_SEEDED_MOVIES
    .map((movie) => ({
      movie,
      score: scoreMovieAgainstKeywords(movie, keywords),
      matchedKeywords: keywords.filter((k) => buildMovieSearchText(movie).includes(k)),
    }))
    .sort((a, b) => b.score - a.score || b.movie.popularity - a.movie.popularity);

  const best = ranked[0];
  if (!best) return null;

  const fallbackMovie = best.score > 0 ? best.movie : PRE_SEEDED_MOVIES[0];
  const matchedKeywords = best.score > 0 ? best.matchedKeywords : fallbackMovie.genres.slice(0, 2).map((g) => g.toLowerCase());
  return { matchedMovieId: fallbackMovie.id, reasoning: buildKeywordReasoning(mood, fallbackMovie, matchedKeywords) };
}

const TMDB_GENRES_MAP: { [key: number]: string } = {
  28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",
  18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",
  9648:"Mystery",10749:"Romance",878:"Sci-Fi",10770:"TV Movie",53:"Thriller",10752:"War",37:"Western",
};

const GENRE_TO_TMDB_ID: { [key: string]: number } = {
  "Sci-Fi":878,"Thriller":53,"Drama":18,"Mystery":9648,"Noir":80,
  "Cyberpunk":878,"Documentary":99,"Experimental":18,"Art House":18,"Minimalist":18,"Surreal":14,
};

async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (!apiKey) throw new Error("TMDB_API_KEY is not configured.");

  const normalizedApiKey = apiKey.replace(/^Bearer\s+/i, "");
  const isV4 = normalizedApiKey.length > 50;
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (isV4) {
    headers["Authorization"] = `Bearer ${normalizedApiKey}`;
  } else {
    params["api_key"] = normalizedApiKey;
  }

  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`TMDB API Error: ${response.status} - ${text}`);
  }
  return response.json();
}

async function fetchMovieWithCredits(movieId: number) {
  return fetchFromTmdb(`/movie/${movieId}`, { append_to_response: "credits,videos" });
}

function mapTmdbMovie(tmdbMovie: any): Movie {
  const genres = (tmdbMovie.genres || tmdbMovie.genre_ids || [])
    .map((g: any) => {
      if (typeof g === "object" && g.name) return g.name;
      if (typeof g === "number") return TMDB_GENRES_MAP[g];
      return null;
    })
    .filter(Boolean) as string[];

  if (genres.length === 0) genres.push("Drama");

  let director = "Unknown Director";
  if (tmdbMovie.credits?.crew) {
    const dirObj = tmdbMovie.credits.crew.find((m: any) => m.job === "Director");
    if (dirObj) director = dirObj.name;
  }

  const posterUrl = tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : PRE_SEEDED_MOVIES[0].posterUrl;
  const backdropUrl = tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}` : PRE_SEEDED_MOVIES[0].backdropUrl;
  const releaseDate = tmdbMovie.release_date || "Unknown";
  let releaseYear = 2024;
  if (releaseDate && releaseDate !== "Unknown") {
    const parts = releaseDate.split("-");
    if (parts[0]) releaseYear = parseInt(parts[0], 10) || 2024;
  }

  let youtubeId: string | undefined;
  if (tmdbMovie.videos?.results && Array.isArray(tmdbMovie.videos.results)) {
    const trailer = tmdbMovie.videos.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
    if (trailer) {
      youtubeId = trailer.key;
    } else {
      const anyVideo = tmdbMovie.videos.results.find((v: any) => v.site === "YouTube");
      if (anyVideo) youtubeId = anyVideo.key;
    }
  }

  return {
    id: `tmdb-${tmdbMovie.id}`,
    title: tmdbMovie.title || tmdbMovie.original_title || "Untitled Film",
    tagline: tmdbMovie.tagline || (genres.length > 0 ? `${genres[0]} • Now Playing` : "Now Playing"),
    overview: tmdbMovie.overview || "No overview available for this title.",
    posterUrl,
    backdropUrl,
    rating: tmdbMovie.vote_average || 0,
    voteCount: tmdbMovie.vote_count || 0,
    popularity: tmdbMovie.popularity || 0,
    releaseYear,
    releaseDate,
    duration: tmdbMovie.runtime || 120,
    director,
    genres,
    language: tmdbMovie.original_language ? tmdbMovie.original_language.toUpperCase() : "EN",
    youtubeId,
  };
}

app.get("/api/movies", async (req, res) => {
  try {
    const { genre, search, page = "1", limit = "6" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 6;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    if (tmdbApiKey && tmdbApiKey.trim() !== "") {
      try {
        let tmdbResults: any[] = [];
        let totalResults = 0;
        let hasMore = false;

        if (search && typeof search === "string" && search.trim() !== "") {
          const data = await fetchFromTmdb("/search/movie", { query: search, page: pageNum.toString(), include_adult: "false" });
          tmdbResults = data.results || [];
          totalResults = data.total_results || 0;
          hasMore = pageNum < (data.total_pages || 1);

          if (genre && typeof genre === "string" && genre !== "All") {
            const mappedGenreId = GENRE_TO_TMDB_ID[genre];
            if (mappedGenreId) {
              tmdbResults = tmdbResults.filter((m: any) => m.genre_ids && m.genre_ids.includes(mappedGenreId));
            } else {
              tmdbResults = tmdbResults.filter((m: any) => m.genre_ids && m.genre_ids.some((id: number) => {
                const name = TMDB_GENRES_MAP[id];
                return name && name.toLowerCase() === genre.toLowerCase();
              }));
            }
          }
        } else {
          const params: Record<string, string> = { page: pageNum.toString(), sort_by: "popularity.desc", include_adult: "false" };
          if (genre && typeof genre === "string" && genre !== "All") {
            const mappedGenreId = GENRE_TO_TMDB_ID[genre];
            if (mappedGenreId) params["with_genres"] = mappedGenreId.toString();
          }
          const data = await fetchFromTmdb("/discover/movie", params);
          tmdbResults = data.results || [];
          totalResults = data.total_results || 0;
          hasMore = pageNum < (data.total_pages || 1);
        }

        const sliced = tmdbResults.slice(0, limitNum);
        const detailedMovies = sliced.map((m: any) => mapTmdbMovie(m));
        return res.json({ movies: detailedMovies, total: totalResults, page: pageNum, hasMore });
      } catch (tmdbError: any) {
        console.error("TMDB integration failed, falling back to pre-seeded list:", tmdbError);
      }
    }

    let filtered = [...PRE_SEEDED_MOVIES];
    if (genre && typeof genre === "string" && genre !== "All") {
      filtered = filtered.filter((m) => m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()));
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginated = filtered.slice(startIndex, endIndex);
    const hasMore = endIndex < filtered.length;
    res.json({ movies: paginated, total: filtered.length, page: pageNum, hasMore });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id && id.startsWith("tmdb-")) {
      const tmdbId = parseInt(id.replace("tmdb-", ""), 10);
      if (!isNaN(tmdbId)) {
        try {
          const details = await fetchMovieWithCredits(tmdbId);
          return res.json(mapTmdbMovie(details));
        } catch (tmdbErr: any) {
          console.error(`Failed to fetch TMDB details for ID ${tmdbId}:`, tmdbErr);
          const basic = await fetchFromTmdb(`/movie/${tmdbId}`);
          return res.json(mapTmdbMovie(basic));
        }
      }
    }
    const foundLocal = PRE_SEEDED_MOVIES.find((m) => m.id === id);
    if (foundLocal) return res.json(foundLocal);
    res.status(404).json({ error: "Film profile not found in archives." });
  } catch (err: any) {
    console.error("Detail lookup error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/movies/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    if (id && id.startsWith("tmdb-") && tmdbApiKey && tmdbApiKey.trim() !== "") {
      const tmdbId = parseInt(id.replace("tmdb-", ""), 10);
      if (!isNaN(tmdbId)) {
        try {
          const data = await fetchFromTmdb(`/movie/${tmdbId}/similar`, { page: "1" });
          const mapped = (data.results || []).slice(0, 6).map((m: any) => mapTmdbMovie(m));
          return res.json({ movies: mapped });
        } catch (tmdbErr: any) {
          console.error(`Failed to fetch TMDB similar movies for ID ${tmdbId}:`, tmdbErr);
        }
      }
    }

    const currentMovie = PRE_SEEDED_MOVIES.find((m) => m.id === id);
    let pool = PRE_SEEDED_MOVIES;
    if (currentMovie) {
      pool = PRE_SEEDED_MOVIES.filter((m) => m.id !== currentMovie.id);
      const matches = pool.filter((m) => m.genres.some((g) => currentMovie.genres.includes(g)));
      if (matches.length >= 3) pool = matches;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return res.json({ movies: shuffled.slice(0, 6) });
  } catch (err: any) {
    console.error("Similar movies lookup error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/mood-match", async (req, res) => {
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
            const bestMatch = mapTmdbMovie(searchData.results[0]);
            return res.json({ matchedMovieId: "none", reasoning, newMovie: bestMatch });
          }
        }
      } catch (tmdbAiError: any) {
        console.warn("Gemini TMDB recommendation failed, falling back to local matching:", tmdbAiError);
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
      const recommendation = JSON.parse(response.text?.trim() || "{}");
      const matchedMovieId = typeof recommendation.matchedMovieId === "string" ? recommendation.matchedMovieId : "";
      const reasoning = typeof recommendation.reasoning === "string" ? recommendation.reasoning : "";
      if (matchedMovieId && reasoning && PRE_SEEDED_MOVIES.some((m) => m.id === matchedMovieId)) {
        return res.json({ matchedMovieId, reasoning });
      }
    } catch (geminiLocalError: any) {
      console.warn("Gemini local recommendation failed, falling back to keyword matching:", geminiLocalError);
    }

    const fallback = findLocalMoodMatch(mood);
    if (!fallback) return res.status(404).json({ error: "No suitable movie match was found." });
    res.json(fallback);
  } catch (error: any) {
    console.error("Mood Match Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during mood matching." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
