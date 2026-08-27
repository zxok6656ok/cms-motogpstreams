import { ArrowRight, Radio } from "lucide-react";

import { Site } from "@/app/(public)/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiTelegram } from "react-icons/si";

const Hero = ({ site }: { site: Site }) => {
  const hero = site.hero;
  if (!hero) return;

  return (
    <section className="border-b-2 border-black bg-[#f4f1e8]">
      <div className="mx-auto min-w-0 max-w-6xl px-4">
        <div className="relative min-w-0 overflow-hidden border-x-4 border-black p-5 py-12 sm:py-20 lg:py-24">
          <div className="absolute -right-8 -top-8 size-24 rotate-12 border-4 border-black bg-[#dfff00] shadow-[6px_6px_0_#000] sm:size-32 sm:shadow-[8px_8px_0_#000]" />

          <div className="relative">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 border-3 border-black bg-[#dfff00] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-wider shadow-[4px_4px_0_#000] sm:mb-8 sm:px-4 sm:text-xs sm:shadow-[5px_5px_0_#000]">
              <Radio className="size-3.5 sm:size-4" strokeWidth={3} />
              {hero.badge}
            </div>

            {/* Heading */}
            <h1
              className="
                text-5xl
                font-black
                uppercase
                leading-[0.82]
                tracking-[-0.06em]
                sm:text-6xl
                md:text-7xl
                lg:text-[clamp(4rem,10vw,8rem)]
                lg:leading-[0.78]
                lg:tracking-[-0.075em]
              "
            >
              <span className="block text-black">{hero.title}</span>

              <span className="relative block text-[#4d7aff]">
                {hero.subtitle}

                <span className="absolute -bottom-2 left-0 h-2 w-24 bg-[#dfff00] shadow-[3px_3px_0_#000] sm:-bottom-3 sm:h-3 sm:w-52 sm:shadow-[4px_4px_0_#000]" />
              </span>

              <span
                className="block text-transparent"
                style={{
                  WebkitTextStroke: "2px #111",
                }}
              >
                {hero.year}
              </span>
            </h1>

            {/* Description */}
            <div className="mt-8 max-w-2xl border-l-4 border-black pl-4 sm:mt-10 sm:border-l-8 sm:pl-5">
              <p className="text-sm font-bold leading-6 text-black/75 sm:text-lg sm:leading-7">
                {hero.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-5">
              <Link href={hero.primaryButtonUrl ?? "/"}>
                <Button
                  size="lg"
                  className="
                    h-12
                    rounded-none
                    border-3
                    border-black
                    bg-[#4d7aff]
                    px-5
                    text-sm
                    font-black
                    uppercase
                    text-black
                    shadow-[5px_5px_0_#000]
                    transition-none
                    hover:translate-x-1
                    hover:translate-y-1
                    hover:bg-[#4d7aff]
                    hover:shadow-[3px_3px_0_#000]
                    sm:h-14
                    sm:px-7
                    sm:text-base
                    sm:shadow-[7px_7px_0_#000]
                  "
                >
                  {hero.primaryButtonText}
                  <ArrowRight
                    className="ml-2 size-4 sm:size-5"
                    strokeWidth={3}
                  />
                </Button>
              </Link>

              <Link href={hero.secondaryButtonUrl ?? "/"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="
                    h-12
                    rounded-none
                    border-3
                    border-black
                    bg-white
                    px-5
                    text-sm
                    font-black
                    uppercase
                    text-black
                    shadow-[5px_5px_0_#000]
                    transition-none
                    hover:translate-x-1
                    hover:translate-y-1
                    hover:bg-white
                    hover:shadow-[3px_3px_0_#000]
                    sm:h-14
                    sm:px-7
                    sm:text-base
                    sm:shadow-[7px_7px_0_#000]
                  "
                >
                  {hero.secondaryButtonText}
                  <SiTelegram className="size-4 sm:size-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
