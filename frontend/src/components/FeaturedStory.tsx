import RichText from "@/components/RichText";
import StoryDialog from "@/components/StoryDialog";
import VideoThumbnail from "@/components/VideoThumbnail";
import { mediaUrl } from "@/lib/cms";
import type { HomePage } from "@/payload-types";
import { langOf } from "@/lib/view-types";

type Story = NonNullable<HomePage["featuredStory"]>;

// Extract the 11-character video ID from a YouTube link. Only the ID is ever
// embedded, so a bad CMS value can never inject an arbitrary iframe URL.
function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  return m ? m[1] : null;
}

// Heading with one phrase (e.g. "Sewa Bharti") shown larger in saffron.
function Heading({ text, highlight }: { text: string; highlight?: string | null }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-[1.3em] text-saffron-700">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

// Bold text inside the story renders as a saffron highlight (more specific
// than RichText's default `[&_strong]` colour).
const HIGHLIGHT_BOLD = "[&_p_strong]:font-semibold [&_p_strong]:text-saffron-700";

// Featured story with a video — shown on the home page above the pillars.
// All content comes from CMS: Home Page → Featured story.
export default function FeaturedStory({ story }: { story: Story | null | undefined }) {
  if (!story || story.enabled === false) return null;
  const videoId = youTubeId(story.videoUrl);
  const hasText = Boolean(story.heading || story.intro || story.excerpt);
  if (!hasText && !videoId) return null;

  return (
    <section className="container-wide">
      <div
        className={`grid items-center gap-8 py-12 md:py-14 ${hasText && videoId ? "lg:grid-cols-[minmax(0,5fr)_auto_minmax(0,6fr)] lg:gap-8" : ""}`}
      >
        {hasText && (
          <div>
            {story.heading && (
              <h2 lang={langOf(story.heading)} className="text-xl font-bold leading-snug text-ink md:text-2xl">
                <Heading text={story.heading} highlight={story.headingHighlight} />
              </h2>
            )}
            {story.intro && (
              <p lang={langOf(story.intro)} className="mt-4 text-base text-ink-soft">
                {story.intro}
              </p>
            )}
            {story.excerpt && <RichText data={story.excerpt} className={`mt-3 ${HIGHLIGHT_BOLD}`} />}
            {story.story && (
              <StoryDialog label={story.readMoreLabel || (langOf(story.heading) === "hi" ? "पूरा पढ़ें" : "Read the full story")} title={story.heading}>
                {story.heading && (
                  <h2 lang={langOf(story.heading)} className="pr-10 text-lg font-bold leading-snug text-ink md:text-xl">
                    <Heading text={story.heading} highlight={story.headingHighlight} />
                  </h2>
                )}
                <RichText data={story.story} className={`mt-5 ${HIGHLIGHT_BOLD}`} />
              </StoryDialog>
            )}
          </div>
        )}

        {/* Separator between the text and the video: a vertical rule with a
            diamond on wide screens, a horizontal one when stacked. */}
        {hasText && videoId && (
          <div aria-hidden className="flex items-center justify-center gap-3 lg:h-full lg:flex-col">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-saffron-300 lg:h-auto lg:w-px lg:bg-gradient-to-b lg:from-transparent lg:to-saffron-300" />
            <span className="h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-saffron-400" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron-300 lg:h-auto lg:w-px lg:bg-gradient-to-t lg:from-transparent lg:to-saffron-300" />
          </div>
        )}

        {videoId && (
          <VideoThumbnail
            videoId={videoId}
            title={story.videoTitle || "Sewa Bharti video"}
            thumbnail={mediaUrl((story as { videoThumbnail?: unknown }).videoThumbnail as never, "hero")}
          />
        )}
      </div>
    </section>
  );
}
