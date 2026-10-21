// "Our Objective" (with the Sewa Geet image) and "Vision" sections, copied
// from the live site (sewabhartirajasthan.org). Copy: src/content/pages/home.ts;
// assets live in public/home/.
import Image from "next/image";
import { HOME_OBJECTIVE as DEFAULT_OBJECTIVE, HOME_VISION as DEFAULT_VISION, type Segment } from "@/content/pages/home";

const hl = "text-saffron-700";

function Segments({ parts }: { parts: Segment[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={i} className={hl}>
            {part.hl}
          </span>
        ),
      )}
    </>
  );
}

export default function MissionVision({
  objective: HOME_OBJECTIVE = DEFAULT_OBJECTIVE,
  vision: HOME_VISION = DEFAULT_VISION,
}: {
  objective?: typeof DEFAULT_OBJECTIVE;
  vision?: typeof DEFAULT_VISION;
}) {
  return (
    <>
      {/* Our Objective: the Sewa Geet image floats right and the text wraps
          around it, then runs full width below — no empty column under the image. */}
      <section className="bg-[url('/home/bg-vission.webp')] bg-cover bg-center bg-no-repeat">
        <div className="container-page py-12 md:py-16">
          <div className="text-base leading-[1.75] text-ink-soft md:text-[17px] [&>p+p]:mt-4">
            <figure className="mx-auto mb-8 w-full max-w-xs md:float-right md:mb-6 md:ml-10 md:w-[38%] md:max-w-none">
              <Image
                src={HOME_OBJECTIVE.image}
                alt={HOME_OBJECTIVE.imageAlt}
                width={1084}
                height={1109}
                sizes="(max-width: 768px) 320px, 440px"
                className="h-auto w-full rounded-[10px]"
              />
            </figure>
            <h2 className="mb-5 text-3xl font-bold leading-tight text-ink md:text-[2rem]">{HOME_OBJECTIVE.heading}</h2>
            {HOME_OBJECTIVE.paragraphs.map((p, i) => (
              <p key={i}>
                <Segments parts={p} />
              </p>
            ))}
            <h3 className="mb-3 mt-8 text-xl font-bold leading-snug text-ink">{HOME_OBJECTIVE.structureHeading}</h3>
            {HOME_OBJECTIVE.structureParagraphs.map((p, i) => (
              <p key={i}>
                <Segments parts={p} />
              </p>
            ))}
            {/* Clear the float so the section grows around the image. */}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Vision: same wrap — the photo floats left, text flows beside and below it. */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="text-base leading-[1.75] text-ink-soft md:text-[17px]">
            <Image
              src="/home/child-vision-2.jpg"
              alt={HOME_VISION.imageAlt}
              width={330}
              height={295}
              className="mx-auto mb-6 h-auto w-4/5 max-w-xs rounded-[10px] md:float-left md:mb-4 md:mr-10 md:w-[30%]"
            />
            <h2 className="mb-4 text-3xl font-bold leading-tight text-ink md:text-[2rem]">{HOME_VISION.heading}</h2>
            <p>
              <Segments parts={HOME_VISION.paragraph} />
            </p>
            <p className="mt-5 text-lg font-bold leading-snug text-saffron-700 md:text-xl">{HOME_VISION.appeal}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>
    </>
  );
}
