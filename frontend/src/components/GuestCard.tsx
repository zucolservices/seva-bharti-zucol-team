import Image from "next/image";
import { GUEST_PLACEHOLDER, langOf, type GuestView } from "@/lib/view-types";

// Guest card — big photo on the left; name, designation and testimonial
// on the right (horizontal layout).
export default function GuestCard({ guest }: { guest: GuestView }) {
  return (
    <figure className="flex overflow-hidden rounded-2xl border border-saffron-100 bg-white shadow-sm">
      <div className="relative w-28 shrink-0 self-stretch bg-saffron-100 sm:w-40">
        <Image
          src={guest.photo ?? GUEST_PLACEHOLDER}
          alt={`${guest.name} — ${guest.designation}`}
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5">
        <figcaption>
          <span lang={langOf(guest.name)} className="block font-semibold text-ink">
            {guest.name}
          </span>
          <span lang={langOf(guest.designation)} className="block text-xs font-medium text-sewablue-600">
            {guest.designation}
          </span>
        </figcaption>
        <blockquote lang={langOf(guest.testimonial)} className="mt-3 border-t border-saffron-100 pt-3 text-sm leading-relaxed text-ink-soft">
          “{guest.testimonial}”
        </blockquote>
      </div>
    </figure>
  );
}
