import Navbar from "../components/Navbar";

const studySpaces = [
  {
    title: "Notes",
    description: "Capture ideas, formulas, summaries, and study maps in one calm place.",
    meta: "Coming soon",
  },
  {
    title: "Flashcards",
    description: "Turn hard concepts into quick review sessions for active recall.",
    meta: "Planned",
  },
  {
    title: "Lessons",
    description: "Follow focused learning paths with clean structure and zero noise.",
    meta: "Drafting",
  },
  {
    title: "Downloads",
    description: "Collect templates, worksheets, and resources for offline study.",
    meta: "Soon",
  },
];

export default function Study() {
  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:pb-24 sm:pt-44">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_72%_22%,rgba(244,198,96,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
            Let's study
          </p>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <h1
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="animate-fade-rise max-w-4xl text-6xl font-normal leading-[0.92] tracking-[-1px] text-white sm:text-7xl md:text-8xl"
              >
                A quieter place for sharper learning.
              </h1>

              <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Study is being shaped into a personal learning space for notes,
                flashcards, lessons, and downloadable resources without clutter.
              </p>
            </div>

            <div className="animate-fade-rise-delay liquid-glass rounded-[24px] px-6 py-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-sm text-white/50">Today</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  Focus mode
                </span>
              </div>

              <div className="space-y-5 pt-6">
                <div>
                  <p className="text-sm text-white/45">Current goal</p>
                  <p className="mt-2 text-xl text-white">Build a clean study system</p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-white/70" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">04</p>
                    <p className="mt-1 text-white/45">Spaces</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">12</p>
                    <p className="mt-1 text-white/45">Ideas</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">01</p>
                    <p className="mt-1 text-white/45">Path</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          {studySpaces.map((space) => (
            <article
              className="group border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.055]"
              key={space.title}
            >
              <div className="flex items-start justify-between gap-6">
                <h2
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-4xl font-normal text-white"
                >
                  {space.title}
                </h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
                  {space.meta}
                </span>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                {space.description}
              </p>

              <div className="mt-8 h-px bg-white/10 transition-colors group-hover:bg-white/20" />
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#061a25]/48 px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/35">
              Next
            </p>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="mt-3 text-4xl font-normal text-white sm:text-5xl"
            >
              Notes first, then flashcards.
            </h2>
          </div>

          <button className="liquid-glass rounded-full px-8 py-4 text-sm text-white transition-transform hover:scale-[1.03]">
            Start building
          </button>
        </div>
      </section>
    </main>
  );
}
