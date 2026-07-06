import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

      <Link
  to="/"
  className="flex flex-col leading-none no-underline"
>
  <span
    style={{ fontFamily: "'Instrument Serif', serif" }}
    className="text-3xl tracking-tight text-white"
  >
    dqhsddkbm
  </span>

  
</Link>

      <div className="hidden items-center gap-8 text-sm md:flex">
        <Link to="/" className="text-white transition-colors">
          Home
        </Link>

        <Link
          to="/study"
          className="text-gray-400 transition-colors hover:text-white"
        >
          Study
        </Link>

        <Link
          to="/blogs"
          className="text-gray-400 transition-colors hover:text-white"
        >
          Blogs
        </Link>

        <Link
          to="/about"
          className="text-gray-400 transition-colors hover:text-white"
        >
          About
        </Link>

        <Link
          to="/shop"
          className="text-gray-400 transition-colors hover:text-white"
        >
          Shop
        </Link>
      </div>

      <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]">
        Sign In
      </button>

    </nav>
  );
}