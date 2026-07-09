import { useState } from "react";
import Navbar from "../components/Navbar";
import ScrollReveal from "../components/ScrollReveal";
import { requestVocabularyNotifications } from "../lib/oneSignal";
import { Link } from "react-router-dom";

export default function Home() {
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [isNotificationRequesting, setIsNotificationRequesting] = useState(false);

  async function enableNotifications() {
    setIsNotificationRequesting(true);
    setNotificationStatus(null);

    try {
      const result = await requestVocabularyNotifications();
      setNotificationStatus(result.message);
    } catch {
      setNotificationStatus("Could not enable notifications right now.");
    } finally {
      setIsNotificationRequesting(false);
    }
  }

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

      <section className="relative z-10 overflow-hidden bg-[#f7d95d] py-24 text-[#071f2d] sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0)_38%,rgba(7,31,45,0.06)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 text-center sm:px-8">
          <ScrollReveal>
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[#071f2d]/55">
              Let's study
            </p>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="mb-6 text-4xl leading-none text-[#071f2d] sm:text-5xl md:text-6xl"
            >
              Designed for modern learners.
            </h2>

            <p className="mx-auto max-w-2xl text-base leading-8 text-[#071f2d]/72 sm:text-lg">
              dqhsddkbm isn't just a website. It's a growing ecosystem where
              students can learn, discover resources, read blogs and shop useful
              study materials.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#071f2d] px-6 py-24 text-white sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_34%,rgba(247,217,93,0.1)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/12" />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="max-w-xl" variant="left">
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-white/45">
              Vocabulary push
            </p>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="mb-6 text-5xl leading-none sm:text-6xl md:text-7xl"
            >
              Get noti.
            </h2>

            <p className="max-w-md text-base leading-8 text-white/70 sm:text-lg">
              Only iPhone for now. Add dqhsddkbm to your Home Screen, then turn
              on daily Russian vocabulary reminders.
            </p>

            <button
              className="liquid-glass mt-9 rounded-full px-7 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
              disabled={isNotificationRequesting}
              onClick={enableNotifications}
              type="button"
            >
              {isNotificationRequesting
                ? "Enabling..."
                : "Turn on vocab notifications"}
            </button>

            {notificationStatus ? (
              <p className="mt-4 text-sm text-white/58">{notificationStatus}</p>
            ) : null}
          </ScrollReveal>

          <ScrollReveal className="lg:justify-self-end" delay="short" variant="pop">
            <div className="relative w-full max-w-[34rem]">
              <div className="absolute inset-x-6 -inset-y-8 rounded-[2.25rem] bg-[#f7d95d]/18 blur-3xl" />

              <div className="notification-pop relative rounded-[1.75rem] border border-white/55 bg-white/24 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_26px_75px_rgba(7,31,45,0.22)] backdrop-blur-2xl sm:p-5">
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_34%,rgba(255,255,255,0.02)_100%)]" />

                <div className="relative flex items-center gap-3">
                  <img
                    alt="dqhsddkbm app icon"
                    className="h-10 w-10 rounded-[14px] shadow-[0_10px_30px_rgba(7,31,45,0.22)]"
                    src="/app-icon-v2-192.png"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 text-xs text-white/72">
                      <span className="font-medium text-white">dqhsddkbm</span>
                      <span>now</span>
                    </div>
                    <p className="mt-0.5 text-[0.8rem] text-white/64">
                      Russian word of the day
                    </p>
                  </div>
                </div>

                <div className="relative mt-4 border-t border-white/20 pt-4">
                  <p className="text-lg font-semibold leading-none">mechta</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    dream. Example: I keep one bright dream for today.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="footer-glass relative z-10 px-6 py-5 text-center text-sm text-white/58">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <span>&copy; 2026 dqhsddkbm. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
