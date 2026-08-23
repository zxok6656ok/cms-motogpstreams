import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FileText,
  Folder,
  Radio,
  Settings,
} from "lucide-react";

type DashboardCardsProps = {
  articles: number;
  categories: number;
  streams: number;
  siteConfigured: boolean;
};

export function DashboardCards({
  articles,
  categories,
  streams,
  siteConfigured,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "Articles",
      value: articles,
      description: "Total articles",
      icon: FileText,
    },
    {
      title: "Categories",
      value: categories,
      description: "Total categories",
      icon: Folder,
    },
    {
      title: "Streams",
      value: streams,
      description: "Total streams",
      icon: Radio,
    },
    {
      title: "Site Settings",
      value: siteConfigured ? "Configured" : "Not configured",
      description: "Website configuration",
      icon: Settings,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>

              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}