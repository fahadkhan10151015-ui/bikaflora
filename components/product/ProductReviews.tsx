"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Star, Loader2, Trash2, PenLine } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useAuth, displayName } from "@/components/auth/AuthProvider";
import { useRatings } from "./RatingsProvider";

type Review = { id: string; user_id: string | null; name: string; rating: number; comment: string; created_at: string };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange(n)} className="p-0.5">
          <Star className={`w-8 h-8 transition ${(hover || value) >= n ? "fill-gold text-gold" : "text-blush-2"}`} />
        </button>
      ))}
    </div>
  );
}

/** Real customer reviews for one product, stored in Supabase. Anyone can write one; signed-in customers can also edit or delete theirs. */
export default function ProductReviews({ slug, productName }: { slug: string; productName: string }) {
  const { user } = useAuth();
  const ratings = useRatings();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [writing, setWriting] = useState(false);
  const [guestName, setGuestName] = useState("");

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return setReviews([]);
    const { data } = await sb.from("reviews").select("id,user_id,name,rating,comment,created_at").eq("product_slug", slug).order("created_at", { ascending: false }).limit(50);
    setReviews((data as Review[]) || []);
  }, [slug]);
  useEffect(() => { load(); }, [load]);

  const mine = reviews?.find((r) => r.user_id === user?.id);
  useEffect(() => { if (mine) { setRating(mine.rating); setComment(mine.comment); } }, [mine]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    if (!user && guestName.trim().length < 2) return setMsg("Please enter your name.");
    if (comment.trim().length < 3) return setMsg("Please write a few words about your bouquet.");
    setBusy(true); setMsg("");
    const name = (user ? displayName(user) || "Customer" : guestName.trim()).slice(0, 60);
    const row = { product_slug: slug, user_id: user ? user.id : null, name, rating, comment: comment.trim().slice(0, 1000) };
    const { error } = mine
      ? await sb.from("reviews").update({ rating: row.rating, comment: row.comment, name: row.name }).eq("id", mine.id)
      : await sb.from("reviews").insert(row);
    setBusy(false);
    if (error) return setMsg("Sorry, your review could not be saved. Please try again.");
    setMsg(mine ? "Your review was updated. Thank you!" : "Thank you for your review!");
    setWriting(false);
    if (!user) { setComment(""); setGuestName(""); setRating(5); }
    load();
    ratings.reload();
  }

  async function remove() {
    const sb = getSupabase();
    if (!sb || !mine) return;
    await sb.from("reviews").delete().eq("id", mine.id);
    setComment(""); setRating(5); setMsg("Your review was removed.");
    load();
    ratings.reload();
  }

  const avg = reviews?.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-16" aria-labelledby="customer-reviews">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow mb-1">Customer reviews</div>
          <h2 id="customer-reviews" className="text-3xl font-semibold">What customers say</h2>
          {reviews && reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-4 h-4 ${Math.round(avg) >= n ? "fill-gold text-gold" : "text-blush-2"}`} />)}</span>
              <b>{avg.toFixed(1)}</b><span className="text-muted">from {reviews.length} review{reviews.length > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        {!writing && <button onClick={() => { setWriting(true); setMsg(""); }} className="btn btn-primary !py-2.5"><PenLine className="w-4 h-4" /> {mine ? "Edit your review" : "Write a review"}</button>}
      </div>

      {msg && <p className="mb-4 text-sm font-medium text-brand">{msg}</p>}

      {writing && (
        <form onSubmit={submit} className="bg-white rounded-3xl border border-blush-2 p-5 md:p-6 mb-6 space-y-4">
          <div>
            <div className="label">Your rating for {productName}</div>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          {!user && (
            <div>
              <label htmlFor="review-name" className="label">Your name</label>
              <input id="review-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} maxLength={60} placeholder="e.g. Aisyah" className="input" autoComplete="given-name" />
            </div>
          )}
          <div>
            <label htmlFor="review-text" className="label">Your review</label>
            <textarea id="review-text" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} rows={4}
              placeholder="How were the flowers, the wrapping and the delivery?" className="input" />
            <div className="text-xs text-muted text-right mt-1">{comment.length}/1000</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={busy} className="btn btn-primary">{busy && <Loader2 className="w-4 h-4 animate-spin" />} {mine ? "Update review" : "Post review"}</button>
            <button type="button" onClick={() => setWriting(false)} className="btn btn-outline">Cancel</button>
            {mine && <button type="button" onClick={remove} className="ml-auto text-sm text-muted hover:text-red-600 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete my review</button>}
          </div>
          {user ? (
            <p className="text-xs text-muted">Posted as <b>{displayName(user) || "Customer"}</b>. Your email is never shown.</p>
          ) : (
            <p className="text-xs text-muted">No account needed. <Link href={`/login?next=/product/${slug}`} className="underline">Log in</Link> if you want to edit your review later.</p>
          )}
        </form>
      )}

      {reviews === null ? (
        <div className="h-24 grid place-items-center text-muted"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-blush-2 p-6 text-center text-muted">No reviews yet for this bouquet. Be the first to share your experience!</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <article key={r.id} className="bg-white rounded-3xl border border-blush-2/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand text-white grid place-items-center font-semibold">{r.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <div className="font-semibold leading-tight">{r.name}</div>
                    <div className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <span className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`w-4 h-4 ${r.rating >= n ? "fill-gold text-gold" : "text-blush-2"}`} />)}</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
