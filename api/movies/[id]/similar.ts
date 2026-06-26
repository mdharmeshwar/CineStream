import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PRE_SEEDED_MOVIES, fetchFromTmdb, mapTmdbMovie } from "../../_lib/movies-data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;
    const movieId = id as string;
    const tmdbApiKey = process.env.TMDB_API_KEY;

    if (movieId && movieId.startsWith("tmdb-") && tmdbApiKey && tmdbApiKey.trim() !== "") {
      const tmdbId = parseInt(movieId.replace("tmdb-", ""), 10);
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

    const currentMovie = PRE_SEEDED_MOVIES.find((m) => m.id === movieId);
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
    return res.status(500).json({ error: err.message });
  }
}
