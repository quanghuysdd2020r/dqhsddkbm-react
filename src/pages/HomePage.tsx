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

      <section className="relative z-10 bg-[#071f2d]/95 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 text-center sm:px-8">
          <ScrollReveal>
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
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#f7d95d] px-6 py-24 text-[#071f2d] sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0)_34%,rgba(7,31,45,0.08)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/45" />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal className="max-w-xl" variant="left">
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[#071f2d]/55">
              Vocabulary push
            </p>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="mb-6 text-5xl leading-none sm:text-6xl md:text-7xl"
            >
              Get noti.
            </h2>

            <p className="max-w-md text-base leading-8 text-[#071f2d]/72 sm:text-lg">
              Only iPhone for now. Add dqhsddkbm to your Home Screen, then turn
              on daily Russian vocabulary reminders.
            </p>

            <button
              className="mt-9 rounded-full border border-white/55 bg-white/28 px-7 py-3.5 text-sm font-medium text-[#071f2d] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_60px_rgba(7,31,45,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/36 disabled:cursor-wait disabled:opacity-70"
              disabled={isNotificationRequesting}
              onClick={enableNotifications}
              type="button"
            >
              {isNotificationRequesting
                ? "Enabling..."
                : "Turn on vocab notifications"}
            </button>

            {notificationStatus ? (
              <p className="mt-4 text-sm text-[#071f2d]/62">{notificationStatus}</p>
            ) : null}
          </ScrollReveal>

          <ScrollReveal delay="short" variant="pop">
            <div className="mx-auto w-full max-w-[23rem] rounded-[3.1rem] border border-white/30 bg-[#071f2d] p-3 shadow-[0_34px_95px_rgba(7,31,45,0.38)] sm:max-w-[25rem] sm:p-4">
              <div className="relative min-h-[33rem] overflow-hidden rounded-[2.45rem] border border-white/10 bg-[linear-gradient(180deg,#0b3548_0%,#071f2d_55%,#031018_100%)] px-4 pt-3">
                <div className="mx-auto h-6 w-24 rounded-full bg-black/42" />
                <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(247,217,93,0.28),rgba(247,217,93,0))]" />
                <div className="absolute bottom-0 left-1/2 h-56 w-[150%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(247,217,93,0.26),rgba(247,217,93,0)_64%)]" />

                <div className="relative mt-20">
                  <div className="notification-pop rounded-[1.65rem] border border-white/35 bg-white/24 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                    <div className="flex items-center gap-3">
                      <img
                        alt="dqhsddkbm app icon"
                        className="h-10 w-10 rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
                        src="/app-icon-v2-192.png"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3 text-xs text-white/72">
                          <span className="font-medium text-white">dqhsddkbm</span>
                          <span>now</span>
                        </div>
                        <p className="mt-0.5 text-[0.8rem] text-white/62">
                          Russian word of the day
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/18 pt-4">
                      <p className="text-lg font-semibold leading-none">мечта</p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        dream. Example: У меня есть большая мечта.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-7 left-1/2 h-1.5 w-28 -translate-x-1/2 rounded-full bg-white/36" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/12 bg-[#061a25]/58 px-6 py-5 text-center text-sm text-white/55 shadow-[0_-18px_60px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <span>&copy; 2026 dqhsddkbm. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
