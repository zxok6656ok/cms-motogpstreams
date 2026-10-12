"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const searchSchema = z
  .string()
  .trim()
  .min(1, "Masukkan kata kunci pencarian.")
  .max(100, "Pencarian maksimal 100 karakter.")
  .refine((value) => !/[\u0000-\u001F\u007F]/.test(value), {
    message: "Kata kunci mengandung karakter yang tidak valid.",
  });

const SearchField = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();

    const result = searchSchema.safeParse(search);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Pencarian tidak valid.");
      return;
    }

    setError("");

    router.push(`/?q=${encodeURIComponent(result.data)}`);
  };


return (
  <Field
    orientation="horizontal"
    className="ml-auto w-[150px] shrink-0 sm:w-auto sm:max-w-sm"
  >
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 items-center gap-1.5"
    >
      <div className="min-w-0 flex-1">
        <Input
          type="search"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (error) setError("");
          }}
          placeholder="Cari video..."
          maxLength={100}
          aria-invalid={!!error}
          aria-describedby={error ? "search-error" : undefined}
          className="h-8 w-full min-w-0 rounded-lg  px-2 text-sm  sm:w-48 sm:px-3"
        />
      </div>

      <Button
        type="submit"
        aria-label="Cari video"
        className="h-8 w-8 shrink-0 rounded-lg p-0"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  </Field>
);
};

export default SearchField;
