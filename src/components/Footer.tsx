import { FC } from "react";
import { Film, Github } from "lucide-react";

export const Footer: FC = () => {
  return (
    <footer className="border-t border-white/5 bg-black text-gray-500 py-10 transition-colors duration-300 light:border-zinc-200 light:bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/5 text-zinc-400 light:bg-zinc-200 light:text-zinc-700">
            <Film className="h-4.5 w-4.5" />
          </div>
          <span className="font-sans font-black text-xs tracking-wider text-white light:text-zinc-800 uppercase">
            CINE-STREAM PRO
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] font-sans tracking-wider uppercase">
          <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Help Center</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            <Github className="h-3.5 w-3.5" />
            <span>Developer Repo</span>
          </a>
        </div>

        <div className="text-center md:text-right text-[11px] font-sans text-gray-500 leading-relaxed font-normal">
          <p>© {new Date().getFullYear()} Cine-Stream. All Rights Reserved.</p>
          <p className="mt-0.5 flex items-center justify-center md:justify-end gap-1">
            <span>Powered by</span>
            <span className="text-white font-bold">TMDB</span>
            <span>& Gemini AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
