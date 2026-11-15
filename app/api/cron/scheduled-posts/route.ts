export const dynamic = "force-dynamic";

/**
 * Runs every day just after midnight (Malaysia time, see vercel.json).
 * If a blog post is scheduled for today, it rebuilds the site so the post goes live.
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new Response("Unauthorized", { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!url || !key || !hook) return Response.json({ skipped: "not configured" });
  const today = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
  const r = await fetch(`${url}/rest/v1/content?kind=eq.post&deleted=eq.false&data->>date=eq.${today}&select=key`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const due = r.ok ? ((await r.json()) as unknown[]).length : 0;
  if (!due) return Response.json({ published: 0 });
  await fetch(hook, { method: "POST" });
  return Response.json({ published: due });
}
