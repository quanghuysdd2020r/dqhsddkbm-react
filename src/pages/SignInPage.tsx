import Navbar from "../components/Navbar";

export default function SignIn() {
  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
        <div className="absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(244,198,96,0.1),transparent_26%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.95fr_0.72fr] lg:items-center">
          <div>
            <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
              Account
            </p>
            <h1
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="animate-fade-rise max-w-4xl text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
            >
              Return to your quiet study space.
            </h1>
            <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Sign in to keep your notes, resources, and study flow close when
              the full dashboard arrives.
            </p>
          </div>

          <div className="animate-fade-rise-delay liquid-glass rounded-[28px] p-6 sm:p-8">
            <div className="grid grid-cols-2 rounded-full bg-white/[0.055] p-1 text-sm text-white/55">
              <button className="rounded-full bg-white text-[#071f2d] px-4 py-2.5">
                Sign in
              </button>
              <button className="rounded-full px-4 py-2.5 transition-colors hover:text-white">
                Register
              </button>
            </div>

            <form className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm text-white/55">Email</span>
                <input
                  className="mt-2 w-full border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/24"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/55">Password</span>
                <input
                  className="mt-2 w-full border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/24"
                  placeholder="Enter your password"
                  type="password"
                />
              </label>

              <div className="flex items-center justify-between gap-4 text-sm text-white/50">
                <label className="flex items-center gap-3">
                  <input
                    className="h-4 w-4 accent-white"
                    type="checkbox"
                  />
                  Remember me
                </label>
                <button className="transition-colors hover:text-white" type="button">
                  Forgot password?
                </button>
              </div>

              <button
                className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#071f2d] transition-transform hover:scale-[1.01]"
                type="button"
              >
                Continue
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-white/30">
              <div className="h-px flex-1 bg-white/10" />
              or
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              className="w-full rounded-full border border-white/10 px-6 py-3.5 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
              type="button"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
