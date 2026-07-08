import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  type FocusMode,
  formatMinutes,
  getFocusStats,
  saveFocusSession,
} from "../lib/focusStorage";

type ScreenState = "setup" | "running" | "result";
type PomodoroPhase = "focus" | "break";

type RunningSession = {
  mode: FocusMode;
  label: string;
  startedAt: number;
  phase: PomodoroPhase;
  phaseStartedAt: number;
  targetSeconds: number;
  breakSeconds: number;
  recordedBlocks: number;
  accumulatedFocusSeconds: number;
  quote: string;
};

type ResultState = {
  recorded: boolean;
  title: string;
  description: string;
  minutes?: number;
};

const focusModes: Array<{
  mode: FocusMode;
  title: string;
  description: string;
}> = [
  {
    mode: "timed",
    title: "Timed focus",
    description: "Choose 10 minutes to 3 hours. Leaving early will not count.",
  },
  {
    mode: "unlimited",
    title: "Open focus",
    description: "Study without a limit. Sessions under 10 minutes will not count.",
  },
  {
    mode: "pomodoro",
    title: "Pomodoro",
    description: "Work in clean focus blocks with a short break after each block.",
  },
];

const pomodoroPlans = [
  { label: "25 / 5", focusMinutes: 25, breakMinutes: 5 },
  { label: "50 / 10", focusMinutes: 50, breakMinutes: 10 },
];

const quotes = [
  "Stay with the page in front of you.",
  "Quiet effort compounds.",
  "One clean block is enough to change the day.",
  "Let the noise pass. Keep the promise.",
];

const formatClock = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const getElapsedSeconds = (startedAt: number, now: number) => {
  return Math.max(0, Math.floor((now - startedAt) / 1000));
};

export default function Focus() {
  const [screen, setScreen] = useState<ScreenState>("setup");
  const [selectedMode, setSelectedMode] = useState<FocusMode>("timed");
  const [timedMinutes, setTimedMinutes] = useState(50);
  const [selectedPomodoroIndex, setSelectedPomodoroIndex] = useState(0);
  const [runningSession, setRunningSession] = useState<RunningSession | null>(null);
  const [now, setNow] = useState(Date.now());
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);

  const selectedPomodoro = pomodoroPlans[selectedPomodoroIndex];

  const stats = useMemo(() => getFocusStats(), [result]);

  useEffect(() => {
    if (screen !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [screen]);

  useEffect(() => {
    if (screen !== "running" || !runningSession) {
      return;
    }

    if (runningSession.mode === "timed") {
      const elapsedSeconds = getElapsedSeconds(runningSession.startedAt, now);

      if (elapsedSeconds >= runningSession.targetSeconds) {
        recordSession(
          runningSession,
          runningSession.targetSeconds,
          now,
          runningSession.phaseStartedAt,
        );
        setResult({
          recorded: true,
          title: "Focus completed.",
          description: "Your timed focus block was completed and saved.",
          minutes: Math.round(runningSession.targetSeconds / 60),
        });
        setRunningSession(null);
        setScreen("result");
      }

      return;
    }

    if (runningSession.mode === "pomodoro") {
      const phaseElapsedSeconds = getElapsedSeconds(runningSession.phaseStartedAt, now);

      if (
        runningSession.phase === "focus" &&
        phaseElapsedSeconds >= runningSession.targetSeconds
      ) {
        recordSession(runningSession, runningSession.targetSeconds, now);
        setRunningSession({
          ...runningSession,
          accumulatedFocusSeconds:
            runningSession.accumulatedFocusSeconds + runningSession.targetSeconds,
          phase: "break",
          phaseStartedAt: now,
          recordedBlocks: runningSession.recordedBlocks + 1,
        });
        return;
      }

      if (
        runningSession.phase === "break" &&
        phaseElapsedSeconds >= runningSession.breakSeconds
      ) {
        setRunningSession({
          ...runningSession,
          phase: "focus",
          phaseStartedAt: now,
        });
      }
    }
  }, [now, runningSession, screen]);

  function recordSession(
    session: RunningSession,
    durationSeconds: number,
    endedAt: number,
    startedAt = session.startedAt,
  ) {
    saveFocusSession({
      endedAt: new Date(endedAt).toISOString(),
      label: session.label,
      minutes: Math.max(1, Math.round(durationSeconds / 60)),
      mode: session.mode,
      startedAt: new Date(startedAt).toISOString(),
    });
  }

  function startFocus() {
    const startedAt = Date.now();
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    if (selectedMode === "timed") {
      setRunningSession({
        accumulatedFocusSeconds: 0,
        breakSeconds: 0,
        label: `${timedMinutes} minute focus`,
        mode: "timed",
        phase: "focus",
        phaseStartedAt: startedAt,
        quote,
        recordedBlocks: 0,
        startedAt,
        targetSeconds: timedMinutes * 60,
      });
    }

    if (selectedMode === "unlimited") {
      setRunningSession({
        accumulatedFocusSeconds: 0,
        breakSeconds: 0,
        label: "Open focus",
        mode: "unlimited",
        phase: "focus",
        phaseStartedAt: startedAt,
        quote,
        recordedBlocks: 0,
        startedAt,
        targetSeconds: 0,
      });
    }

    if (selectedMode === "pomodoro") {
      setRunningSession({
        accumulatedFocusSeconds: 0,
        breakSeconds: selectedPomodoro.breakMinutes * 60,
        label: `${selectedPomodoro.focusMinutes}/${selectedPomodoro.breakMinutes} pomodoro`,
        mode: "pomodoro",
        phase: "focus",
        phaseStartedAt: startedAt,
        quote,
        recordedBlocks: 0,
        startedAt,
        targetSeconds: selectedPomodoro.focusMinutes * 60,
      });
    }

    setNow(startedAt);
    setResult(null);
    setScreen("running");
  }

  function stopFocus() {
    if (!runningSession) {
      return;
    }

    const stoppedAt = Date.now();
    const elapsedSeconds = getElapsedSeconds(runningSession.startedAt, stoppedAt);
    const phaseElapsedSeconds = getElapsedSeconds(runningSession.phaseStartedAt, stoppedAt);

    if (runningSession.mode === "timed") {
      const isRecorded = elapsedSeconds >= runningSession.targetSeconds;

      if (isRecorded) {
        recordSession(runningSession, runningSession.targetSeconds, stoppedAt);
      }

      showStopResult(isRecorded, isRecorded ? runningSession.targetSeconds : 0);
      return;
    }

    if (runningSession.mode === "unlimited") {
      const isRecorded = elapsedSeconds >= 10 * 60;

      if (isRecorded) {
        recordSession(runningSession, elapsedSeconds, stoppedAt);
      }

      showStopResult(isRecorded, isRecorded ? elapsedSeconds : 0);
      return;
    }

    const hasCompletedBlock = runningSession.recordedBlocks > 0;
    const canRecordCurrentBlock =
      runningSession.phase === "focus" &&
      phaseElapsedSeconds >= runningSession.targetSeconds;

    if (canRecordCurrentBlock) {
      recordSession(
        runningSession,
        runningSession.targetSeconds,
        stoppedAt,
        runningSession.phaseStartedAt,
      );
    }

    showStopResult(
      hasCompletedBlock || canRecordCurrentBlock,
      runningSession.accumulatedFocusSeconds +
        (canRecordCurrentBlock ? runningSession.targetSeconds : 0),
    );
  }

  function showStopResult(isRecorded: boolean, recordedSeconds: number) {
    setResult(
      isRecorded
        ? {
            recorded: true,
            title: "Focus saved.",
            description: "This session met the requirement and was added to Study.",
            minutes: Math.max(1, Math.round(recordedSeconds / 60)),
          }
        : {
            recorded: false,
            title: "Result not recorded.",
            description:
              "This focus block ended before the minimum requirement, so it was not saved.",
          },
    );
    setIsStopModalOpen(false);
    setRunningSession(null);
    setScreen("result");
  }

  const timerLabel = useMemo(() => {
    if (!runningSession) {
      return "00:00:00";
    }

    if (runningSession.mode === "unlimited") {
      return formatClock(getElapsedSeconds(runningSession.startedAt, now));
    }

    const elapsedSeconds = getElapsedSeconds(runningSession.phaseStartedAt, now);
    const phaseSeconds =
      runningSession.phase === "break"
        ? runningSession.breakSeconds
        : runningSession.targetSeconds;

    return formatClock(phaseSeconds - elapsedSeconds);
  }, [now, runningSession]);

  if (screen === "running" && runningSession) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#03151f] px-6 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_30%)]" />

        <div className="relative">
          <p className="mb-8 text-xs uppercase tracking-[0.36em] text-white/35">
            {runningSession.mode === "pomodoro" ? runningSession.phase : "Focus"}
          </p>
          <div className="font-mono text-6xl tracking-[0.04em] text-white sm:text-8xl md:text-9xl">
            {timerLabel}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
            {runningSession.quote}
          </p>
          <button
            className="mt-12 rounded-full border border-white/12 px-8 py-3 text-sm text-white/70 transition-colors hover:border-white/24 hover:text-white"
            onClick={() => setIsStopModalOpen(true)}
            type="button"
          >
            Stop
          </button>
        </div>

        {isStopModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm">
            <div className="w-full max-w-sm border border-white/10 bg-[#071f2d] p-6 text-left shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <h2
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-4xl font-normal text-white"
              >
                Stop now?
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/55">
                Leaving early may prevent this focus block from being recorded.
              </p>

              <div className="mt-8 grid gap-3">
                <button
                  className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#071f2d]"
                  onClick={() => setIsStopModalOpen(false)}
                  type="button"
                >
                  Stay focused
                </button>
                <button
                  className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/65 transition-colors hover:border-white/24 hover:text-white"
                  onClick={stopFocus}
                  type="button"
                >
                  Stop now
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    );
  }

  if (screen === "result" && result) {
    return (
      <main className="min-h-screen bg-[#071f2d] text-white">
        <Navbar />

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_72%_22%,rgba(244,198,96,0.1),transparent_26%)]" />

          <div className="relative mx-auto max-w-4xl">
            <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
              {result.recorded ? "Recorded" : "Not recorded"}
            </p>
            <h1
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="animate-fade-rise text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
            >
              {result.title}
            </h1>
            <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              {result.description}
            </p>

            {result.recorded ? (
              <div className="mx-auto mt-10 grid max-w-2xl gap-px overflow-hidden border border-white/10 bg-white/10 text-left sm:grid-cols-3">
                <div className="bg-[#071f2d] p-5">
                  <p className="text-sm text-white/40">This block</p>
                  <p className="mt-2 text-2xl text-white">
                    {formatMinutes(result.minutes ?? 0)}
                  </p>
                </div>
                <div className="bg-[#071f2d] p-5">
                  <p className="text-sm text-white/40">Streak</p>
                  <p className="mt-2 text-2xl text-white">{stats.streak} days</p>
                </div>
                <div className="bg-[#071f2d] p-5">
                  <p className="text-sm text-white/40">Total</p>
                  <p className="mt-2 text-2xl text-white">
                    {formatMinutes(stats.totalMinutes)}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className="liquid-glass rounded-full px-8 py-4 text-sm text-white transition-transform hover:scale-[1.03]"
                onClick={() => setScreen("setup")}
                type="button"
              >
                Focus again
              </button>
              <Link
                className="rounded-full border border-white/10 px-8 py-4 text-sm text-white/65 transition-colors hover:border-white/24 hover:text-white"
                to="/study"
              >
                View Study
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:pb-24 sm:pt-44">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_78%_20%,rgba(244,198,96,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
            Focus now
          </p>

          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <h1
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="animate-fade-rise max-w-4xl text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
              >
                Choose the shape of this study block.
              </h1>
              <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Pick a focus mode, start the clock, and keep the block clean.
                Completed sessions are saved locally in your browser.
              </p>
            </div>

            <div className="animate-fade-rise-delay border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm">
              <div className="grid gap-3">
                {focusModes.map((mode) => (
                  <button
                    className={`border px-4 py-4 text-left transition-colors ${
                      selectedMode === mode.mode
                        ? "border-white/28 bg-white/[0.08] text-white"
                        : "border-white/10 bg-transparent text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    key={mode.mode}
                    onClick={() => setSelectedMode(mode.mode)}
                    type="button"
                  >
                    <span className="block text-sm font-medium">{mode.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-white/45">
                      {mode.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
          {selectedMode === "timed" ? (
            <div>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                    Timed focus
                  </p>
                  <h2
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                    className="mt-3 text-4xl font-normal text-white sm:text-5xl"
                  >
                    {timedMinutes} minutes
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-7 text-white/50">
                  Limit: 3 hours. Smallest step: 10 minutes. Early stop will not
                  be saved.
                </p>
              </div>

              <input
                className="mt-8 w-full accent-white"
                max="180"
                min="10"
                onChange={(event) => setTimedMinutes(Number(event.target.value))}
                step="10"
                type="range"
                value={timedMinutes}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {[30, 50, 90, 180].map((minutes) => (
                  <button
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      timedMinutes === minutes
                        ? "border-white/30 bg-white text-[#071f2d]"
                        : "border-white/10 text-white/55 hover:border-white/24 hover:text-white"
                    }`}
                    key={minutes}
                    onClick={() => setTimedMinutes(minutes)}
                    type="button"
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {selectedMode === "unlimited" ? (
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                  Open focus
                </p>
                <h2
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="mt-3 text-4xl font-normal text-white sm:text-5xl"
                >
                  No time limit
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-white/50">
                Stop whenever you need. Sessions shorter than 10 minutes will
                not be saved.
              </p>
            </div>
          ) : null}

          {selectedMode === "pomodoro" ? (
            <div>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                    Pomodoro
                  </p>
                  <h2
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                    className="mt-3 text-4xl font-normal text-white sm:text-5xl"
                  >
                    Choose a rhythm
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-7 text-white/50">
                  Each completed study block is saved before the break begins.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {pomodoroPlans.map((plan, index) => (
                  <button
                    className={`border px-5 py-5 text-left transition-colors ${
                      selectedPomodoroIndex === index
                        ? "border-white/28 bg-white/[0.08] text-white"
                        : "border-white/10 text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    key={plan.label}
                    onClick={() => setSelectedPomodoroIndex(index)}
                    type="button"
                  >
                    <span className="block text-lg text-white">{plan.label}</span>
                    <span className="mt-2 block text-sm text-white/45">
                      Study {plan.focusMinutes} minutes, rest {plan.breakMinutes} minutes
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex justify-end">
            <button
              className="liquid-glass rounded-full px-10 py-4 text-sm text-white transition-transform hover:scale-[1.03]"
              onClick={startFocus}
              type="button"
            >
              Start
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
