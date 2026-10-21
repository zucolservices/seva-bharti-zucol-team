// Ornamental divider between home-page sections that share the same cream
// background (thin saffron lines fading out, with a small diamond).
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`container-page ${className}`}>
      <div className="mx-auto flex max-w-md items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-saffron-300" />
        <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-saffron-400" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron-300" />
      </div>
    </div>
  );
}
