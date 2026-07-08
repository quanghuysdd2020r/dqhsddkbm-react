import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  getDailyVocabulary,
  getTodayVocabularyDateKey,
  getVocabularyById,
} from "../lib/russianVocabulary";
import {
  isOneSignalConfigured,
  requestVocabularyNotifications,
} from "../lib/oneSignal";

export default function Notes() {
  const [searchParams] = useSearchParams();
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const dailyWords = useMemo(() => getDailyVocabulary(), []);
  const selectedWord = getVocabularyById(searchParams.get("word")) ?? dailyWords[0];
  const morningWords = dailyWords.slice(0, 3);
  const eveningWords = dailyWords.slice(3);
  const dateKey = getTodayVocabularyDateKey();

  async function enableNotifications() {
    setIsRequesting(true);
    setNotificationStatus(null);

    try {
      const result = await requestVocabularyNotifications();
      setNotificationStatus(result.message);
    } catch (error) {
      setNotificationStatus(
        error instanceof Error
          ? error.message
          : "Không thể bật thông báo lúc này.",
      );
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-16 pt-36 sm:pt-44">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_32%),radial-gradient(circle_at_75%_22%,rgba(244,198,96,0.11),transparent_26%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
              Study / Notes
            </p>
            <h1
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="animate-fade-rise max-w-4xl text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
            >
              Five Russian words for today.
            </h1>
            <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              A small daily vocabulary drop: three words in the morning and two
              in the evening. Tap a notification to open the word with an example.
            </p>
          </div>

          <div className="animate-fade-rise-delay liquid-glass rounded-[24px] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="text-sm text-white/50">Today's word</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                {dateKey}
              </span>
            </div>

            <div className="pt-6">
              <p className="text-sm uppercase tracking-[0.24em] text-white/35">
                {selectedWord.category}
              </p>
              <h2 className="mt-4 text-6xl font-medium leading-none text-white">
                {selectedWord.russian}
              </h2>
              <p className="mt-4 text-sm text-white/42">
                {selectedWord.pronunciation} / {selectedWord.meaning}
              </p>
              <div className="mt-8 border-l border-white/16 pl-5">
                <p className="text-lg leading-8 text-white">{selectedWord.example}</p>
                <p className="mt-2 text-sm leading-7 text-white/50">
                  {selectedWord.exampleMeaning}
                </p>
              </div>
              <a
                className="mt-8 inline-flex text-sm text-white/45 transition-colors hover:text-white"
                href={selectedWord.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Source: Lingohut Russian lessons
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-white/35">
              Notifications
            </p>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="mt-3 text-4xl font-normal text-white"
            >
              Learn from small reminders.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/52">
              Notifications are designed for 7:00 AM and 7:00 PM. On iPhone,
              add this website to the Home Screen first, open it from there,
              then enable notifications.
            </p>

            <button
              className="liquid-glass mt-8 rounded-full px-7 py-3.5 text-sm text-white transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!isOneSignalConfigured() || isRequesting}
              onClick={enableNotifications}
              type="button"
            >
              {isRequesting ? "Requesting..." : "Enable vocab notifications"}
            </button>

            {!isOneSignalConfigured() ? (
              <p className="mt-4 text-sm leading-7 text-white/45">
                OneSignal is scaffolded. Add `VITE_ONESIGNAL_APP_ID` in
                Cloudflare Pages environment variables to activate it.
              </p>
            ) : null}

            {notificationStatus ? (
              <p className="mt-4 text-sm leading-7 text-white/55">
                {notificationStatus}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="text-sm text-white/45">07:00</p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/28">
                  Morning
                </p>
              </div>

              <div className="divide-y divide-white/10">
                {morningWords.map((word) => (
                  <Link
                    className={`block py-4 transition-colors hover:text-white ${
                      selectedWord.id === word.id ? "text-white" : "text-white/58"
                    }`}
                    key={word.id}
                    to={`/study/notes?word=${word.id}`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span>
                        <span className="block text-2xl text-white">{word.russian}</span>
                        <span className="mt-1 block text-sm text-white/42">
                          {word.meaning}
                        </span>
                      </span>
                      <span className="text-sm text-white/30">{word.pronunciation}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="text-sm text-white/45">19:00</p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/28">
                  Evening
                </p>
              </div>

              <div className="divide-y divide-white/10">
                {eveningWords.map((word) => (
                  <Link
                    className={`block py-4 transition-colors hover:text-white ${
                      selectedWord.id === word.id ? "text-white" : "text-white/58"
                    }`}
                    key={word.id}
                    to={`/study/notes?word=${word.id}`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span>
                        <span className="block text-2xl text-white">{word.russian}</span>
                        <span className="mt-1 block text-sm text-white/42">
                          {word.meaning}
                        </span>
                      </span>
                      <span className="text-sm text-white/30">{word.pronunciation}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
