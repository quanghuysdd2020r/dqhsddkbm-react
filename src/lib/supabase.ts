import { createClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://tyqidkljcjoshddmrsnh.supabase.co";
const defaultSupabasePublishableKey = "sb_publishable_2-KQL5A3r1Vcw4gP4UjFAQ_eIw1nJZY";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || defaultSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  defaultSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : null;
