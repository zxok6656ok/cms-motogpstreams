"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Site } from "@/app/(public)/layout";

export function Navbar({ site }: { site: Site }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!site) return;

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-2 border-black
        bg-white
        shadow-[5px_5px_0px_0px_#000]
      "
    >
      <nav
        className="
          mx-auto flex w-full max-w-6xl
          items-center justify-between
          px-4 py-3
        "
      >
        <Link
          href="/"
          className="
            inline-block
            border-2 border-black
            bg-[#4d7aff]
            px-4 py-2
            text-2xl font-black
            text-black
            shadow-[4px_4px_0px_0px_#000]
          "
        >
          {site.title}
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            {site.navbarItems.map((item) => {
              const active = isActive(item.url);

              return (
                <Link key={item.name} href={item.url}>
                  <Button
                    variant="ghost"
                    className={`
                      rounded-none
                      border-2
                      font-bold
                      ${
                        active
                          ? "border-black bg-[#4d7aff] text-black shadow-[3px_3px_0px_0px_#000]"
                          : "border-transparent bg-transparent hover:border-black hover:bg-[#4d7aff] hover:text-black hover:shadow-[3px_3px_0px_0px_#000]"
                      }
                    `}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button
            onClick={() => setOpen(true)}
            size="icon"
            className="
              rounded-none
              border-2 border-black
              bg-[#4d7aff]
              text-black
              shadow-[3px_3px_0px_0px_#000]
              transition-all
              hover:translate-x-0.5
              hover:translate-y-0.5
              hover:bg-[#4d7aff]
              hover:shadow-none
            "
          >
            <Search className="size-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet>
            <SheetTrigger
              className="
                inline-flex size-10
                items-center justify-center
                rounded-md
                border-2 border-black
                bg-white
                text-black
                shadow-[3px_3px_0px_0px_#000]
                transition-all
                hover:bg-[#4d7aff]
                hover:translate-x-0.5
                hover:translate-y-0.5
                hover:shadow-none
                md:hidden
              "
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                w-70
                border-l-2 border-black
                bg-[#FFFDF5]
                p-4
              "
            >
              <SheetHeader className="border-b-2 border-black pb-4">
                <SheetTitle className="text-left text-2xl font-black">
                  {site.title}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-3">
                {site.navbarItems.map((item) => {
                  const active = isActive(item.url);

                  return (
                    <Link key={item.name} href={item.url}>
                      <Button
                        variant="outline"
                        className={`
                          w-full
                          justify-start
                          border-2
                          font-black
                          transition-all
                          ${
                            active
                              ? "border-black bg-[#4d7aff] text-black shadow-none translate-x-1 translate-y-1"
                              : "border-black bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#4d7aff] hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                          }
                        `}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            mx-1
            max-w-xl
            rounded-none
            border-2 border-black
            bg-[#FFFDF5]
            shadow-[6px_6px_0px_0px_#000]
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Search</DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const query = search.trim();

                if (!query) {
                  router.push("/");
                  setOpen(false);
                  return;
                }

                router.push(`/?q=${encodeURIComponent(query)}`);
                setOpen(false);
              }}
              className="flex gap-2"
            >
              <input
                autoFocus
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari live streaming motogp..."
                className="
      h-12 flex-1
      border-2 border-black
      bg-white
      px-4
      font-bold
      outline-none
      placeholder:text-slate-700
      focus:bg-[#4d7aff]
    "
              />

              <Button
                type="submit"
                className="
      h-12
      rounded-none
      border-2 border-black
      bg-[#4d7aff]
      px-5
      font-black
      text-black
      shadow-[3px_3px_0px_0px_#000]
      transition-all
      hover:translate-x-0.5
      hover:translate-y-0.5
      hover:bg-[#4d7aff]
      hover:shadow-none
    "
              >
                Search
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
