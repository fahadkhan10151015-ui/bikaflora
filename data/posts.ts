import { content } from "@/lib/content";
import blogPosts from "./blog-posts.json";
// Blog posts for SEO. Add more posts by copying an entry.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tone?: string;
  sections: { heading: string; body: string }[];
  /** Full article HTML written in the admin panel (used instead of `sections` when set). */
  html?: string;
  seoTitle?: string;
  keyword?: string;
  author?: string;
  category?: string;
  imageAlt?: string;
};

/** Blog categories (editable in the admin panel). */
export const blogCategories: string[] = Array.isArray((content.page["blog-categories"] as { list?: string[] } | undefined)?.list)
  ? (content.page["blog-categories"] as { list: string[] }).list
  : ["Guides", "Gift ideas", "Flower care", "Occasions"];

export const posts: Post[] = [];

// Longer guides kept in data/blog-posts.json (each one goes live on its date).
for (const b of blogPosts as Omit<Post, "sections">[]) if (!posts.some((p) => p.slug === b.slug)) posts.push({ ...b, sections: [] });

// Blog edits from the admin panel: edit, add or delete posts.
for (const [slug, doc] of Object.entries(content.post)) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (doc.deleted) { if (i >= 0) posts.splice(i, 1); continue; }
  const d = doc as Partial<Post>;
  if (i >= 0) posts[i] = { ...posts[i], ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== null)), slug };
  else if (d.title && d.html) posts.push({ ...(Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== null)) as Partial<Post>), slug, title: d.title, description: d.description ?? "", date: d.date ?? new Date().toISOString().slice(0, 10), image: d.image ?? "/images/site/cover.webp", sections: [], html: d.html });
}
posts.sort((a, b) => b.date.localeCompare(a.date));

// Scheduled posts (date in the future, Malaysia time) stay hidden until that day. A daily job republishes the site.
const todayMY = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
/** Every post, including ones scheduled for a later date (for the admin panel and the daily publish job). */
export const allPosts: Post[] = [...posts];
for (let i = posts.length - 1; i >= 0; i--) if (posts[i].date > todayMY) posts.splice(i, 1);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
