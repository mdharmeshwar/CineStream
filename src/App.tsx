import { MouseEvent, useState, useEffect, useRef } from "react";
import { Search, Heart, RefreshCw, Flame, HelpCircle, Loader2 } from "lucide-react";
import { ThemeProvider } from "./components/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MoodMatcher } from "./components/MoodMatcher";
import { MovieCard } from "./components/MovieCard";
import { MovieDetailPage } from "./components/MovieDetailPage";
import { Footer } from "./components/Footer";
import { Movie, GENRE_PRESETS } from "./data/movies";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"home" | "favorites">("home");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("cine-stream-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("cine-stream-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchMoviesList = async (pageNum: number, genre: string, search: string, isAppend: boolean) => {
    try {
      if (!isAppend) {
        setIsLoading(true);
      } else {
        setIsInfiniteLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "6",
        genre,
        search,
      });

      const response = await fetch(`/api/movies?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Unable to retrieve films from server database.");
      }

      const data = await response.json();

      setMovies((prev) => (isAppend ? [...prev, ...data.movies] : data.movies));
      setHasMore(data.hasMore);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while contacting our server.");
    } finally {
      setIsLoading(false);
      setIsInfiniteLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMoviesList(1, selectedGenre, searchQuery, false);
  }, [selectedGenre, searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchMoviesList(page, selectedGenre, searchQuery, true);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isInfiniteLoading && currentTab === "home") {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isInfiniteLoading, currentTab]);

  const handleToggleFavorite = (e: MouseEvent | null, movie: Movie) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites((prev) => {
      const isAlreadyFav = prev.some((m) => m.id === movie.id);
      if (isAlreadyFav) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleScrollToMoodSection = () => {
    setCurrentTab("home");
    setTimeout(() => {
      const section = document.getElementById("ai-mood-matcher-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-brand-dark text-zinc-300 flex flex-col transition-colors duration-300 light:bg-[#FAF9F6] light:text-zinc-700">
        <Navbar
          currentTab={currentTab}
          onChangeTab={(tab) => {
            setSelectedMovie(null);
            setCurrentTab(tab);
          }}
          onScrollToMood={handleScrollToMoodSection}
          favoritesCount={favorites.length}
        />

        <main className="flex-1 mx-auto max-w-7xl w-full px-6 md:px-12 py-8 md:py-12 space-y-12 md:space-y-16">
          {selectedMovie ? (
            <MovieDetailPage
              movie={selectedMovie}
              onBack={() => setSelectedMovie(null)}
              favorites={favorites}
              onToggleFavorite={(m) => handleToggleFavorite(null, m)}
              onMovieSelect={setSelectedMovie}
            />
        ) : currentTab === "home" ? (
          <>
            {movies.length > 0 && !isLoading && !error ? (
              <Hero
                movies={movies.slice(0, 6)}
                favorites={favorites}
                onToggleFavorite={(m) => handleToggleFavorite(null, m)}
                onExploreMovie={setSelectedMovie}
              />
            ) : null}

            <MoodMatcher onMovieSelect={setSelectedMovie} />

            <section className="space-y-8 md:space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
                <div>
                  <h2 className="font-sans font-bold text-2xl md:text-3xl text-white light:text-zinc-950 tracking-tight leading-snug flex items-center gap-2">
                    <Flame className="h-6 w-6 text-brand-crimson" />
                    <span>POPULAR DISCOVERIES</span>
                  </h2>
                  <p className="text-zinc-500 light:text-zinc-500 text-[10px] font-mono tracking-wide mt-1 uppercase">
                    Curated Archive • Cine-Stream Pro original series
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <div className="relative flex items-center rounded-full bg-[#1F2937] border border-white/10 focus-within:ring-2 focus-within:ring-[#E50914]/50 transition-all p-1 light:bg-white light:border-zinc-200">
                    <Search className="h-4 w-4 text-gray-400 ml-4 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Search titles..."
                      className="w-full bg-transparent px-3 py-1.5 text-xs text-white light:text-zinc-900 outline-none placeholder-gray-400"
                    />
                  </div>

                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-xl bg-[#151619] border border-white/10 p-3 shadow-2xl animate-fade-in light:bg-white light:border-zinc-200">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-semibold block mb-2">
                        Suggested Mood Tags
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Cyberpunk", "Minimalist", "Sci-Fi", "Noir", "Experimental"].map((tag) => (
                          <button
                            key={tag}
                            onMouseDown={() => {
                              setSelectedGenre(tag);
                              setSearchQuery("");
                            }}
                            className="px-2.5 py-1 rounded-full border border-white/10 text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer light:bg-zinc-100 light:hover:bg-zinc-200 light:text-zinc-700"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-5 light:border-zinc-200">
                <button
                  onClick={() => setSelectedGenre("All")}
                  className={`px-4 py-2 text-xs font-sans font-medium transition-all rounded ${
                    selectedGenre === "All"
                      ? "bg-[#E50914] text-white font-semibold"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/5 rounded transition-colors"
                  }`}
                >
                  All Films
                </button>
                {GENRE_PRESETS.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 text-xs font-sans font-medium transition-all rounded ${
                      selectedGenre === genre
                        ? "bg-[#E50914] text-white font-semibold"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/5 rounded transition-colors"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="rounded-2xl border border-brand-crimson/10 bg-brand-crimson/5 p-12 text-center max-w-lg mx-auto">
                  <HelpCircle className="h-10 w-10 text-brand-crimson mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-white light:text-zinc-900">
                    Database Query Interrupted
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 leading-relaxed font-sans">
                    {error}
                  </p>
                  <button
                    onClick={() => fetchMoviesList(1, selectedGenre, searchQuery, false)}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-mono text-zinc-200 hover:text-white border border-zinc-800 active:scale-95 transition-all light:bg-white light:border-zinc-200 light:text-zinc-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Try Query Again</span>
                  </button>
                </div>
              ) : isLoading && movies.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-[2/3] w-full rounded-xl shimmer" />
                      <div className="h-4 w-3/4 rounded bg-zinc-800 light:bg-zinc-200 shimmer" />
                      <div className="h-3 w-1/2 rounded bg-zinc-800 light:bg-zinc-200 shimmer" />
                    </div>
                  ))}
                </div>
              ) : movies.length === 0 ? (
                <div className="text-center py-20 max-w-md mx-auto space-y-4">
                  <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden opacity-80 border border-zinc-800">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPxV9omuQZtTkWweIIFMITfs57dChVZDQWR5vyn_Ra5b-aGWD1gHjqt2o7nxtfmlRi6n49JnxRn2WPgyu1IIvHdkrJ4xp8nPn9PdgPNRKh7hD2PLht-ORH14HH3A_h_0nK0pckxa5QgOLwGXuxBeFKyNWD3Dpf_Zkfcca6DY2Sw53b4jL4VkqtJ0UDgpWek32u_hL0eqZO_IXyr-vRNwp61kChxw1BDPqIQBs3Po5Y8ZNM5MpHXgc37v6igJJxUnZiSctg2fy2vUex"
                      alt="Empty State"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-white light:text-zinc-900">
                      Empty Archive Query
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      We found zero films matching the active genre or text filters. Try modifying your search or reset the filters.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedGenre("All");
                        setSearchQuery("");
                      }}
                      className="mt-4 rounded-lg bg-zinc-900 text-[11px] font-mono font-medium px-3.5 py-1.5 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 light:bg-white light:border-zinc-200 light:text-zinc-700"
                    >
                      Reset Filter Criteria
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 md:space-y-12">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                    {movies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorited={favorites.some((f) => f.id === movie.id)}
                        onToggleFavorite={(e) => handleToggleFavorite(e, movie)}
                        onClick={() => setSelectedMovie(movie)}
                      />
                    ))}
                  </div>

                  <div
                    ref={observerTarget}
                    className="flex justify-center items-center py-6"
                  >
                    {isInfiniteLoading && (
                      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
                        <span>Buffer-Loading Cinema Stream archives...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </section>
          </>
        ) : (
          <section className="space-y-8 animate-fade-in">
            <div>
              <h2 className="font-display font-semibold text-2xl md:text-3xl text-white light:text-zinc-950 tracking-tight flex items-center gap-2">
                <Heart className="h-6 w-6 text-brand-crimson fill-brand-crimson" />
                <span>Your Studio Library</span>
              </h2>
              <p className="text-zinc-500 light:text-zinc-500 text-xs font-mono tracking-wide mt-1 uppercase">
                Persistent Saved Sessions ({favorites.length} saved titles)
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-20 max-w-sm mx-auto space-y-4">
                <div className="relative mx-auto w-40 h-40 rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPxV9omuQZtTkWweIIFMITfs57dChVZDQWR5vyn_Ra5b-aGWD1gHjqt2o7nxtfmlRi6n49JnxRn2WPgyu1IIvHdkrJ4xp8nPn9PdgPNRKh7hD2PLht-ORH14HH3A_h_0nK0pckxa5QgOLwGXuxBeFKyNWD3Dpf_Zkfcca6DY2Sw53b4jL4VkqtJ0UDgpWek32u_hL0eqZO_IXyr-vRNwp61kChxw1BDPqIQBs3Po5Y8ZNM5MpHXgc37v6igJJxUnZiSctg2fy2vUex"
                    alt="Empty Library representation"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-white light:text-zinc-900">
                    Empty Studio Library
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed font-sans">
                    You have not saved any films into your library. Explore home or query the AI Matcher, then toggle the heart button to populate your archive.
                  </p>
                  <button
                    onClick={() => setCurrentTab("home")}
                    className="mt-5 rounded-lg bg-brand-crimson text-white hover:bg-brand-crimson-hover text-xs font-mono px-4 py-2 shadow-lg shadow-brand-crimson/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Go Back Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                {favorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorited={true}
                    onToggleFavorite={(e) => handleToggleFavorite(e, movie)}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

      </main>

      <Footer />

    </div>
    </ThemeProvider>
  );
}
