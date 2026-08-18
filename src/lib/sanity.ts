import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? "production";
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) ?? "2024-10-01";

/**
 * Sanity's query CDN can serve a warm cached response for ~60s after a publish,
 * which on top of the root loader's cache made Studio edits take minutes to show.
 * Going direct costs ~1 extra API call per loader refresh and shows edits in ~1s.
 * Set VITE_SANITY_USE_CDN=true to trade that freshness back for CDN throughput.
 */
const useCdn = import.meta.env.VITE_SANITY_USE_CDN === "true";

/**
 * The storefront runs with or without a Sanity project: when no project id is
 * configured we fall back to the bundled seed catalogue so the site still works.
 */
export const isSanityConfigured = Boolean(projectId);

export const sanityConfig = { projectId, dataset, apiVersion };

export const sanity: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion,
      useCdn,
      perspective: "published",
    })
  : null;

const builder = sanity ? createImageUrlBuilder(sanity) : null;

/** Build a CDN url for a Sanity image, resized and auto-formatted. */
export function urlFor(source: SanityImageSource, width = 900): string | null {
  if (!builder || !source) return null;
  try {
    return builder.image(source).width(width).fit("crop").auto("format").quality(80).url();
  } catch {
    return null;
  }
}
