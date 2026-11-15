"use client";
import { loadSupabase } from "@/lib/supabase-config";

/** Reads one settings document (a row in the content table, kind "page"). Throws if it cannot be read. */
export async function loadDoc<T>(slug: string): Promise<T | null> {
  const sb = await loadSupabase();
  const { data, error } = (await sb?.from("content").select("data,deleted").eq("key", `page:${slug}`).maybeSingle()) ?? { data: null, error: null };
  if (error) throw new Error(error.message);
  return data && !data.deleted ? (data.data as T) : null;
}

/** Saves one settings document. Returns an error message, or "" when saved. */
export async function saveDoc(slug: string, data: unknown): Promise<string> {
  const sb = await loadSupabase();
  if (!sb) return "Not connected.";
  const { error } = await sb.from("content").upsert({ key: `page:${slug}`, kind: "page", data, deleted: false, updated_at: new Date().toISOString() });
  return error?.message ?? "";
}
