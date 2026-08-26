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
import { Copy } from "lucide-react";
import Image from "next/image";

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

            <Badge variant="secondary">Article</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex gap-3">
            <div>
              <div className="relative h-14 w-20 overflow-hidden rounded-md md:h-20 md:w-28 lg:h-24 lg:w-36 xl:h-28 xl:w-44">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 80px, (max-width: 1023px) 112px, (max-width: 1279px) 144px, 176px"
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

            <div>
              <div className="relative h-14 w-20 overflow-hidden rounded-md md:h-20 md:w-28 lg:h-24 lg:w-36 xl:h-28 xl:w-44">
                {article.poster ? (
                  <Image
                    src={article.poster}
                    alt="Poster"
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 80px, (max-width: 1023px) 112px, (max-width: 1279px) 144px, 176px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <p className="mt-1 text-center text-xs text-muted-foreground">
                Poster
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {article.categories.map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created</p>

              <p className="text-sm font-medium mt-1">
                {format(article.createdAt, "dd MMMM yyyy, HH:mm")}
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
              {article.streams.map((stream) => (
                <div key={stream.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-sm">{stream.name}</span>

                    <Badge variant="outline">{stream.type.toUpperCase()}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {stream.url}
                  </p>
                </div>
              ))}
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
