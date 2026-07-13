import type { Session } from "@supabase/supabase-js";

import { supabase } from "./supabase";

const reservedNicknames = new Set([
  "admin",
  "about",
  "api",
  "blogs",
  "dqhsddkbm",
  "focus",
  "help",
  "profile",
  "shop",
  "sign-in",
  "study",
  "support",
]);

export type ProfileRow = {
  id: string;
  email: string | null;
  nickname: string;
  nickname_normalized: string;
};

export function normalizeNickname(value: string) {
  return value.trim().toLowerCase().replace(/^@+/, "");
}

export function validateNickname(value: string) {
  const nickname = normalizeNickname(value);

  if (nickname.length < 3 || nickname.length > 30) {
    return {
      ok: false,
      message: "Nickname must be 3-30 characters.",
      nickname,
    };
  }

  if (!/^[a-z0-9._]+$/.test(nickname)) {
    return {
      ok: false,
      message: "Nickname can only use letters, numbers, dots, and underscores.",
      nickname,
    };
  }

  if (nickname.startsWith(".") || nickname.endsWith(".") || nickname.includes("..")) {
    return {
      ok: false,
      message: "Nickname cannot start/end with a dot or contain consecutive dots.",
      nickname,
    };
  }

  if (reservedNicknames.has(nickname)) {
    return {
      ok: false,
      message: "This nickname is reserved.",
      nickname,
    };
  }

  return {
    ok: true,
    message: "",
    nickname,
  };
}

export function isEmailConfirmed(session: Session | null) {
  return Boolean(session?.user.email_confirmed_at || session?.user.confirmed_at);
}

export async function getProfile(userId: string) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured yet.") };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,nickname,nickname_normalized")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  return { data, error };
}

export async function checkNicknameAvailability(
  nickname: string,
  currentUserId?: string,
) {
  if (!supabase) {
    return { available: false, error: new Error("Supabase is not configured yet.") };
  }

  const normalized = normalizeNickname(nickname);
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname_normalized", normalized)
    .maybeSingle<{ id: string }>();

  if (error) {
    return { available: false, error };
  }

  return {
    available: !data || data.id === currentUserId,
    error: null,
  };
}

export async function saveUserProfile(session: Session, nickname: string) {
  if (!supabase) {
    return { error: new Error("Supabase is not configured yet.") };
  }

  const normalized = normalizeNickname(nickname);
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      email: session.user.email,
      id: session.user.id,
      nickname: normalized,
      nickname_normalized: normalized,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );

  if (profileError) {
    return { error: profileError };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      nickname: normalized,
    },
  });

  return { error: authError };
}
