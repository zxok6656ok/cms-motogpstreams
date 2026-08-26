"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Hero } from "../page";
import { toast } from "@/components/ui/toast";
import { heroSave } from "../action";

const heroSchema = z.object({
  badge: z
    .string()
    .min(1, "Badge is required.")
    .max(100, "Badge must be 100 characters or less."),

  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title must be 100 characters or less."),

  subtitle: z
    .string()
    .min(1, "Subtitle is required.")
    .max(100, "Subtitle must be 100 characters or less."),

  year: z
    .string()
    .min(1, "Year is required.")
    .max(20, "Year must be 20 characters or less."),

  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description must be 500 characters or less."),

  primaryButtonText: z
    .string()
    .min(1, "Primary button text is required.")
    .max(50, "Primary button text must be 50 characters or less."),

  primaryButtonUrl: z
    .string()
    .min(1, "Primary button URL is required.")
    .max(500, "Primary button URL must be 500 characters or less."),

  secondaryButtonText: z
    .string()
    .min(1, "Secondary button text is required.")
    .max(50, "Secondary button text must be 50 characters or less."),

  secondaryButtonUrl: z
    .string()
    .min(1, "Secondary button URL is required.")
    .max(500, "Secondary button URL must be 500 characters or less."),
});
type HeroFormValues = z.infer<typeof heroSchema>;

type HeroFormProps = {
  defaultValues?: Partial<HeroFormValues>;
  hero: Hero | null;
};

export default function HeroForm({ defaultValues, hero }: HeroFormProps) {
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      badge: hero?.badge ?? "",
      title: hero?.title ?? "",
      subtitle: hero?.subtitle ?? "",
      year: hero?.year ?? "",
      description: hero?.description ?? "",
      primaryButtonText: hero?.primaryButtonText ?? "",
      primaryButtonUrl: hero?.primaryButtonUrl ?? "",
      secondaryButtonText: hero?.secondaryButtonText ?? "",
      secondaryButtonUrl: hero?.secondaryButtonUrl ?? "",
      ...defaultValues,
    },
  });

  async function onSubmit(values: HeroFormValues) {
    const formData = new FormData();

    formData.append("badge", values.badge || "");
    formData.append("title", values.title || "");
    formData.append("subtitle", values.subtitle || "");
    formData.append("year", values.year || "");
    formData.append("description", values.description || "");

    formData.append("primaryButtonText", values.primaryButtonText || "");
    formData.append("primaryButtonUrl", values.primaryButtonUrl || "");

    formData.append("secondaryButtonText", values.secondaryButtonText || "");

    formData.append("secondaryButtonUrl", values.secondaryButtonUrl || "");

    try {
      const { message, success } = await heroSave(formData);
      if (success) {
        toast.add({
          type: "success",
          description: message,
        });
      }
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Hero Content</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure the main content displayed in the home page hero.
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="badge">Badge</FieldLabel>

              <Input
                id="badge"
                placeholder="LIVE STREAMING"
                {...form.register("badge")}
                className="rounded-sm"
              />

              <FieldDescription>
                Small text displayed above the hero title.
              </FieldDescription>

              <FieldError>{form.formState.errors.badge?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>

              <Input
                id="title"
                placeholder="LIVE"
                {...form.register("title")}
                className="rounded-sm"
              />

              <FieldDescription>
                The first line of the hero title.
              </FieldDescription>

              <FieldError>{form.formState.errors.title?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="subtitle">Subtitle</FieldLabel>

              <Input
                id="subtitle"
                placeholder="MOTOGP"
                {...form.register("subtitle")}
                className="rounded-sm"
              />

              <FieldDescription>
                The second line of the hero title.
              </FieldDescription>

              <FieldError>{form.formState.errors.subtitle?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="year">Year</FieldLabel>

              <Input
                id="year"
                placeholder="2026"
                {...form.register("year")}
                className="rounded-sm"
              />

              <FieldDescription>
                The year displayed in the hero.
              </FieldDescription>

              <FieldError>{form.formState.errors.year?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>

              <Textarea
                id="description"
                placeholder="LIVEMOTOGP is a website for watching MotoGP live streams in 2026..."
                rows={5}
                {...form.register("description")}
                className="rounded-sm"
              />

              <FieldDescription>
                Description displayed below the hero title.
              </FieldDescription>

              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>
          </FieldGroup>
        </div>

        <div className="space-y-6">
          <div className="p-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Primary Button</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Configure the primary button displayed in the hero.
              </p>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="primaryButtonText">Button Text</FieldLabel>

                <Input
                  id="primaryButtonText"
                  placeholder="WATCH NOW"
                  {...form.register("primaryButtonText")}
                  className="rounded-sm"
                />

                <FieldError>
                  {form.formState.errors.primaryButtonText?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="primaryButtonUrl">Button URL</FieldLabel>

                <Input
                  id="primaryButtonUrl"
                  placeholder="/live"
                  {...form.register("primaryButtonUrl")}
                  className="rounded-sm"
                />

                <FieldDescription>
                  Example: /live or https://example.com
                </FieldDescription>

                <FieldError>
                  {form.formState.errors.primaryButtonUrl?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </div>

          <div className="p-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Secondary Button</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Configure the secondary button displayed in the hero.
              </p>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="secondaryButtonText">
                  Button Text
                </FieldLabel>

                <Input
                  id="secondaryButtonText"
                  placeholder="MOTOGP SCHEDULE"
                  {...form.register("secondaryButtonText")}
                  className="rounded-sm"
                />

                <FieldError>
                  {form.formState.errors.secondaryButtonText?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="secondaryButtonUrl">Button URL</FieldLabel>

                <Input
                  id="secondaryButtonUrl"
                  placeholder="/schedule"
                  {...form.register("secondaryButtonUrl")}
                  className="rounded-sm"
                />

                <FieldDescription>
                  Example: /schedule or an external URL.
                </FieldDescription>

                <FieldError>
                  {form.formState.errors.secondaryButtonUrl?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Hero"}
        </Button>
      </div>
    </form>
  );
}
