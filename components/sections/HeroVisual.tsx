import { site } from "@/lib/site";
import { siteImages } from "@/lib/images";

/** Full-width hero background video (falls back to a photo while loading). */
export default function HeroVisual() {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay muted loop playsInline preload="metadata"
      poster={siteImages.heroPoster}
      aria-hidden="true"
    >
      <source src={site.heroVideo} type="video/mp4" />
    </video>
  );
}
