import { Calendar, PlayIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    thumbnail: string | null;
    slug: string;
    metaDescription: string | null;
    createdAt: Date;
    categories: {
      name: string;
      slug: string;
    }[];
  };
};

export function ArticleCard({ article }: ArticleCardProps) {
  const createdAt = new Date(article.createdAt);
  const articleUrl = `/${format(article.createdAt, "yyyy/MM/dd")}/${article.slug}`;

  return (
    <article className="group h-full">
      <div className="block h-full">
        <div
          className="
          flex h-full flex-col
          border-4 border-black
          bg-white
          shadow-[7px_7px_0_#000]
          transition-all duration-150
          hover:translate-x-0.75
          hover:translate-y-0.75
          hover:shadow-[4px_4px_0_#000]
        "
        >
          {article.thumbnail && (
            <div className="border-b-4 border-black">
              <Image
                src={article.thumbnail}
                alt={article.title}
                width={640}
                height={360}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col p-5">
            <h2
              className="
              mb-2
              min-h-14
              line-clamp-2
              text-xl
              font-black
              leading-tight
              tracking-tight
              sm:text-2xl
            "
            >
              {article.title.length > 40
                ? `${article.title.slice(0, 40)}...`
                : article.title}
            </h2>
            {article.categories.length > 0 && (
              <div className="mb-4 flex min-h-8 flex-wrap gap-2">
                {article.categories.slice(0, 2).map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    <span
                      key={category.slug}
                      className="
                    border-2 border-black
                    bg-[#ff90e8]
                    px-2 py-1
                    text-xs
                    font-black
                    uppercase
                  "
                    >
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {article.metaDescription && (
              <p className="line-clamp-3 text-sm font-medium leading-relaxed text-neutral-700">
                {article.metaDescription}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between gap-3 pt-6">
              <div className="flex gap-1 items-center">
                <Calendar />
                <time
                  dateTime={createdAt.toISOString()}
                  className="text-xs font-black uppercase"
                >
                  {format(createdAt, "dd MMM yyyy", {
                    locale: id,
                  })}
                </time>
              </div>
              <Link href={articleUrl}>
                <span
                  className="
                flex items-center gap-2
                border-2 border-black
                bg-black
                px-3 py-2
                text-xs
                font-black
                uppercase
                text-white
                group-hover:bg-[#dfff00]
                group-hover:text-black
              "
                >
                  Tonton
                  <PlayIcon className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
