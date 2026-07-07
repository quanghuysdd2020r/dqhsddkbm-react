import Navbar from "../components/Navbar";

export default function Blogs() {
  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_72%_22%,rgba(244,198,96,0.1),transparent_26%)]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
            Blogs
          </p>
          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="animate-fade-rise text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
          >
            Coming soon.
          </h1>
          <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            Essays and notes on studying, focus, and quiet ambition are being
            prepared.
          </p>
        </div>
      </section>
    </main>
  );
}
