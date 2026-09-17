import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/seo/config";
import {
  MARKDOWN_MEDIA_TYPE,
  canonicalPathFromContentPath,
} from "@/lib/agents/negotiation";
import {
  STATIC_DOCUMENTS,
  buildBlogIndexDocument,
  buildNotFoundDocument,
  buildPostDocument,
  buildReposDocument,
  buildVideosDocument,
  renderDocument,
  type DocumentSource,
  type PostDetail,
  type PostSummary,
  type RepoSummary,
  type VideoSummary,
} from "@/lib/agents/documents";

/**
 * The markdown representation of every page.
 *
 * Two ways in, both routed here by `proxy.ts`:
 *   - `GET /about` with `Accept: text/markdown` (same-URL negotiation)
 *   - `GET /about.md` (explicit URL)
 *
 * Nothing links to `/md/...` directly; it exists because a rewrite needs
 * somewhere to land. Every response carries a canonical Link header pointing
 * back at the HTML page so the two representations are never treated as
 * duplicate content.
 *
 * Convention: https://acceptmarkdown.com
 */

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

/** Matches the one-hour window the HTML pages and llms.txt already use. */
export const revalidate = 3600;

function markdownResponse(
  body: string,
  canonicalPath: string,
  status = 200
): Response {
  const canonicalUrl =
    canonicalPath === "/" ? siteConfig.url : `${siteConfig.url}${canonicalPath}`;

  return new Response(body, {
    status,
    headers: {
      "Content-Type": `${MARKDOWN_MEDIA_TYPE}; charset=utf-8`,
      // Without this a CDN can hand the HTML variant to an agent that asked for
      // markdown, or the reverse, depending on which landed in cache first.
      Vary: "Accept, Accept-Encoding",
      Link: `<${canonicalUrl}>; rel="canonical"`,
      "Cache-Control":
        status === 200 ? CACHE_CONTROL : "public, s-maxage=60",
    },
  });
}

async function loadBlogIndex(): Promise<DocumentSource> {
  const posts = await client.fetch<PostSummary[]>(
    `*[_type == "post" && defined(slug.current)]
      | order(coalesce(publishedAt, _updatedAt) desc) {
        title, "slug": slug.current, excerpt, publishedAt
      }`
  );
  return buildBlogIndexDocument(posts);
}

async function loadPost(slug: string): Promise<DocumentSource | null> {
  const post = await client.fetch<PostDetail | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "updatedAt": _updatedAt,
      "authorName": author->name,
      "tag": categories[0]->title,
      metaDescription,
      body[] {
        ...,
        _type == "image" => { ..., asset-> { url } }
      }
    }`,
    { slug }
  );

  return post ? buildPostDocument(post) : null;
}

async function loadVideos(): Promise<DocumentSource> {
  const videos = await client.fetch<VideoSummary[]>(
    `*[_type == "video"] | order(publishedAt desc) {
      title, description, videoUrl, duration, publishedAt
    }`
  );
  return buildVideosDocument(videos);
}

async function loadRepos(): Promise<DocumentSource> {
  const repos = await client.fetch<RepoSummary[]>(
    `*[_type == "repo"] | order(featured desc, order asc, _createdAt desc) {
      title, description, githubUrl, demoUrl, tags
    }`
  );
  return buildReposDocument(repos);
}

/** Resolves a canonical site path to its markdown document, or null for a 404. */
async function resolveDocument(
  canonicalPath: string
): Promise<DocumentSource | null> {
  const staticDocument = STATIC_DOCUMENTS[canonicalPath];
  if (staticDocument) return staticDocument;

  if (canonicalPath === "/blog") return loadBlogIndex();
  if (canonicalPath === "/videos") return loadVideos();
  if (canonicalPath === "/repos") return loadRepos();

  if (canonicalPath.startsWith("/blog/")) {
    const slug = canonicalPath.slice("/blog/".length);
    // Only a single segment is a post; `/blog/a/b` is not a real URL.
    if (slug !== "" && !slug.includes("/")) return loadPost(slug);
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const canonicalPath = canonicalPathFromContentPath(
    `/md${path?.length ? `/${path.join("/")}` : ""}`
  );

  const document = await resolveDocument(canonicalPath);

  if (!document) {
    return markdownResponse(
      buildNotFoundDocument(canonicalPath),
      canonicalPath,
      404
    );
  }

  return markdownResponse(renderDocument(canonicalPath, document), canonicalPath);
}
