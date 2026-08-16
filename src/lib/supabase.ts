import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-supabase-url.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || supabasePublishableKey;

// Mandatory Supabase client instance
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Mandatory Supabase admin client instance for server-side API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

