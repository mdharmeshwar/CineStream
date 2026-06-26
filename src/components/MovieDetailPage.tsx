import { FC, useState, useEffect, useRef } from "react";
import { ArrowLeft, Star, Clock, Calendar, Heart, Play, Loader2, Film } from "lucide-react";
import { Movie } from "../data/movies";
import { MovieCard } from "./MovieCard";

interface MovieDetailPageProps {
  movie: Movie;
  onBack: () => void;
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
}

export const MovieDetailPage: FC<MovieDetailPageProps> = ({ movie, onBack, favorites, onToggleFavorite, onMovieSelect }) => {
  const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const isFavorited = favorites.some((f) => f.id === movie.id);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  }, [movie.id]);

  useEffect(() => {
    setDetailedMovie(null);
    setIsPlayingTrailer(false);
    setIsLoadingDetails(true);

    fetch(`/api/movies/${movie.id}`)
      .then((res) => { if (!res.ok) throw new Error("Failed to fetch movie details"); return res.json(); })
      .then((data) => { setDetailedMovie(data); setIsLoadingDetails(false); })
      .catch(() => { setIsLoadingDetails(false); });

    setIsLoadingSimilar(true);
    fetch(`/api/movies/${movie.id}/similar`)
      .then((res) => { if (!res.ok) throw new Error("Failed to fetch similar movies"); return res.json(); })
      .then((data) => { setSimilarMovies(data.movies || []); setIsLoadingSimilar(false); })
      .catch(() => { setIsLoadingSimilar(false); });
  }, [movie.id]);

  const activeMovie = detailedMovie || movie;
  const trailerCode = activeMovie.youtubeId || "ScMzIvxBSi4";

  return (
    <div ref={topRef} className="animate-fade-in space-y-12 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 light:border-zinc-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider font-semibold text-zinc-300 hover:text-white uppercase bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 cursor-pointer light:bg-zinc-100 light:text-zinc-700 light:hover:bg-zinc-200 light:border-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discoveries</span>
        </button>
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
          Cinema Stream • Archival Record #{activeMovie.id}
        </span>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0A0A0B] border border-white/10 shadow-2xl light:border-zinc-200">
        {isPlayingTrailer ? (
          <div className="aspect-video w-full h-[45vh] min-h-[280px] max-h-[480px] bg-black relative">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerCode}?autoplay=1&rel=0&modestbranding=1`}
              title={`${activeMovie.title} Official Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setIsPlayingTrailer(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand-crimson transition-all duration-300 active:scale-95 border border-white/10 cursor-pointer"
              title="Close Trailer Player"
            >
              <span className="text-sm font-sans font-bold">✕</span>
            </button>
          </div>
        ) : (
          <div className="relative h-[45vh] min-h-[280px] max-h-[480px] w-full">
            <img
              src={activeMovie.backdropUrl}
              alt={`${activeMovie.title} backdrop`}
              className="h-full w-full object-cover opacity-50 transition-all duration-700 hover:scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/75 to-transparent light:from-white light:via-white/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent light:from-white light:via-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson text-white border border-brand-crimson/30 shadow-[0_0_30px_rgba(229,9,20,0.5)] cursor-pointer transition-transform duration-300 hover:scale-110 hover:bg-brand-crimson-hover active:scale-95"
                title="Play Trailer Direct"
              >
                <Play className="h-7 w-7 fill-white translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 light:border-zinc-200">
            <img
              src={activeMovie.posterUrl}
              alt={`${activeMovie.title} poster`}
              className="w-full object-cover aspect-[2/3] hover:scale-101 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="p-6 rounded-2xl bg-[#111215] border border-white/5 space-y-4 light:bg-white light:border-zinc-200 light:shadow-sm">
            <h3 className="font-display font-medium text-xs tracking-wider uppercase text-zinc-400 light:text-zinc-500">
              Archival Metadata
            </h3>
            <div className="space-y-3.5 text-xs font-mono text-zinc-300 light:text-zinc-600">
              <div className="flex justify-between items-center py-2 border-b border-white/5 light:border-zinc-100">
                <span className="text-zinc-500">Director</span>
                <span className="font-medium text-white light:text-zinc-900 flex items-center gap-1.5">
                  {activeMovie.director}
                  {isLoadingDetails && activeMovie.director === "Unknown Director" && (
                    <Loader2 className="h-3 w-3 animate-spin text-brand-crimson" />
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 light:border-zinc-100">
                <span className="text-zinc-500">Duration</span>
                <span className="font-medium text-white light:text-zinc-900">{activeMovie.duration} minutes</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 light:border-zinc-100">
                <span className="text-zinc-500">Release Date</span>
                <span className="font-medium text-white light:text-zinc-900">{activeMovie.releaseDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 light:border-zinc-100">
                <span className="text-zinc-500">Language Code</span>
                <span className="font-medium text-white light:text-zinc-900">{activeMovie.language}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500">Popularity Weight</span>
                <span className="font-medium text-amber-400">{activeMovie.popularity.toFixed(1)} Pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {activeMovie.isCustom && (
                <span className="rounded bg-brand-crimson px-2.5 py-0.5 text-[9px] font-mono tracking-widest font-bold uppercase text-white">
                  AI Custom Match
                </span>
              )}
              {activeMovie.genres.map((genre) => (
                <span key={genre} className="rounded bg-white/10 px-3 py-1 text-[10px] font-mono tracking-wider text-zinc-300 light:bg-zinc-100 light:text-zinc-700">
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white light:text-zinc-950 tracking-tight leading-none">
              {activeMovie.title}
            </h1>

            {activeMovie.tagline && (
              <p className="font-serif italic text-zinc-400 light:text-zinc-500 text-lg md:text-xl">
                "{activeMovie.tagline}"
              </p>
            )}

            <div className="flex items-center gap-4 text-sm font-sans text-zinc-400 light:text-zinc-500">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 light:bg-zinc-100 light:border-zinc-200">
                <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white light:text-zinc-900">{activeMovie.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-500">/ 10</span>
              </div>
              <span>Based on {activeMovie.voteCount} reviews</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-y border-white/10 py-6 light:border-zinc-200">
            <a
              href={`https://www.youtube.com/watch?v=${trailerCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-brand-crimson hover:bg-brand-crimson-hover text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-brand-crimson/25 cursor-pointer active:scale-95 transition-all duration-300 no-underline"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>Watch Trailer YouTube</span>
            </a>

            <button
              onClick={() => onToggleFavorite(activeMovie)}
              className={`flex items-center gap-2 rounded-xl border text-sm px-6 py-3.5 font-bold transition-all duration-300 active:scale-95 cursor-pointer ${isFavorited ? "border-brand-crimson bg-brand-crimson/10 text-brand-crimson" : "border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-800/40 light:border-zinc-300 light:text-zinc-700 light:hover:bg-zinc-100"}`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-brand-crimson" : ""}`} />
              <span>{isFavorited ? "In Studio Library" : "Save to Library"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-white light:text-zinc-900 tracking-tight">
              Plot Synopsis & Directorial Vision
            </h3>
            <p className="font-sans text-zinc-300 light:text-zinc-600 leading-relaxed font-normal text-base md:text-lg">
              {activeMovie.overview}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-8 pt-10 border-t border-white/10 light:border-zinc-200">
        <div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white light:text-zinc-950 tracking-tight leading-snug flex items-center gap-2.5">
            <Film className="h-6 w-6 text-brand-crimson" />
            <span>SIMILAR TITLES YOU MIGHT ENJOY</span>
          </h2>
          <p className="text-zinc-500 light:text-zinc-500 text-[10px] font-mono tracking-wide mt-1 uppercase">
            Recommended recommendations tailored dynamically based on genres & type
          </p>
        </div>

        {isLoadingSimilar ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] w-full rounded-xl shimmer" />
                <div className="h-4 w-3/4 rounded bg-zinc-800 light:bg-zinc-200 shimmer" />
                <div className="h-3 w-1/2 rounded bg-zinc-800 light:bg-zinc-200 shimmer" />
              </div>
            ))}
          </div>
        ) : similarMovies.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
            No related titles found in archives.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {similarMovies.map((simMovie) => (
              <MovieCard
                key={simMovie.id}
                movie={simMovie}
                isFavorited={favorites.some((f) => f.id === simMovie.id)}
                onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(simMovie); }}
                onClick={() => onMovieSelect(simMovie)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
