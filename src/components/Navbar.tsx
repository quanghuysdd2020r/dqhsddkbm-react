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
  const isComingSoonPage = pathname === "/coming-soon" || pathname === "/sign-in";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#061a25]/35 px-6 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        <Link
          to="/"
          className="flex flex-col leading-none no-underline"
        >
          <span
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-2xl tracking-tight text-white sm:text-3xl"
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
          <div className="hidden w-[5.25rem] sm:block" />
        ) : (
          <Link
            className="liquid-glass rounded-full px-5 py-2.5 text-sm text-white transition-transform hover:scale-[1.03] sm:px-6"
            to="/coming-soon"
          >
            Sign In
          </Link>
        )}

      </div>
    </nav>
  );
}
