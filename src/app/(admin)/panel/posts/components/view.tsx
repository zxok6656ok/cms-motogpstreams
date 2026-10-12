import { Modal } from "@/components/modal";
import { Article } from "./table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ViewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  article: Article | null;
};
const View = ({ open, setOpen, article }: ViewProps) => {
  if (!article) return;
  const url = `${window.location.origin}/${format(
    article.createdAt,
    "yyyy/MM/dd",
  )}/${article.slug}`;
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="View Post"
      className="w-[calc(100vw-1rem)] max-w-2xl rounded-sm sm:w-full"
    >
      <Card className="rounded-sm max-h-[60vh] overflow-y-scroll ">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-lg">{article.title}</CardTitle>

              <div className="my-1">
                <CardDescription className="mt-1">{url}</CardDescription>
                <Button
                  variant={"default"}
                  onClick={async () => {
                    await navigator.clipboard.writeText(url);
                  }}
                >
                  <Copy />
                  Copy Url
                </Button>
              </div>
            </div>

            <Badge variant="secondary">Video</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex w-full gap-3">
            <div className="w-full">
              <div className="relative h-48 w-full overflow-hidden rounded-md sm:h-56 md:h-64 lg:h-72">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <p className="mt-1 text-center text-xs text-muted-foreground">
                Thumbnail
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Meta Description</p>

            <p className="text-sm mt-1">{article.metaDescription || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>

            <p
              className={
                article.status === "publish"
                  ? "inline-flex text-sm mt-1 rounded-full bg-green-100 px-2.5 py-1  font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "inline-flex text-sm mt-1 rounded-full bg-yellow-100 px-2.5 py-1  font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }
            >
              {article.status || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Upload By</p>

            <p className="text-sm mt-1">{article.uploadBy || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Streaming Sources
            </p>

            <div className="space-y-2">
              {article.iframe.map((stream) => (
                <div key={stream.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-sm">{stream.title}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {stream.src}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Download className="size-4 text-primary" />
              Download Links
            </p>

            {article.download.length > 0 && (
              <div className="space-y-4">
                {article.download.map((download, index) => (
                  <div
                    key={`${download.quality}-${index}`}
                    className="space-y-2"
                  >
                    <p className="text-xs font-semibold text-muted-foreground">
                      {download.quality}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {download.links.map((link, linkIndex) => (
                        <Link
                          key={
                            link.id ||
                            `${download.quality}-${link.name}-${linkIndex}`
                          }
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                        inline-flex items-center gap-2 rounded-full
                        border border-border bg-muted/50
                        px-3 py-1.5 text-xs font-medium
                        text-muted-foreground
                        transition-colors
                      hover:border-black/80
                      hover:bg-black/90
                      hover:text-white
                      "
                        >
                          <Download className="size-3.5" />
                          {link.name}
                          <ExternalLink className="size-3 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">
                Genres
              </p>

              {article.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/genres/${genre.slug}`}
                      className="
                      inline-flex items-center rounded-full
                      border border-border bg-muted/50
                      px-3 py-1.5 text-xs font-medium
                      text-muted-foreground
                      transition-colors
                      hover:border-primary/40
                      hover:bg-primary/10
                      hover:text-primary
                    "
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">
                Category
              </p>

              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="
                      inline-flex items-center rounded-full
                      border border-border bg-muted/50
                      px-3 py-1.5 text-xs font-medium
                      text-muted-foreground
                      transition-colors
                      hover:border-primary/40
                      hover:bg-primary/10
                      hover:text-primary
                    "
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Content</p>

            <div className="rounded-md border p-4 max-h-80 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{article.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default View;
