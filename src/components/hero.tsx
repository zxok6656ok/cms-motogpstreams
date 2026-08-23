import { ArrowRight, Radio } from "lucide-react";

import { Site } from "@/app/(public)/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = ({ site }: { site: Site }) => {
  const hero = site.hero;
  if (!hero) return;
  return (
    <section className="border-b-2 border-black bg-[#f4f1e8]">
      <div className="mx-auto min-w-0 max-w-6xl px-4">
        <div className="relative min-w-0 overflow-hidden p-5 py-16 sm:py-20 lg:py-24 border-x-4 border-black">
          <div className="absolute -right-8 -top-8 size-32 rotate-12 border-4 border-black bg-[#dfff00] shadow-[8px_8px_0_#000]" />

          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 border-3 border-black bg-[#dfff00] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider shadow-[5px_5px_0_#000]">
              <Radio className="size-4" strokeWidth={3} />
             { hero.badge }
            </div>

            <h1 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
              <span className="block text-black">{hero.title}</span>

              <span className="relative block text-[#4d7aff]">
                {hero.subtitle}

                <span className="absolute -bottom-3 left-0 h-3 w-36 bg-[#dfff00] shadow-[4px_4px_0_#000] sm:w-52" />
              </span>

              <span
                className="block text-transparent"
                style={{
                  WebkitTextStroke: "3px #111",
                }}
              >
                {hero.year}
              </span>
            </h1>

            <div className="mt-10 max-w-2xl border-l-8 border-black pl-5">
              <p className="text-base font-bold leading-7 text-black/75 sm:text-lg">
                {hero.description}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
              <Link href={hero.primaryButtonUrl ?? "/"} >
              <Button
              
                size="lg"
                className="h-14 rounded-none border-3 border-black bg-[#4d7aff] px-7 font-black uppercase text-black shadow-[7px_7px_0_#000] transition-none hover:translate-x-1 hover:translate-y-1 hover:bg-[#4d7aff] hover:shadow-[3px_3px_0_#000]"
              >
                {  hero.primaryButtonText }
                <ArrowRight className="ml-2 size-5" strokeWidth={3} />
              </Button>
              </Link>

              <Link href={hero.secondaryButtonUrl ?? "/"} >
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-none border-3 border-black bg-white px-7 font-black uppercase text-black shadow-[7px_7px_0_#000] transition-none hover:translate-x-1 hover:translate-y-1 hover:bg-white hover:shadow-[3px_3px_0_#000]"
              >
                { hero.secondaryButtonText}
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
