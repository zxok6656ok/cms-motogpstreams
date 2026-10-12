
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { format, isValid, parse } from "date-fns";
import { id } from "date-fns/locale";

const Breadcrumbnav = () => {
  const pathname = usePathname();
  const isAdmin = pathname === "/panel" || pathname.startsWith("/panel/");

  const rawSegments = pathname.split("/").filter(Boolean);
  const segments = rawSegments.slice(isAdmin ? 1 : 0);

  const homeHref = isAdmin ? "/panel" : "/";
  const homeLabel = isAdmin ? "Dashboard" : "Home";

  const isDateArticle =
    !isAdmin &&
    /^\d{4}$/.test(segments[0] ?? "") &&
    /^\d{1,2}$/.test(segments[1] ?? "") &&
    /^\d{1,2}$/.test(segments[2] ?? "") &&
    !!segments[3];

  const displaySegments = isDateArticle
    ? [
        {
          label: (() => {
            const date = parse(
              `${segments[0]}-${segments[1].padStart(2, "0")}-${segments[2].padStart(2, "0")}`,
              "yyyy-MM-dd",
              new Date(),
            );

            return isValid(date)
              ? format(date, "dd MMM yyyy", { locale: id })
              : segments.slice(0, 3).join("/");
          })(),
          href: null,
        },
        ...segments.slice(3).map((segment, index) => ({
          label: segment,
          href: null as string | null,
        })),
      ]
    : segments.map((segment, index) => ({
        label: segment,
        href:
          index < segments.length - 1
            ? `${homeHref === "/" ? "" : homeHref}/${segments
                .slice(0, index + 1)
                .join("/")}`
            : null,
      }));

  return (
    <Breadcrumb className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap overflow-hidden whitespace-nowrap">
        <BreadcrumbItem className="shrink-0">
          {displaySegments.length === 0 ? (
            <BreadcrumbPage>{homeLabel}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={homeHref}>
              {homeLabel}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {displaySegments.map((segment, index) => {
          const isLast = index === displaySegments.length - 1;
          const label =
            segment.label.charAt(0).toUpperCase() +
            segment.label.slice(1);

          return (
            <Fragment key={`${segment.label}-${index}`}>
              <BreadcrumbSeparator className="shrink-0" />

              <BreadcrumbItem className="min-w-0 overflow-hidden">
                {isLast ? (
                  <BreadcrumbPage className="truncate">
                    {label}
                  </BreadcrumbPage>
                ) : segment.href ? (
                  <BreadcrumbLink
                    className="truncate"
                    href={segment.href}
                  >
                    {label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate">
                    {label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbnav;
