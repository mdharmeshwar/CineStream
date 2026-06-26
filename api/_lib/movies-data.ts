import { PRE_SEEDED_MOVIES, Movie } from "../../src/data/movies";

export { PRE_SEEDED_MOVIES };
export type { Movie };

export const TMDB_GENRES_MAP: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

export const GENRE_TO_TMDB_ID: { [key: string]: number } = {
  "Sci-Fi": 878, "Thriller": 53, "Drama": 18, "Mystery": 9648, "Noir": 80,
  "Cyberpunk": 878, "Documentary": 99, "Experimental": 18, "Art House": 18,
  "Minimalist": 18, "Surreal": 14,
};

export async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
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

export function mapTmdbMovie(tmdbMovie: any): Movie {
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

  const posterUrl = tmdbMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
    : PRE_SEEDED_MOVIES[0].posterUrl;
  const backdropUrl = tmdbMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`
    : PRE_SEEDED_MOVIES[0].backdropUrl;

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
