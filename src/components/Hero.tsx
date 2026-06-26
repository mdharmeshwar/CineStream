import { FC, useState, useEffect, useRef } from "react";
import { Play, Heart, Star, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../data/movies";

interface HeroProps {
  movies: Movie[];
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
  onExploreMovie: (movie: Movie) => void;
}

export const Hero: FC<HeroProps> = ({ movies, favorites, onToggleFavorite, onExploreMovie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => handleNext(), 5000);
  };

  useEffect(() => {
    if (movies.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [movies, currentIndex]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const isFavorited = favorites.some((m) => m.id === currentMovie.id);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => { setCurrentIndex((prev) => (prev + 1) % movies.length); setIsTransitioning(false); }, 300);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => { setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length); setIsTransitioning(false); }, 300);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => { setCurrentIndex(index); setIsTransitioning(false); }, 300);
  };

  return (
    <section
      id="hero-carousel"
      className="relative w-full h-[70vh] min-h-[420px] max-h-[640px] overflow-hidden rounded-2xl bg-[#0A0A0B] border border-white/10 shadow-2xl transition-all duration-300 light:border-zinc-200 group"
    >
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdropUrl}
          alt={`Featured backdrop for ${currentMovie.title}`}
          className={`h-full w-full object-cover opacity-50 transition-all duration-700 scale-102 hover:scale-105 ${isTransitioning ? "opacity-0 scale-98" : "opacity-50"}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent light:from-white/95 light:via-white/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent light:from-white light:via-white/30" />
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-end px-8 py-10 md:p-14 lg:p-16 z-10 text-white light:text-zinc-900 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
      >
        <div className="max-w-2xl">
          {currentMovie.tagline && (
            <span className="inline-block rounded bg-brand-crimson px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-white uppercase mb-4">
              {currentMovie.tagline}
            </span>
          )}

          <h1 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white light:text-zinc-950 tracking-tight leading-none">
            {currentMovie.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-300 light:text-zinc-600 font-sans">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white light:text-zinc-900">{currentMovie.rating.toFixed(1)}</span>
              <span>({currentMovie.voteCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{currentMovie.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{currentMovie.releaseYear}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300 light:bg-zinc-200 light:text-zinc-700">
                {currentMovie.genres[0]}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-300 light:text-zinc-600 leading-relaxed font-sans font-normal line-clamp-2">
            {currentMovie.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-3.5">
            <button
              id="hero-explore-btn"
              onClick={() => onExploreMovie(currentMovie)}
              className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 flex items-center gap-2 text-sm transition-all duration-300 cursor-pointer active:scale-95"
            >
              <Play className="h-4.5 w-4.5 fill-black" />
              <span>Explore Profile</span>
            </button>

            <button
              id="hero-favorite-btn"
              onClick={() => onToggleFavorite(currentMovie)}
              className={`px-8 py-3 rounded font-bold border text-sm transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 ${isFavorited ? "border-brand-crimson bg-brand-crimson/20 text-white" : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"}`}
            >
              <Heart className={`h-4.5 w-4.5 ${isFavorited ? "fill-brand-crimson text-brand-crimson" : ""}`} />
              <span>{isFavorited ? "In Library" : "Add to Library"}</span>
            </button>
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {movies.length > 1 && (
        <div className="absolute bottom-6 right-8 md:right-14 lg:right-16 z-20 flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? "w-6 bg-brand-crimson" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
