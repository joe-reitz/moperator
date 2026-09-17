/**
 * Accept-header content negotiation.
 *
 * Implements RFC 9110 §12.5.1 proactive negotiation, following the algorithm
 * spelled out at https://acceptmarkdown.com/guides/accept-parsing:
 *
 *   for each type you can produce:
 *     find the best-matching accept entry
 *     (exact type match > text/* match > *\/* match)
 *     the score is that entry's q-value
 *     (0 if no match, or if matched entry had q=0)
 *   pick the type with the highest score
 *   if max score is 0, return 406
 *
 * Kept free of Next.js imports so it can be unit-tested directly.
 */

export type MediaRange = {
  /** Lower-cased type, or "*" for the full wildcard. */
  type: string;
  /** Lower-cased subtype, or "*". */
  subtype: string;
  /** Quality factor, 0..1. Defaults to 1 when absent. */
  q: number;
};

export type Negotiation =
  /** No usable constraint (no Accept header, or nothing parseable). Serve the default. */
  | { outcome: "default"; mediaType: string }
  /** The client asked for something we produce. */
  | { outcome: "match"; mediaType: string }
  /** Every representation we can produce was unlisted or explicitly refused (q=0). */
  | { outcome: "not-acceptable" };

/** RFC 9110 token characters, which is what a type/subtype may contain. */
const TOKEN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
const MEDIA_RANGE = new RegExp(`^(${TOKEN})/(${TOKEN})$`);

/**
 * Splits an Accept header into media ranges. Unparseable entries are dropped
 * rather than failing the whole header — a single malformed entry from a
 * scraper should not cost a real client its content.
 */
export function parseAcceptHeader(
  header: string | null | undefined
): MediaRange[] {
  if (header == null) return [];

  const ranges: MediaRange[] = [];

  for (const entry of header.split(",")) {
    const parts = entry.split(";");
    const token = (parts[0] ?? "").trim().toLowerCase();
    const match = MEDIA_RANGE.exec(token);
    if (!match) continue;

    const [, type, subtype] = match;
    // "*/json" is malformed: a wildcard type only pairs with a wildcard subtype.
    if (type === "*" && subtype !== "*") continue;

    ranges.push({ type, subtype, q: parseQuality(parts.slice(1)) });
  }

  return ranges;
}

/**
 * Reads the `q` parameter. Parameters before `q` belong to the media type and
 * anything after it is an accept-ext, so only the first `q` counts.
 */
function parseQuality(params: string[]): number {
  for (const param of params) {
    const eq = param.indexOf("=");
    if (eq === -1) continue;
    if (param.slice(0, eq).trim().toLowerCase() !== "q") continue;

    const value = Number.parseFloat(param.slice(eq + 1).trim());
    if (!Number.isFinite(value)) return 1;
    return Math.min(Math.max(value, 0), 1);
  }
  return 1;
}

/** Exact match beats a subtype wildcard, which beats the catch-all. */
function specificity(range: MediaRange, type: string, subtype: string): number {
  if (range.type === type && range.subtype === subtype) return 3;
  if (range.type === type && range.subtype === "*") return 2;
  if (range.type === "*" && range.subtype === "*") return 1;
  return 0;
}

/** The q-value of the most specific range matching `mediaType`, or 0. */
export function scoreMediaType(
  ranges: readonly MediaRange[],
  mediaType: string
): number {
  const [type, subtype] = mediaType.toLowerCase().split("/");

  let bestSpecificity = 0;
  let bestQuality = 0;

  for (const range of ranges) {
    const rank = specificity(range, type, subtype);
    if (rank === 0 || rank <= bestSpecificity) continue;
    bestSpecificity = rank;
    bestQuality = range.q;
  }

  return bestQuality;
}

/**
 * Picks a representation.
 *
 * `available` is in server-preference order: the first entry is the default and
 * wins ties, which is what makes `Accept: *\/*` (and a missing header) resolve
 * to HTML rather than to whichever type happens to sort first.
 */
export function negotiateMediaType(
  header: string | null | undefined,
  available: readonly string[]
): Negotiation {
  const fallback = available[0];
  if (fallback === undefined) return { outcome: "not-acceptable" };

  const ranges = parseAcceptHeader(header);

  // A missing header imposes no constraint, and neither does a header we could
  // not parse a single range out of — "when uncertain, a sensible default beats
  // an error" (https://acceptmarkdown.com/guides/returning-406).
  if (ranges.length === 0) return { outcome: "default", mediaType: fallback };

  let best = fallback;
  let bestScore = 0;

  for (const mediaType of available) {
    const score = scoreMediaType(ranges, mediaType);
    if (score > bestScore) {
      bestScore = score;
      best = mediaType;
    }
  }

  if (bestScore === 0) return { outcome: "not-acceptable" };

  return { outcome: "match", mediaType: best };
}
