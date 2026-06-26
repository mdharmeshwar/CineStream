import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PRE_SEEDED_MOVIES, fetchFromTmdb, mapTmdbMovie } from "../_lib/movies-data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;
    const movieId = id as string;

    if (movieId && movieId.startsWith("tmdb-")) {
      const tmdbId = parseInt(movieId.replace("tmdb-", ""), 10);
      if (!isNaN(tmdbId)) {
        try {
          const details = await fetchFromTmdb(`/movie/${tmdbId}`, { append_to_response: "credits,videos" });
          return res.json(mapTmdbMovie(details));
        } catch (tmdbErr: any) {
          console.error(`Failed to fetch TMDB details for ID ${tmdbId}:`, tmdbErr);
          try {
            const basic = await fetchFromTmdb(`/movie/${tmdbId}`);
            return res.json(mapTmdbMovie(basic));
          } catch {
            return res.status(500).json({ error: "Failed to fetch movie details." });
          }
        }
      }
    }

    const foundLocal = PRE_SEEDED_MOVIES.find((m) => m.id === movieId);
    if (foundLocal) return res.json(foundLocal);

    return res.status(404).json({ error: "Film profile not found in archives." });
  } catch (err: any) {
    console.error("Detail lookup error:", err);
    return res.status(500).json({ error: err.message });
  }
}
