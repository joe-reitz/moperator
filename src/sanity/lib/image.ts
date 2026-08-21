import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: Image) {
  return builder.image(source);
}


/**
 * GROQ projection for an image asset that includes everything `next/image`
 * needs: the URL, intrinsic dimensions (to reserve layout and avoid CLS),
 * and Sanity's LQIP for a blur placeholder.
 */
export const IMAGE_ASSET_PROJECTION = `asset-> {
  url,
  metadata { lqip, dimensions { width, height } }
}`;

export type SanityImageAsset = {
  url: string;
  metadata?: {
    lqip?: string | null;
    dimensions?: { width: number; height: number } | null;
  } | null;
};

export type SanityImageRef = { asset: SanityImageAsset } | null;

/** Props for a blurred placeholder, when Sanity generated an LQIP for us. */
export function blurProps(asset?: SanityImageAsset | null) {
  return asset?.metadata?.lqip
    ? ({ placeholder: "blur", blurDataURL: asset.metadata.lqip } as const)
    : {};
}
