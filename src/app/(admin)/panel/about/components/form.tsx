"use client";

import type { Prisma } from "@/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { updatePage } from "../action";

type Page = Prisma.PageGetPayload<{}>;

interface PageFormProps {
  page: Page | null;
}

export function PageForm({ page }: PageFormProps) {
  return (
    <form action={updatePage}>
      <input
        type="hidden"
        name="id"
        value={page?.id}
      />

      <input
        type="hidden"
        name="slug"
        value={page?.slug}
      />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            Title
          </FieldLabel>

          <Input
            id="title"
            name="title"
            defaultValue={page?.title}
            className="rounded-sm"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="content">
            Content
          </FieldLabel>

          <FieldDescription>
            Content halaman.
          </FieldDescription>

          <Textarea
            id="content"
            name="content"
            defaultValue={page?.content}
            className="min-h-125 rounded-sm"
            
            required
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}