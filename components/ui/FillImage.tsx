import Image from "next/image";

type Props = { src: string; alt: string; w: number; h?: number; quality?: number; priority?: boolean; className?: string; draggable?: boolean };

/**
 * Covers its (relative) parent like next/image `fill`, but with real width/height attributes
 * (no layout shift, SEO tools see the size) and a 1x/2x srcset sized to how big it is shown,
 * so the browser never downloads a bigger file than needed.
 * `w` = the largest width (in CSS px) the image is shown at.
 */
export default function FillImage({ src, alt, w, h, quality = 80, priority, className = "", draggable }: Props) {
  return (
    <Image src={src} alt={alt} width={w} height={h ?? Math.round(w * 1.25)} quality={quality} priority={priority} draggable={draggable}
      className={`absolute inset-0 w-full h-full ${className}`} />
  );
}
