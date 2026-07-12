import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthMode = "sign-in" | "sign-up" | "forgot";

function EyeIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      {isOpen ? (
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      ) : (
        <path
          d="M4 4l16 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

export default function SignIn() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage(null);
    setPassword("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`,
      });

      setMessage(
        error
          ? error.message
          : "Password reset link sent. Check your email, then open Profile to set a new password.",
      );
      setIsSubmitting(false);
      return;
    }

    const authRequest =
      mode === "sign-in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                nickname: nickname.trim(),
              },
              emailRedirectTo: `${window.location.origin}/sign-in`,
            },
          });

    const { error } = await authRequest;

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        mode === "sign-in"
          ? "Signed in."
          : "Account created. Check your email if confirmation is required.",
      );
      setPassword("");
    }

    setIsSubmitting(false);
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setMessage("Signed out.");
  }

  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden px-6 py-32 sm:py-40">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_32%),radial-gradient(circle_at_70%_18%,rgba(247,217,93,0.12),transparent_28%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_0.72fr] lg:items-center">
          <div>
            <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
              Account
            </p>
            <h1
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="animate-fade-rise max-w-4xl text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl md:text-8xl"
            >
              Sign in to keep your study space close.
            </h1>
            <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Your nickname and account settings stay with Supabase. Study data
              can be synced into this account later.
            </p>
          </div>

          <div className="animate-fade-rise-delay liquid-glass rounded-[28px] p-5 sm:p-6">
            {session ? (
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                  Signed in
                </p>
                <h2
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="mt-4 text-4xl font-normal text-white"
                >
                  {session.user.user_metadata?.nickname || session.user.email}
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/52">
                  Your account is active. Open Profile to edit your nickname or
                  change your password.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-medium text-[#071f2d] transition hover:scale-[1.02]"
                    to="/profile"
                  >
                    Open profile
                  </Link>
                  <button
                    className="rounded-full border border-white/12 px-7 py-3.5 text-sm text-white/70 transition-colors hover:border-white/24 hover:text-white"
                    onClick={handleSignOut}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1">
                  <button
                    className={`rounded-full px-4 py-2.5 text-sm transition ${
                      mode === "sign-in"
                        ? "bg-white text-[#071f2d]"
                        : "text-white/55 hover:text-white"
                    }`}
                    onClick={() => switchMode("sign-in")}
                    type="button"
                  >
                    Sign in
                  </button>
                  <button
                    className={`rounded-full px-4 py-2.5 text-sm transition ${
                      mode === "sign-up"
                        ? "bg-white text-[#071f2d]"
                        : "text-white/55 hover:text-white"
                    }`}
                    onClick={() => switchMode("sign-up")}
                    type="button"
                  >
                    Sign up
                  </button>
                </div>

                {mode === "sign-up" ? (
                  <>
                    <label className="mt-7 block text-sm text-white/48" htmlFor="nickname">
                      Nickname
                    </label>
                    <input
                      autoComplete="nickname"
                      className="mt-2 w-full border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-white/28"
                      id="nickname"
                      maxLength={32}
                      onChange={(event) => setNickname(event.target.value)}
                      placeholder="Your display name"
                      required
                      type="text"
                      value={nickname}
                    />
                  </>
                ) : null}

                <label className="mt-7 block text-sm text-white/48" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="mt-2 w-full border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-white/28"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />

                {mode !== "forgot" ? (
                  <>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <label className="block text-sm text-white/48" htmlFor="password">
                        Password
                      </label>
                      <button
                        className="text-xs text-white/42 transition-colors hover:text-white"
                        onClick={() => switchMode("forgot")}
                        type="button"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="mt-2 flex border border-white/10 bg-white/[0.055] focus-within:border-white/28">
                      <input
                        autoComplete={
                          mode === "sign-in" ? "current-password" : "new-password"
                        }
                        className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/24"
                        id="password"
                        minLength={6}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="At least 6 characters"
                        required
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                      />
                      <button
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        className="flex w-12 items-center justify-center text-white/45 transition-colors hover:text-white"
                        onClick={() => setIsPasswordVisible((current) => !current)}
                        type="button"
                      >
                        <EyeIcon isOpen={isPasswordVisible} />
                      </button>
                    </div>
                  </>
                ) : null}

                <button
                  className="mt-7 w-full rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#071f2d] transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60"
                  disabled={!isSupabaseConfigured || isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? "Working..."
                    : mode === "sign-in"
                      ? "Sign in"
                      : mode === "sign-up"
                        ? "Create account"
                        : "Send reset link"}
                </button>

                {mode === "forgot" ? (
                  <button
                    className="mt-4 w-full text-sm text-white/45 transition-colors hover:text-white"
                    onClick={() => switchMode("sign-in")}
                    type="button"
                  >
                    Back to sign in
                  </button>
                ) : null}

                {!isSupabaseConfigured ? (
                  <p className="mt-4 text-sm leading-7 text-[#f7d95d]/80">
                    Supabase environment variables are missing.
                  </p>
                ) : null}

                {message ? (
                  <p className="mt-4 text-sm leading-7 text-white/58">{message}</p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
