import { FC, MouseEvent, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Movie } from "../data/movies";

interface MovieCardProps {
  movie: Movie;
  isFavorited: boolean;
  onToggleFavorite: (e: MouseEvent, movie: Movie) => void;
  onClick: () => void;
}

export const MovieCard: FC<MovieCardProps> = ({ movie, isFavorited, onToggleFavorite, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      id={`movie-card-${movie.id}`}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-[#1A1A1C] transition-all duration-500 hover:border-brand-crimson/50 hover:shadow-[0_8px_30px_rgb(229,9,20,0.15)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-crimson light:border-zinc-200/80 light:bg-white light:hover:border-brand-crimson/40 flex flex-col"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 light:bg-zinc-100 shrink-0">
        {!imageLoaded && <div className="absolute inset-0 shimmer" aria-hidden="true" />}
        <img
          src={movie.posterUrl}
          alt={`Poster of ${movie.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1 pointer-events-none z-10">
          {movie.isCustom && (
            <span className="rounded bg-brand-crimson px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wide text-white uppercase">
              AI Match
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        <button
          id={`favorite-btn-${movie.id}`}
          type="button"
          onClick={(e) => onToggleFavorite(e, movie)}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-brand-crimson/20 active:scale-95 group/heart"
          aria-label={isFavorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-transform duration-300 group-hover/heart:scale-115 ${isFavorited ? "fill-brand-crimson text-brand-crimson" : "text-zinc-300 group-hover/heart:text-white"}`}
          />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 text-white light:text-zinc-900">
        <div className="font-bold text-xs truncate group-hover:text-brand-crimson transition-colors duration-300">
          {movie.title}
        </div>
        <div className="text-[10px] text-gray-500 light:text-zinc-500 font-sans flex items-center justify-between">
          <span>{movie.releaseYear} • {movie.genres[0]}</span>
          <span className="text-[9px] font-mono text-gray-600">{movie.duration} min</span>
        </div>
      </div>
    </div>
  );
};
