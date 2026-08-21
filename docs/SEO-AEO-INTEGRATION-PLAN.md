# SEO/AEO Optimizer Integration Plan

## Context

The user has a standalone SEO/AEO Optimizer (`moperator-seo-aeo-optimizer`) that generates SEO metadata, JSON-LD structured schema, and OG image prompts using Claude AI. They want to integrate this tool into their main mOperator site (Next.js + Sanity CMS) so it's accessible at `/studio/seo-aeo`, update the post schema to store the generated data, add an OG image field, and enable auto-fill from the Sanity Studio editor.

**Key constraint**: The mOperator project uses Tailwind CSS v4 with raw CSS variables (no shadcn/ui), while the optimizer uses Tailwind v3 + shadcn/ui + 50 Radix UI components. We'll port the UI using mOperator's native styling to avoid dependency bloat and CSS conflicts.

---

## Step 1: Install Dependencies

Add to `package.json`:
- `ai` + `@ai-sdk/anthropic` - Vercel AI SDK for Claude calls
- `zod` - structured output validation
- `lucide-react` - icons used in the SEO tool UI
- `react-markdown` - markdown preview in the input form
- `clsx` - lightweight className utility

**File**: `package.json`

---

## Step 2: Update Post Schema with SEO/AEO Fields

Add new fields to `src/sanity/schemaTypes/post.ts`:

- `seoTitle` (string) - SEO-optimized title, separate from display title
- `metaDescription` (text) - Meta description for search results
- `primaryKeyword` (string) - Main target keyword
- `secondaryKeywords` (array of strings) - Secondary keywords
- `ogImage` (image, with hotspot) - Dedicated OpenGraph image (1200x630)
- `schemaMarkup` (text) - Full JSON-LD schema as text (stored as stringified JSON)

Group these in a fieldset called "SEO & AEO" so they're collapsible in the editor. Keep the existing `excerpt` field (already present).

**File**: `src/sanity/schemaTypes/post.ts`

---

## Step 3: Create API Routes

Port the two API endpoints from the optimizer:

### `/api/generate-seo/route.ts`
- Accepts `{ title, body, targetKeyword?, audiencePersona? }`
- Calls Claude Sonnet via Vercel AI SDK with the SEO/AEO system prompt
- Returns structured SEO metadata + JSON-LD schema via Zod validation
- Port the `seoOutputSchema` Zod schema and system/user prompts as-is

### `/api/generate-og/route.ts`
- Accepts `{ title, description? }`
- Generates an AI image prompt for OG images
- Returns the prompt text

### Supporting files
- `src/lib/seo/config.ts` - Site configuration (ported from optimizer's `lib/config.ts`)
- `src/lib/seo/model.ts` - AI model selection (direct Anthropic API or Vercel AI Gateway)

**Files**:
- `src/app/api/generate-seo/route.ts`
- `src/app/api/generate-og/route.ts`
- `src/lib/seo/config.ts`
- `src/lib/seo/model.ts`

---

## Step 4: Create the SEO/AEO Optimizer Page

Create a standalone page at `/studio/seo-aeo` (Next.js route takes priority over the Sanity `[[...tool]]` catch-all).

Port the 4 main components, restyled with mOperator's native CSS variables (no shadcn/Radix dependencies):

1. **SEOInputForm** - Title input, body textarea with write/preview tabs, keyword + persona inputs, generate button
2. **SEOMetadataCard** - Displays generated SEO title, meta description, excerpt, slug, keywords with copy buttons
3. **SchemaCard** - Displays JSON-LD with syntax highlighting, schema type badges, copy button
4. **OGPreviewCard** - Visual OG image preview (canvas-rendered), download PNG button, image prompt display

Port the 3 hooks:
- `useKeyboardShortcuts` - Cmd/Ctrl + Enter
- `useLocalStorageDraft` - Auto-save drafts
- `useGenerationHistory` - Save last 10 generations

**Files**:
- `src/app/studio/seo-aeo/page.tsx` (main page)
- `src/components/seo-aeo/seo-input-form.tsx`
- `src/components/seo-aeo/seo-metadata-card.tsx`
- `src/components/seo-aeo/schema-card.tsx`
- `src/components/seo-aeo/og-preview-card.tsx`
- `src/hooks/use-keyboard-shortcuts.ts`
- `src/hooks/use-local-storage-draft.ts`
- `src/hooks/use-generation-history.ts`

---

## Step 5: Auto-fill Document Action in Sanity Studio

Create a custom Sanity document action that appears as a button ("Generate SEO") in the post editor toolbar.

When clicked:
1. Reads the current document's `title` and `body` (Portable Text)
2. Converts Portable Text body to plain text (simple extraction of text from blocks)
3. Calls `/api/generate-seo` with the content
4. Patches the document fields: `seoTitle`, `metaDescription`, `excerpt`, `primaryKeyword`, `secondaryKeywords`, `schemaMarkup`
5. Shows a toast/status indicator during generation

Register the custom action in `sanity.config.ts` for the `post` document type only.

**Files**:
- `src/sanity/actions/generateSeoAction.tsx`
- `sanity.config.ts` (add document actions config)

---

## Step 6: Update Blog Post Page to Use SEO Fields

Update `src/app/blog/[slug]/page.tsx`:
- Fetch the new SEO fields in the GROQ query
- Use `seoTitle` for the page title metadata (fallback to `title`)
- Use `metaDescription` for the description metadata (fallback to `excerpt`)
- Inject `schemaMarkup` as a `<script type="application/ld+json">` tag
- Use `ogImage` for OpenGraph metadata if set (fallback to `mainImage`)

**File**: `src/app/blog/[slug]/page.tsx`

---

## Step 7: Password-Protect the SEO Tool & API Routes

Protect `/studio/seo-aeo` and the `/api/generate-seo` + `/api/generate-og` routes so only authenticated users can access them (prevents public from running up the AI Gateway bill).

**Approach**: Cookie-based password protection via Next.js middleware.

1. Add `STUDIO_SEO_PASSWORD` env variable
2. Create Next.js middleware (`middleware.ts`) that checks for a valid session cookie on:
   - `/studio/seo-aeo` (the tool page)
   - `/api/generate-seo` (SEO API)
   - `/api/generate-og` (OG API)
3. If no valid cookie, redirect to a simple password gate page
4. Password gate page (`/studio/seo-aeo/login`) - minimal form that POSTs to `/api/auth/seo-studio`
5. Auth API route validates password against env var, sets an httpOnly signed cookie (e.g., 7-day expiry)
6. On success, redirects back to `/studio/seo-aeo`

**Files**:
- `middleware.ts` (project root)
- `src/app/studio/seo-aeo/login/page.tsx`
- `src/app/api/auth/seo-studio/route.ts`

---

## Step 8: Add Environment Variables

Update `.env.example` with:
- `ANTHROPIC_API_KEY` - for AI generation
- `STUDIO_SEO_PASSWORD` - password for the SEO tool

**File**: `.env.example`

---

## Verification

1. Run `pnpm install` to install new deps
2. Visit `/studio/seo-aeo` unauthenticated - should redirect to login page
3. Enter the correct password - should redirect to the optimizer UI
4. Enter a test post title + body, click Generate - should return SEO metadata + schema + OG prompt
5. Open a post in Sanity Studio at `/studio` - should see the new SEO fieldset and "Generate SEO" button
6. Click "Generate SEO" on a post with content - should auto-fill all SEO fields
7. Visit a published blog post - should see JSON-LD in page source and proper meta tags
8. Download a PNG from the OG preview - should produce a 1200x630 branded image
9. Call `/api/generate-seo` directly without auth cookie - should be rejected
