import Image from "next/image";

type Props = { src: string; alt: string; w: number; sizes?: string; h?: number; quality?: number; priority?: boolean; loading?: "eager" | "lazy"; className?: string; draggable?: boolean };

/**
 * Covers its (relative) parent like next/image `fill`, but with real width/height attributes
 * (no layout shift, SEO tools see the size) and a 1x/2x srcset sized to how big it is shown,
 * so the browser never downloads a bigger file than needed.
 * `w` = the largest width (in CSS px) the image is shown at.
 * `sizes` (optional) = how wide it is on each screen, so phones get a smaller file.
 */
export default function FillImage({ src, alt, w, sizes, h, quality = 80, priority, loading, className = "", draggable }: Props) {
  return (
    <Image src={src} alt={alt} width={w} sizes={sizes} height={h ?? Math.round(w * 1.25)} quality={quality} preload={priority} fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : loading} draggable={draggable}
      className={`absolute inset-0 w-full h-full ${className}`} />
  );
}
