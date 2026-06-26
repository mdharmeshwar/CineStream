import { FC, FormEvent, useEffect, useState } from "react";
import { Sparkles, Send, Loader2, ArrowRight } from "lucide-react";
import { Movie, MOOD_EXAMPLES, PRE_SEEDED_MOVIES } from "../data/movies";

interface MoodMatcherProps {
  onMovieSelect: (movie: Movie) => void;
}

interface AIResult {
  matchedMovieId: string;
  reasoning: string;
  newMovie?: Movie;
}

export const MoodMatcher: FC<MoodMatcherProps> = ({ onMovieSelect }) => {
  const [moodInput, setMoodInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AIResult | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(() => setCooldownSeconds((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const handlePresetClick = (preset: string) => setMoodInput(preset);

  const handleMatchMood = async (e: FormEvent) => {
    e.preventDefault();
    if (!moodInput.trim() || cooldownSeconds > 0) return;

    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch("/api/mood-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodInput }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to receive recommendation. Please verify your connection.";
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMessage = errorData.error;
        } catch {}
        throw new Error(errorMessage);
      }

      const data: AIResult = await response.json();
      setRecommendation(data);
    } catch (err: any) {
      if (typeof err.message === "string" && err.message.includes("rate limit")) setCooldownSeconds(20);
      setError(err.message || "Something went wrong. Let's try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRecommendedMovie = async () => {
    if (!recommendation) return;

    if (recommendation.matchedMovieId !== "none") {
      const localMatch = PRE_SEEDED_MOVIES.find((m) => m.id === recommendation.matchedMovieId);
      if (localMatch) { onMovieSelect(localMatch); return; }

      try {
        const response = await fetch(`/api/movies/${recommendation.matchedMovieId}`);
        if (!response.ok) throw new Error("Unable to open the recommended movie profile.");
        const matchedMovie: Movie = await response.json();
        if (matchedMovie) onMovieSelect(matchedMovie);
      } catch {
        setError("Unable to open the recommended profile right now.");
      }
    } else if (recommendation.newMovie) {
      onMovieSelect(recommendation.newMovie);
    }
  };

  return (
    <section
      id="ai-mood-matcher-section"
      className="relative rounded-2xl border border-white/10 bg-[#151619] px-6 py-12 md:p-12 lg:p-14 overflow-hidden light:border-zinc-200/80 light:bg-zinc-50/50"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#00A3FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        <div className="relative mb-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[#00A3FF] uppercase text-[10px] font-black tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>AI Discovery</span>
          </div>
          <div className="relative mt-2 flex items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full bg-[#00A3FF]/10 blur-xl pointer-events-none" />
            <div className="ai-orb-glow flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#00A3FF] to-blue-600 text-white shadow-[0_0_25px_rgba(0,163,255,0.4)]">
              {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Sparkles className="h-7 w-7" />}
            </div>
          </div>
        </div>

        <h2 className="font-sans font-bold text-2xl md:text-4xl text-white light:text-zinc-900 tracking-tight leading-tight">
          What's your mood today?
        </h2>
        <p className="mt-2.5 max-w-lg font-sans text-xs text-gray-400 light:text-zinc-500 font-normal leading-relaxed">
          Describe what you want to watch and our AI will find the perfect match.
        </p>

        <form onSubmit={handleMatchMood} className="mt-8 w-full max-w-xl">
          <div className="relative flex items-center rounded-xl bg-black/30 border border-white/10 focus-within:border-[#00A3FF]/50 focus-within:ring-1 focus-within:ring-[#00A3FF]/50 transition-all p-1.5 light:bg-white light:border-zinc-200">
            <input
              id="mood-input-field"
              type="text"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="e.g., A slow-burn, atmospheric sci-fi thriller with retro synthesizers..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white light:text-zinc-900 outline-none placeholder-zinc-500"
              disabled={isLoading}
            />
            <button
              id="mood-submit-btn"
              type="submit"
              disabled={isLoading || !moodInput.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#00A3FF] to-blue-600 text-white hover:opacity-90 disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-95 transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
              aria-label="Send mood description"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
          {MOOD_EXAMPLES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handlePresetClick(item.label)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 text-[10px] bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer transition-colors text-gray-300 light:bg-white light:border-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-brand-crimson/10 border border-brand-crimson/20 px-4 py-2.5 text-xs text-brand-crimson font-mono">
            {error}
          </div>
        )}

        {cooldownSeconds > 0 && (
          <div className="mt-3 rounded-lg border border-[#00A3FF]/20 bg-[#00A3FF]/5 px-4 py-2.5 text-xs text-[#7DD3FC] font-mono">
            Try again in {cooldownSeconds}s.
          </div>
        )}

        {recommendation && (
          <div
            id="ai-recommendation-result"
            className="mt-10 w-full max-w-xl rounded-2xl border border-[#00A3FF]/20 bg-[#00A3FF]/5 p-6 md:p-8 text-left transition-all duration-500 animate-fade-in"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#00A3FF] to-blue-600 text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#00A3FF] font-black">
                  Cine-Stream AI Match
                </span>
                <h3 className="font-sans font-bold text-lg text-white light:text-zinc-900 mt-1">
                  {recommendation.matchedMovieId !== "none"
                    ? "We found a matching masterwork in our collection!"
                    : `Introducing: ${recommendation.newMovie?.title}`}
                </h3>
                <p className="mt-3 text-sm text-zinc-300 light:text-zinc-600 leading-relaxed italic">
                  &ldquo;{recommendation.reasoning}&rdquo;
                </p>
                <button
                  id="open-ai-recommended-movie-btn"
                  onClick={handleOpenRecommendedMovie}
                  className="mt-5 flex items-center gap-2 text-xs font-mono font-medium text-[#00A3FF] hover:text-blue-400 transition-colors group cursor-pointer"
                >
                  <span>Explore Recommended Profile</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
