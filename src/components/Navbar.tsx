import { FC } from "react";
import { Film, Heart, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface NavbarProps {
  currentTab: "home" | "favorites";
  onChangeTab: (tab: "home" | "favorites") => void;
  onScrollToMood: () => void;
  favoritesCount: number;
}

export const Navbar: FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  onScrollToMood,
  favoritesCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-black/40 border-b border-white/10 backdrop-blur-md transition-colors duration-300 light:border-zinc-200/40 light:bg-white/70">
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-6 md:px-12">
        <div
          id="navbar-logo-container"
          onClick={() => onChangeTab("home")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson text-white shadow-lg shadow-brand-crimson/20 transition-transform group-hover:scale-105 active:scale-95">
            <Film className="h-5.5 w-5.5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white light:text-zinc-900">
            CINE<span className="text-brand-crimson transition-colors group-hover:text-brand-crimson-hover">-STREAM</span>
          </span>
        </div>

        <nav className="flex items-center gap-1 md:gap-4">
          <button
            id="nav-home-tab-btn"
            onClick={() => onChangeTab("home")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentTab === "home"
                ? "bg-zinc-900 text-white light:bg-zinc-100 light:text-zinc-900 font-semibold"
                : "text-zinc-400 hover:text-white light:text-zinc-500 light:hover:text-zinc-900"
            }`}
          >
            Home
          </button>

          <button
            id="nav-favorites-tab-btn"
            onClick={() => onChangeTab("favorites")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-300 relative ${
              currentTab === "favorites"
                ? "bg-zinc-900 text-white light:bg-zinc-100 light:text-zinc-900 font-semibold"
                : "text-zinc-400 hover:text-white light:text-zinc-500 light:hover:text-zinc-900"
            }`}
          >
            <Heart className={`h-4 w-4 ${currentTab === "favorites" ? "fill-brand-crimson text-brand-crimson" : ""}`} />
            <span>Library</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-crimson text-[9px] font-mono font-bold text-white shadow-md shadow-brand-crimson/30 animate-pulse">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            id="nav-mood-matcher-btn"
            onClick={onScrollToMood}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-brand-crimson transition-colors duration-300"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Mood Matcher</span>
          </button>
        </nav>

        <div className="flex items-center gap-3.5">
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 light:bg-zinc-100 light:border-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
            aria-label={theme === "light" ? "Switch to night view dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
