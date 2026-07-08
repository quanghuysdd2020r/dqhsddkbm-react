import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#071f2d] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <video
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" />
        </video>

        <div
          className="relative z-10 flex max-w-7xl flex-col items-center"
        >
          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="animate-fade-rise max-w-[22rem] text-4xl font-normal leading-[0.98] tracking-[-0.5px] sm:max-w-7xl sm:text-7xl md:text-8xl"
          >
            Where{" "}
            <em className="not-italic text-gray-400">
              dreams
            </em>{" "}
            rise{" "}
            <em className="not-italic text-gray-400">
              through the silence.
            </em>
          </h1>

          <p className="animate-fade-rise-delay mt-7 max-w-[21rem] text-sm leading-7 text-gray-300 sm:mt-8 sm:max-w-2xl sm:text-lg sm:leading-relaxed">
            We're designing tools for deep thinkers, bold creators, and quiet
            rebels. Amid the chaos, we build digital spaces for sharp focus and
            inspired work.
          </p>

          <Link
            className="liquid-glass animate-fade-rise-delay-2 mt-10 cursor-pointer rounded-full px-10 py-4 text-sm text-white transition-transform hover:scale-[1.03] sm:mt-12 sm:px-14 sm:py-5 sm:text-base"
            to="/focus"
          >
            Focus now
          </Link>
        </div>
      </section>

      <section className="relative z-10 bg-[#071f2d]/95 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 text-center sm:px-8">
          <p className="mb-5 text-xs uppercase tracking-[0.32em] text-white/45">
            Let's study
          </p>
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="mb-6 text-4xl leading-none text-white sm:text-5xl md:text-6xl"
          >
            Designed for modern learners.
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            dqhsddkbm isn't just a website. It's a growing ecosystem where
            students can learn, discover resources, read blogs and shop useful
            study materials.
          </p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-[#061a25]/38 px-6 py-5 text-center text-sm text-white/55 shadow-[0_-12px_40px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <span>&copy; 2026 dqhsddkbm. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
