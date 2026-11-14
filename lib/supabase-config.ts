export const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Loads the Supabase library only when it is needed (not part of the first page download). */
export async function loadSupabase() {
  if (!authConfigured) return null;
  const { getSupabase } = await import("./supabase");
  return getSupabase();
}
