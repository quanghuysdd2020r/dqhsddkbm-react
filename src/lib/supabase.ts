import { createClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://tyqidkljcjoshddmrsnh.supabase.co";
const defaultSupabasePublishableKey = "sb_publishable_2-KQL5A3r1Vcw4gP4UjFAQ_eIw1nJZY";

function getEnvValue(key: string) {
  const rawValue = import.meta.env[key] as string | undefined;

  if (!rawValue) {
    return undefined;
  }

  const value = rawValue.trim();
  const assignmentPrefix = `${key}=`;

  return value.startsWith(assignmentPrefix)
    ? value.slice(assignmentPrefix.length).trim()
    : value;
}

function isValidHttpUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const configuredSupabaseUrl = getEnvValue("VITE_SUPABASE_URL");
const configuredSupabaseAnonKey =
  getEnvValue("VITE_SUPABASE_ANON_KEY") ||
  getEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY");

const supabaseUrl =
  isValidHttpUrl(configuredSupabaseUrl) ? configuredSupabaseUrl : defaultSupabaseUrl;
const supabaseAnonKey = configuredSupabaseAnonKey || defaultSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : null;
