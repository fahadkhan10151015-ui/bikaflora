/** Tiny read-only Supabase query (plain fetch), so pages don't need the 250 KB Supabase library just to read reviews. */
export async function restGet<T>(pathAndQuery: string): Promise<T | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const r = await fetch(`${url}/rest/v1/${pathAndQuery}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch { return null; }
}
