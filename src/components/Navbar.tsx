import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Study", to: "/study" },
  { label: "Blogs", to: "/blogs" },
  { label: "About", to: "/about" },
  { label: "Shop", to: "/shop" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isComingSoonPage = pathname === "/coming-soon" || pathname === "/sign-in";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#061a25]/35 px-6 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-3 leading-none no-underline"
        >
          <img
            alt="dqhsddkbm"
            className="h-9 w-9 rounded-[12px] object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
            src="/app-icon-v2-192.png"
          />
          <span
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="hidden text-2xl tracking-tight text-white min-[360px]:block sm:text-3xl"
          >
            dqhsddkbm
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `transition-colors hover:text-white ${
                  isActive ? "text-white" : "text-gray-400"
                }`
              }
              end={item.to === "/"}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {isComingSoonPage ? (
          <div className="hidden w-[5.25rem] md:block" />
        ) : (
          <Link
            className="liquid-glass hidden rounded-full px-5 py-2.5 text-sm text-white transition-transform hover:scale-[1.03] sm:px-6 md:inline-flex"
            to="/coming-soon"
          >
            Sign In
          </Link>
        )}

        <button
          aria-expanded={isMenuOpen}
          aria-label="Open navigation menu"
          className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span className="flex h-4 w-4 flex-col justify-between">
            <span
              className={`h-px w-full bg-white transition-transform ${
                isMenuOpen ? "translate-y-[7.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-white transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-full bg-white transition-transform ${
                isMenuOpen ? "-translate-y-[7.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

      </div>

      <div
        className={`mx-auto grid max-w-7xl overflow-hidden transition-[grid-template-rows,opacity] duration-300 md:hidden ${
          isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mt-5 border-t border-white/10 pb-2 pt-4">
            <div className="overflow-hidden border border-white/10 bg-white/[0.025]">
              {navItems.map((item, index) => (
                <NavLink
                  className={({ isActive }) =>
                    `group flex items-center justify-between border-b border-white/10 px-4 py-3.5 text-sm transition-colors last:border-b-0 hover:bg-white/[0.055] hover:text-white ${
                      isActive ? "bg-white/[0.055] text-white" : "text-white/62"
                    }`
                  }
                  end={item.to === "/"}
                  key={item.to}
                  to={item.to}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-[11px] text-white/28">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <span className="h-px w-5 bg-white/18 transition-all group-hover:w-8 group-hover:bg-white/42" />
                </NavLink>
              ))}
            </div>

            <NavLink
              className={({ isActive }) =>
                `mt-3 flex items-center justify-between bg-white px-4 py-3.5 text-sm font-medium text-[#071f2d] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.01] ${
                  isActive ? "opacity-90" : ""
                }`
              }
              to="/coming-soon"
            >
              <span>Sign In</span>
              <span className="text-[#071f2d]/45">Access</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
