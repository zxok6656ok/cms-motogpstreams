import { Prisma } from "@/generated/prisma/client";
import prisma from "../../../../../lib/prisma";
import HeroForm from "./components/form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hero",
};

export type Hero = Prisma.HeroSettingGetPayload<{
  select: {
    badge: true;
    title: true;
    subtitle: true;
    year: true;
    description: true;
    primaryButtonText: true;
    primaryButtonUrl: true;
    secondaryButtonText: true;
    secondaryButtonUrl: true;
  };
}>;
export default async function Page() {
  const hero = await prisma.heroSetting.findFirst({
    select: {
      badge: true,
      title: true,
      subtitle: true,
      year: true,
      description: true,
      primaryButtonText: true,
      primaryButtonUrl: true,
      secondaryButtonText: true,
      secondaryButtonUrl: true,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hero</h1>
          <p className="text-sm text-muted-foreground">Manage hero page.</p>
        </div>
      </div>
      <HeroForm hero={hero} />
    </div>
  );
}
