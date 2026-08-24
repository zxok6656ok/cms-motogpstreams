import { Modal } from "@/components/modal";
import { Article } from "./table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


type ViewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  article: Article | null
};
const View = ({ open, setOpen, article }: ViewProps) => {
  if(!article) return 
  return (
    <Modal open={open} onOpenChange={setOpen} title="View Post" className="rounded-sm w-2xl">
      <Card className="rounded-sm">
  <CardHeader>
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <CardTitle className="text-lg">
          {article.title}
        </CardTitle>

        <CardDescription className="mt-1">
          /{article.slug}
        </CardDescription>
      </div>

      <Badge variant="secondary">
        Article
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="space-y-5">

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Categories
        </p>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {article.categories.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Created
        </p>

        <p className="text-sm font-medium mt-1">
          {new Date(article.createdAt).toLocaleString()}
        </p>
      </div>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">
        Meta Description
      </p>

      <p className="text-sm mt-1">
        {article.metaDescription || "-"}
      </p>
    </div>


    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Streaming Sources
      </p>

      <div className="space-y-2">
        {article.streams.map((stream) => (
          <div
            key={stream.id}
            className="rounded-md border p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-sm">
                {stream.name}
              </span>

              <Badge variant="outline">
                {stream.type.toUpperCase()}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mt-1 break-all">
              {stream.url}
            </p>
          </div>
        ))}
      </div>
    </div>


    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Content
      </p>

      <div className="rounded-md border p-4 max-h-80 overflow-y-auto">
        <p className="text-sm whitespace-pre-wrap">
          {article.content}
        </p>
      </div>
    </div>
  </CardContent>
</Card>
    </Modal>
  );
};

export default View;
