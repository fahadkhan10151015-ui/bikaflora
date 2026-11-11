// Soft studio backdrops shown behind transparent product photos.
// (Normal photos simply cover the backdrop, so this is safe for real photos too.)
export const tones = {
  blush: "linear-gradient(180deg,#fff4f7 0%,#f6d6e0 100%)",
  cream: "linear-gradient(180deg,#fffcf7 0%,#f3e7d6 100%)",
  sage: "linear-gradient(180deg,#f7faf5 0%,#d6e4d6 100%)",
  lavender: "linear-gradient(180deg,#faf7fd 0%,#e2d8f3 100%)",
  peach: "linear-gradient(180deg,#fff7f1 0%,#fadac8 100%)",
  white: "linear-gradient(180deg,#ffffff 0%,#f0ecec 100%)",
} as const;
export type Tone = keyof typeof tones;
export const toneBg = (t?: string) => ({ background: tones[(t as Tone) || "blush"] || tones.blush });
