import { notFound } from "next/navigation";
import { getPage } from "../../../../lib/page";

export default async function PrivacyPage() {
  const page = await getPage("privacy");

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="border-4 border-black bg-[#f5f0e6] p-6 shadow-[8px_8px_0_0_#000] sm:p-10">
        <div className="mb-8 border-b-4 border-black pb-6">
          <span className="mb-3 inline-block border-2 border-black bg-[#ffde59] px-3 py-1 font-black uppercase shadow-[3px_3px_0_0_#000]">
           Privacy Policy
          </span>

          <h1 className="text-4xl font-black uppercase sm:text-5xl">
            {page.title}
          </h1>
        </div>

        <article
          className="
            prose prose-lg max-w-none
            prose-headings:font-black
            prose-headings:uppercase
            prose-p:font-medium
            prose-a:font-bold
            prose-a:text-black
            prose-a:underline
            prose-strong:font-black
            prose-ul:font-medium
            prose-ol:font-medium
          "
          dangerouslySetInnerHTML={{
            __html: page.content,
          }}
        />
      </div>
    </main>
  );
}