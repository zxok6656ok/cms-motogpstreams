"use client";

import type { Prisma } from "@/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePage } from "../../disclaimer/actions";


type Page = Prisma.PageGetPayload<{
  select: {
    title: true;
    id: true;
    createdAt: true;
    updatedAt: true;
    content: true;
    slug: true;
  };
}>;

interface PageFormProps {
  page: Page | null;
}

const updatePageSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi"),
  content: z.string().trim().min(1, "Content wajib diisi"),
});

type UpdatePageSchema = z.infer<typeof updatePageSchema>;

export function PageForm({ page }: PageFormProps) {
  const form = useForm<UpdatePageSchema>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      title: page?.title ?? "",
      content: page?.content ?? "",
    },
  });

  async function onSubmit(values: UpdatePageSchema) {
    try {
      const formData = new FormData();

      formData.append("id", page?.id ?? "");
      formData.append("slug", page?.slug ?? "");
      formData.append("title", values.title);
      formData.append("content", values.content);

      const { message } = await updatePage(formData, "Privacy", page?.id ?? "");

      toast.add({
        type: "success",
        description: message,
      });
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>

              <Input
                {...field}
                id="title"
                className="rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="content">Content</FieldLabel>

              <FieldDescription>Content halaman.</FieldDescription>

              <Textarea
                {...field}
                id="content"
                className="min-h-125 rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save Privacy"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
