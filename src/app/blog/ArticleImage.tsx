import Image from "next/image";
import type { Image as SanityImage } from "sanity";
import { urlFor } from "@/sanity/lib/image";

export type BodyImage = SanityImage & {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
};

/**
 * Sanity asset refs encode the source dimensions:
 *   image-{hash}-{width}x{height}-{ext}
 * Reading them here avoids having to expand the asset in every GROQ query just
 * to give next/image the intrinsic size it needs to reserve layout.
 */
function dimensionsFromRef(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/i);
  if (!match) return { width: 1200, height: 800 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

/**
 * Images placed inside article body copy. Without a renderer registered for the
 * "image" type, Portable Text drops these silently, which is what happened to
 * the screenshots pasted into the Vibecoding post.
 */
export function ArticleImage({ value }: { value: BodyImage }) {
  const ref = value?.asset?._ref;
  if (!ref) return null;

  const { width, height } = dimensionsFromRef(ref);
  const src = urlFor(value).width(1520).fit("max").auto("format").url();

  return (
    <figure className="article-figure">
      <Image
        src={src}
        alt={value.alt ?? ""}
        width={width}
        height={height}
        sizes="(max-width: 800px) 100vw, 760px"
      />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}
