import Image from "next/image";
import { client } from "@/sanity/lib/client";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blurProps, type SanityImageAsset } from "@/sanity/lib/image";

// Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/videos" },
  title: "Videos | The mOperator",
  description:
    "Video tutorials and walkthroughs for Marketing Operations professionals learning to build apps with AI.",
};

type Video = {
  _id: string;
  title: string;
  slug: { current: string };
  description: string | null;
  videoUrl: string;
  thumbnail: {
    asset: SanityImageAsset;
  } | null;
  duration: string | null;
  publishedAt: string | null;
  categories: {
    title: string;
    color: string | null;
  }[] | null;
};

async function getVideos(): Promise<Video[]> {
  return client.fetch(
    `*[_type == "video"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      videoUrl,
      thumbnail {
        asset-> {
          url,
          metadata { lqip, dimensions { width, height } }
        }
      },
      duration,
      publishedAt,
      categories[]-> {
        title,
        color
      }
    }`
  );
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen relative">
      <SiteHeader />

      <main id="main-content">

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-12 pb-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface mb-6">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-muted">Video Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Watch & <span className="text-accent">Learn</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Step-by-step video tutorials building real applications from scratch
            with AI-assisted development tools.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-20">
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-muted mb-2">Videos coming soon!</p>
            <p className="text-sm text-muted/70">Check back for tutorials and walkthroughs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video._id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden border border-border bg-surface hover:border-accent/30 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-surface-elevated overflow-hidden">
                  {video.thumbnail?.asset?.url ? (
                    <Image
                      src={video.thumbnail.asset.url}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      {...blurProps(video.thumbnail.asset)}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-border"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <svg
                        className="w-6 h-6 text-background ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Categories */}
                  {video.categories && video.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {video.categories.map((cat) => (
                        <span
                          key={cat.title}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: cat.color ? `${cat.color}20` : undefined,
                            color: cat.color || undefined,
                          }}
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {video.title}
                  </h2>

                  {video.description && (
                    <p className="text-sm text-muted line-clamp-2">
                      {video.description}
                    </p>
                  )}

                  {video.publishedAt && (
                    <p className="text-xs text-muted/70 mt-3">
                      {new Date(video.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      </main>

      <SiteFooter />
    </div>
  );
}


