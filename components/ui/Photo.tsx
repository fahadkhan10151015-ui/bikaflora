import Image from "next/image";
import { toneBg } from "@/lib/tones";

type Props = { src: string; alt: string; tone?: string; sizes: string; priority?: boolean; className?: string; imgClassName?: string };

/** Image on a soft studio backdrop. Parent decides the size (e.g. aspect-[4/5]). */
export default function Photo({ src, alt, tone, sizes, priority, className = "", imgClassName = "" }: Props) {
  return (
    <div className={`absolute inset-0 ${className}`} style={toneBg(tone)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
