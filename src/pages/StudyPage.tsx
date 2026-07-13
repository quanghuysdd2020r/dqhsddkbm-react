import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  type FocusSession,
  formatMinutes,
  getFocusSessions,
  getFocusStats,
} from "../lib/focusStorage";

const studySpaces: Array<{
  title: string;
  meta: string;
  to?: string;
}> = [
  {
    title: "Notes",
    meta: "Daily words",
    to: "/study/notes",
  },
  {
    title: "Flashcards",
    meta: "Planned",
  },
  {
    title: "Lessons",
    meta: "Drafting",
  },
  {
    title: "Downloads",
    meta: "Soon",
  },
];

const formatSessionDate = (date: string) => {
  return new Date(date).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
  });
};

export default function Study() {
  const [sessions, setSessions] = useState<FocusSession[]>(() => getFocusSessions());

  useEffect(() => {
    const updateSessions = () => setSessions(getFocusSessions());

    window.addEventListener("focus-sessions-updated", updateSessions);
    window.addEventListener("storage", updateSessions);

    return () => {
      window.removeEventListener("focus-sessions-updated", updateSessions);
      window.removeEventListener("storage", updateSessions);
    };
  }, []);

  const stats = useMemo(() => getFocusStats(sessions), [sessions]);
  const latestSessions = sessions.slice(0, 4);
  const maxWeekMinutes = Math.max(10, ...stats.week.map((day) => day.minutes));

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
                Study now keeps your focus history in this browser, so every
                completed block can become a small visible win.
              </p>

              <div className="animate-fade-rise-delay-2 mt-9 flex flex-wrap gap-3">
                {studySpaces.map((space) =>
                  space.to ? (
                    <Link
                      className="liquid-glass inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm text-white transition-transform hover:scale-[1.03] sm:px-6"
                      key={space.title}
                      to={space.to}
                    >
                      <span>{space.title}</span>
                      <span className="text-xs text-white/42">{space.meta}</span>
                    </Link>
                  ) : (
                    <button
                      className="liquid-glass inline-flex cursor-not-allowed items-center gap-3 rounded-full px-5 py-2.5 text-sm text-white/58 opacity-70 sm:px-6"
                      disabled
                      key={space.title}
                      type="button"
                    >
                      <span>{space.title}</span>
                      <span className="text-xs text-white/36">{space.meta}</span>
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="animate-fade-rise-delay liquid-glass rounded-[24px] px-6 py-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-sm text-white/50">Today</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  Local record
                </span>
              </div>

              <div className="space-y-5 pt-6">
                <div>
                  <p className="text-sm text-white/45">Today's focus</p>
                  <p className="mt-2 text-3xl text-white">
                    {formatMinutes(stats.todayMinutes)}
                  </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white/70"
                    style={{
                      width: `${Math.min(100, (stats.todayMinutes / 180) * 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">{stats.streak}</p>
                    <p className="mt-1 text-white/45">Streak</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">{stats.focusCount}</p>
                    <p className="mt-1 text-white/45">Sessions</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-4">
                    <p className="text-2xl text-white">
                      {formatMinutes(stats.totalMinutes)}
                    </p>
                    <p className="mt-1 text-white/45">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                Focus results
              </p>
              <h2
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="mt-3 text-4xl font-normal text-white sm:text-5xl"
              >
                Your browser keeps the score.
              </h2>
            </div>
            <Link
              className="liquid-glass w-fit rounded-full px-8 py-4 text-sm text-white transition-transform hover:scale-[1.03]"
              to="/focus"
            >
              Start focus
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-white/45">Last 7 days</p>
                  <p className="mt-1 text-xl text-white">
                    {formatMinutes(
                      stats.week.reduce((total, day) => total + day.minutes, 0),
                    )}
                  </p>
                </div>
                <span className="text-sm text-white/35">Minutes per day</span>
              </div>

              <div className="mt-8 flex h-56 items-end gap-3">
                {stats.week.map((day) => (
                  <div className="flex flex-1 flex-col items-center gap-3" key={day.dateKey}>
                    <div className="flex h-40 w-full items-end justify-center border-b border-white/10">
                      <div
                        className="w-full max-w-10 bg-white/70 transition-all"
                        style={{
                          height: `${Math.max(6, (day.minutes / maxWeekMinutes) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/36">{day.label}</p>
                      <p className="mt-1 text-xs text-white/60">{day.minutes}m</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="text-sm text-white/45">Recent focus</p>
                <p className="text-sm text-white/35">{latestSessions.length} shown</p>
              </div>

              {latestSessions.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {latestSessions.map((session) => (
                    <div
                      className="flex items-center justify-between gap-5 py-4"
                      key={session.id}
                    >
                      <div>
                        <p className="text-sm text-white">{session.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
                          {formatSessionDate(session.startedAt)} / {session.mode}
                        </p>
                      </div>
                      <p className="text-sm text-white/65">
                        {formatMinutes(session.minutes)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm leading-7 text-white/45">
                    No recorded sessions yet. Start a focus block and complete
                    the minimum requirement to see results here.
                  </p>
                </div>
              )}
            </div>
          </div>
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

          <Link
            className="liquid-glass rounded-full px-8 py-4 text-sm text-white transition-transform hover:scale-[1.03]"
            to="/focus"
          >
            Start focus
          </Link>
        </div>
      </section>
    </main>
  );
}
