import { Modal } from "@/components/modal";
import { AdWidget } from "../page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ViewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  ads: AdWidget | null;
};

const View = ({ open, setOpen, ads }: ViewProps) => {
  if (!ads) return null;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="View Advertisement"
      className="w-full sm:w-2xl max-w-2xl rounded-sm"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <Card className="rounded-sm border-0 shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-lg">
                  {ads.name}
                </CardTitle>

                <CardDescription className="mt-1">
                  Advertisement Widget
                </CardDescription>
              </div>

              <Badge
                variant={ads.isActive ? "default" : "secondary"}
              >
                {ads.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium">
                  {ads.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Position
                </p>

                <Badge
                  variant="outline"
                  className="mt-1 capitalize"
                >
                  {ads.position}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Order
                </p>

                <p className="mt-1 text-sm font-medium">
                  {ads.order}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Height
                </p>

                <p className="mt-1 text-sm font-medium">
                  {ads.height}px
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Max Width
                </p>

                <Badge
                  variant="outline"
                  className="mt-1 uppercase"
                >
                  {ads.maxWidth}
                </Badge>
              </div>
            </div>

            {/* Display Options */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Display Options
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {ads.isActive ? "Active" : "Inactive"}
                </Badge>

                <Badge variant="outline">
                  {ads.mobileOnly ? "Mobile Only" : "All Devices"}
                </Badge>

                <Badge variant="outline">
                  {ads.showClose
                    ? "Close Button"
                    : "No Close Button"}
                </Badge>
              </div>
            </div>

            {/* HTML Code */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                HTML Code
              </p>

              <div className="rounded-md border bg-muted/30 p-4 max-h-60 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap break-all font-mono">
                  {ads.htmlCode || "-"}
                </pre>
              </div>
            </div>

            {/* Script Code */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Script Code
              </p>

              <div className="rounded-md border bg-muted/30 p-4 max-h-60 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap break-all font-mono">
                  {ads.scriptCode || "-"}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default View;