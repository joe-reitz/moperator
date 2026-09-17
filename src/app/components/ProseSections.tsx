import type { ProseSection } from "@/lib/site/trust-pages";

/**
 * Renders the shared trust-page copy (see `src/lib/site/trust-pages.ts`) as
 * HTML. The same sections are rendered as markdown by
 * `proseSectionsToMarkdown`, so /contact and /privacy say the same thing to a
 * person and to an agent.
 */
export function ProseSections({ sections }: { sections: readonly ProseSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-4 text-xl font-semibold tracking-[var(--tracking-display)] text-foreground sm:text-2xl">
            {section.heading}
          </h2>

          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mb-4 text-base leading-relaxed text-muted last:mb-0"
            >
              {paragraph}
            </p>
          ))}

          {section.bullets?.length ? (
            <ul className="mt-5 space-y-2.5">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet.slice(0, 48)}
                  className="flex gap-3 text-base leading-relaxed text-muted"
                >
                  <span aria-hidden="true" className="mt-[2px] text-accent">
                    ▸
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
