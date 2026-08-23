import { PageForm } from "./components/form";
import prisma from "../../../../../lib/prisma";

export default async function Page() {
  const page = await prisma.page.findUnique({
    where: {
      slug: "about",
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">About</h1>

          <p className="text-sm text-muted-foreground">Manage about page.</p>
        </div>
      </div>
      <div className="w-full max-w-md">
        <PageForm page={page} />
      </div>
    </div>
  );
}
