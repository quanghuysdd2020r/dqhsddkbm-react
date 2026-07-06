import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <Navbar />

      {/* VIDEO BACKGROUND */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" />
      </video>

      {/* HERO */}

      <section className="relative z-10 flex min-h-[82vh] flex-col items-center justify-center px-6 pt-32 pb-40 text-center">

        <h1
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
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

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          We're designing tools for deep thinkers, bold creators, and quiet
          rebels. Amid the chaos, we build digital spaces for sharp focus and
          inspired work.
        </p>

        <button className="liquid-glass animate-fade-rise-delay-2 mt-12 cursor-pointer rounded-full px-14 py-5 text-base text-white transition-transform hover:scale-[1.03]">
          Begin Journey
        </button>

      </section>

    </div>
  );
}