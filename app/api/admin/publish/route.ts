import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Publish button in /admin: checks the caller is an admin, then asks Vercel to rebuild the site
 * (the build pulls the saved product/SEO edits). Needs the VERCEL_DEPLOY_HOOK environment variable.
 */
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) return Response.json({ error: "Not signed in" }, { status: 401 });
  const sb = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: isAdmin, error } = await sb.rpc("is_admin");
  if (error || !isAdmin) return Response.json({ error: "Not allowed" }, { status: 403 });
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) return Response.json({ error: "Publishing is not connected yet (VERCEL_DEPLOY_HOOK missing)." }, { status: 501 });
  const r = await fetch(hook, { method: "POST" });
  if (!r.ok) return Response.json({ error: `Vercel answered ${r.status}` }, { status: 502 });
  return Response.json({ ok: true });
}
