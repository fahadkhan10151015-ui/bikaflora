import FillImage from "./FillImage";
import { toneBg } from "@/lib/tones";

type Props = { src: string; alt: string; tone?: string; sizes?: string; w?: number; h?: number; priority?: boolean; quality?: number; className?: string; imgClassName?: string };

/** Image on a soft studio backdrop. Parent decides the size (e.g. aspect-[4/5]). `w` = largest width it is shown at. */
export default function Photo({ src, alt, tone, w = 400, h, priority, quality, className = "", imgClassName = "" }: Props) {
  return (
    <div className={`absolute inset-0 ${className}`} style={toneBg(tone)}>
      <FillImage src={src} alt={alt} w={w} h={h} priority={priority} quality={quality} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
