import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import profilePic from "@/assets/zion complete prof pics.png";

export function Sidebar() {
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  return (
    <aside
      className="bg-navy text-white z-30 flex md:flex-col items-center justify-between md:h-screen h-20 md:w-[103px] w-full md:fixed md:left-0 md:top-0 md:rounded-r-[20px] shrink-0"
      aria-label="Primary"
    >
      <Link to="/" aria-label="Invoices home" className="relative w-20 h-20 md:w-[103px] md:h-[103px] bg-primary md:rounded-r-[20px] rounded-tr-[20px] rounded-br-[20px] md:rounded-bl-none overflow-hidden flex items-center justify-center group">
        <span className="absolute inset-0 top-1/2 bg-primary-hover rounded-tl-[20px]" aria-hidden />
        <svg viewBox="0 0 28 26" className="relative w-7 h-7 md:w-10 md:h-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9 20.513 0Z" fill="#fff"/>
        </svg>
        <span className="sr-only">Invoices</span>
      </Link>

      <div className="flex md:flex-col items-center md:gap-6 gap-4 md:pb-6 pr-4 md:pr-0">
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="text-text-secondary hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="md:w-full w-px md:h-px h-10 bg-surface-detail" aria-hidden />

        {/* ✅ Profile photo replacing the placeholder circle */}
        <img
          src={profilePic}
          alt="Zion's avatar"
          className="md:w-10 md:h-10 w-9 h-9 rounded-full object-cover object-top md:mt-2 md:mb-0"
        />
      </div>
      <span className="hidden">{isHome ? "" : ""}</span>
    </aside>
  );
}