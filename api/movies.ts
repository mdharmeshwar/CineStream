import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PRE_SEEDED_MOVIES, GENRE_TO_TMDB_ID, TMDB_GENRES_MAP, fetchFromTmdb, mapTmdbMovie } from "./_lib/movies-data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
                return name && name.toLowerCase() === (genre as string).toLowerCase();
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
      filtered = filtered.filter((m) => m.genres.some((g) => g.toLowerCase() === (genre as string).toLowerCase()));
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
    return res.json({ movies: paginated, total: filtered.length, page: pageNum, hasMore });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
