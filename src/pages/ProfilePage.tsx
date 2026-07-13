import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
  checkNicknameAvailability,
  getProfile,
  isEmailConfirmed,
  saveUserProfile,
  validateNickname,
} from "../lib/profiles";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

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

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null);
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const activeSession = session && isEmailConfirmed(session) ? session : null;

  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function loadProfile(nextSession: Session | null) {
      setSession(nextSession);

      if (!nextSession) {
        setNickname("");
        return;
      }

      const { data } = await getProfile(nextSession.user.id);

      setNickname(
        data?.nickname ??
          (typeof nextSession.user.user_metadata?.nickname === "string"
            ? nextSession.user.user_metadata.nickname
            : ""),
      );
    }

    supabase.auth.getSession().then(({ data }) => {
      void loadProfile(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void loadProfile(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleNicknameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !activeSession) {
      setProfileMessage("Supabase is not configured yet.");
      return;
    }

    setIsProfileSaving(true);
    setProfileMessage(null);

    const validation = validateNickname(nickname);

    if (!validation.ok) {
      setProfileMessage(validation.message);
      setIsProfileSaving(false);
      return;
    }

    const availability = await checkNicknameAvailability(
      validation.nickname,
      activeSession.user.id,
    );

    if (availability.error) {
      setProfileMessage("Profile table is not ready. Run supabase/profiles.sql first.");
      setIsProfileSaving(false);
      return;
    }

    if (!availability.available) {
      setProfileMessage("This nickname is already taken.");
      setIsProfileSaving(false);
      return;
    }

    const { error } = await saveUserProfile(activeSession, validation.nickname);

    if (error) {
      setProfileMessage(
        error.message.includes("duplicate") || error.message.includes("unique")
          ? "This nickname is already taken."
          : error.message,
      );
      setIsProfileSaving(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setNickname(validation.nickname);
    setProfileMessage("Nickname updated.");
    setIsProfileSaving(false);
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !activeSession) {
      setPasswordMessage("Supabase is not configured yet.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setIsPasswordSaving(true);
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage("Password updated.");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordVisible(false);
    }

    setIsPasswordSaving(false);
  }

  const displayName =
    nickname.trim() || activeSession?.user.email?.split("@")[0] || "Profile";
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#071f2d] text-white">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden px-6 py-32 sm:py-40">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_32%),radial-gradient(circle_at_74%_20%,rgba(247,217,93,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="animate-fade-rise mb-5 text-xs uppercase tracking-[0.34em] text-white/45">
            Profile
          </p>

          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <div className="liquid-glass flex h-24 w-24 items-center justify-center rounded-[30px] text-4xl text-white">
                {avatarInitial}
              </div>
              <h1
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="mt-8 max-w-3xl text-6xl font-normal leading-[0.92] tracking-[-1px] sm:text-7xl"
              >
                {displayName}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Manage the public nickname shown in dqhsddkbm and update your
                account password.
              </p>
            </div>

            {!activeSession ? (
              <div className="liquid-glass rounded-[28px] p-6">
                <h2
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-4xl font-normal text-white"
                >
                  Sign in required.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/55">
                  You need to sign in before editing your profile.
                </p>
                <Link
                  className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#071f2d] transition hover:scale-[1.02]"
                  to="/sign-in"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                <form
                  className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm"
                  onSubmit={handleNicknameSubmit}
                >
                  <div className="border-b border-white/10 pb-5">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                      Public profile
                    </p>
                    <h2
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                      className="mt-3 text-4xl font-normal text-white"
                    >
                      Edit nickname.
                    </h2>
                  </div>

                  <label className="mt-6 block text-sm text-white/48" htmlFor="profile-nickname">
                    Nickname
                  </label>
                  <input
                    autoComplete="nickname"
                    className="mt-2 w-full border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-white/28"
                    id="profile-nickname"
                    maxLength={32}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="Your display name"
                    required
                    type="text"
                    value={nickname}
                  />

                  <p className="mt-3 text-sm text-white/36">
                    {activeSession.user.email}
                  </p>

                  <button
                    className="mt-7 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#071f2d] transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                    disabled={!isSupabaseConfigured || isProfileSaving}
                    type="submit"
                  >
                    {isProfileSaving ? "Saving..." : "Save nickname"}
                  </button>

                  {profileMessage ? (
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      {profileMessage}
                    </p>
                  ) : null}
                </form>

                <form
                  className="border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm"
                  onSubmit={handlePasswordSubmit}
                >
                  <div className="border-b border-white/10 pb-5">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                      Security
                    </p>
                    <h2
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                      className="mt-3 text-4xl font-normal text-white"
                    >
                      Change password.
                    </h2>
                  </div>

                  <label className="mt-6 block text-sm text-white/48" htmlFor="new-password">
                    New password
                  </label>
                  <div className="mt-2 flex border border-white/10 bg-white/[0.055] focus-within:border-white/28">
                    <input
                      autoComplete="new-password"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/24"
                      id="new-password"
                      minLength={6}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      required
                      type={isPasswordVisible ? "text" : "password"}
                      value={newPassword}
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

                  <label className="mt-5 block text-sm text-white/48" htmlFor="confirm-password">
                    Confirm password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="mt-2 w-full border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-white/28"
                    id="confirm-password"
                    minLength={6}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat new password"
                    required
                    type={isPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                  />

                  <button
                    className="mt-7 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#071f2d] transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                    disabled={!isSupabaseConfigured || isPasswordSaving}
                    type="submit"
                  >
                    {isPasswordSaving ? "Updating..." : "Update password"}
                  </button>

                  {passwordMessage ? (
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      {passwordMessage}
                    </p>
                  ) : null}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
