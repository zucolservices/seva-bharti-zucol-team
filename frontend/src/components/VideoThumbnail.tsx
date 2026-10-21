import Image from "next/image";

// A thumbnail with a play button. Clicking it opens the video on YouTube in a
// new tab (no embedded player). Uses the uploaded thumbnail, else YouTube's own.
export default function VideoThumbnail({
  videoId,
  title,
  thumbnail,
}: {
  videoId: string;
  title: string;
  /** Uploaded thumbnail URL; empty = YouTube's own thumbnail. */
  thumbnail?: string | null;
}) {
  const src = thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch on YouTube: ${title} (opens in new tab)`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-saffron-100"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 700px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        unoptimized={!thumbnail}
      />
      <span aria-hidden className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
      <span aria-hidden className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-saffron-500 text-ink shadow-lg transition-transform group-hover:scale-110 md:h-24 md:w-24">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
