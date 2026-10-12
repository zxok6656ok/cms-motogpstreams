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
    uploadBy: string;
  };
};

export function ArticleCard({ article }: ArticleCardProps) {
  const createdAt = new Date(article.createdAt);
  const articleUrl = `/${format(createdAt, "yyyy/MM/dd")}/${article.slug}`;

  return (
    <article className="group h-full">
      <Link
        href={articleUrl}
        className="relative block h-full min-h-[220px] overflow-hidden rounded-xl bg-muted sm:min-h-[280px]"
      >
        {article.thumbnail && (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-colors duration-300 group-hover:from-black/90" />

        {/* Play icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black sm:h-16 sm:w-16">
            <PlayIcon className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
          </div>
        </div>

        {/* Title and date */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-md">
            {article.title.length > 40
              ? `${article.title.slice(0, 40)}...`
              : article.title}
          </h2>

          <div className="flex items-center gap-1.5 text-white/75">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <time
              dateTime={createdAt.toISOString()}
              className="text-xs font-medium"
            >
              {format(createdAt, "dd MMM yyyy", { locale: id })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
