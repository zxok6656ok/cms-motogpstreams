"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createSlug from "../../../../../../lib/create-slug";
import { useEffect, useRef } from "react";
import { Article } from "./columns";
import { saveArticle } from "../action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must be at most 150 characters."),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  poster: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),

  metaDescription: z
    .string()
    .max(160, "Meta description must be at most 160 characters.")
    .optional(),

  categories: z.string(),

  streams: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["hls", "dash"]),
      url: z.string(),
      drmId: z.string().optional(),
      drmKey: z.string().optional(),
    }),
  ),

  content: z.string().optional(),
});
type FormPostsProps = {
  setOpen: (open: boolean) => void;
  type: "edit" | "add";
  open: boolean;
  article: Article | null;
};
const FormPosts = ({ open, setOpen, article, type }: FormPostsProps) => {
  const slugTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      poster: "",
      slug: "",
      metaDescription: "",
      categories: "",
      streams: [
        {
          name: "",
          type: "hls",
          url: "",
          drmId: "",
          drmKey: "",
        },
      ],
      content: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "streams",
  });

  const { setValue } = form;

  const setSlug = async (val: string) => {
    const slug = await createSlug("article", val, 50);
    setValue("slug", slug, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("thumbnail", data.thumbnail);
      formData.append("poster", data.poster ?? "");
      formData.append("slug", data.slug);
      formData.append("metaDescription", data.metaDescription ?? "");
      formData.append("categories", data.categories);
      formData.append("content", data.content ?? "");
      formData.append("streams", JSON.stringify(data.streams));
      const { message } = await saveArticle(
        formData,
        type == "add" ? null : article?.id,
      );
      setOpen(false);
      router.refresh();
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
  };

  useEffect(() => {
    return () => {
      if (slugTimeout.current) {
        clearTimeout(slugTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (type == "add") {
      form.reset({
        title: "",
        slug: "",
        thumbnail: "",
        poster: "",
        metaDescription: "",
        categories: "",
        streams: [
          {
            name: "",
            type: "hls",
            url: "",
            drmId: "",
            drmKey: "",
          },
        ],
        content: "",
      });
    } else {
      form.reset({
        title: article?.title ?? "",
        slug: article?.slug ?? "",
        thumbnail: article?.thumbnail ?? "",
        poster: article?.poster ?? "",
        metaDescription: article?.metaDescription ?? "",
        categories:
          article?.categories?.map((category) => category.name).join(", ") ??
          "",
        streams: article?.streams?.map((stream) => ({
          name: stream.name,
          type: stream.type,
          url: stream.url,
          drmId: stream.drmId ?? "",
          drmKey: stream.drmKey ?? "",
        })) ?? [
          {
            name: "",
            type: "hls",
            url: "",
            drmId: "",
            drmKey: "",
          },
        ],
        content: article?.content ?? "",
      });
    }
  }, [type, article]);

  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        className="rounded-sm w-full sm:w-2xl max-w-2xl"
        title="Add Post"
        description=""
        footer={
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              type="submit"
              form="article-form"
              className="order-1 sm:order-3"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Post"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="order-3 sm:order-1"
            >
              Close
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => form.reset()}
              className="order-2 sm:order-2"
            >
              Reset
            </Button>
          </div>
        }
      >
        <form
          id="article-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[60vh] overflow-y-scroll "
        >
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="article-form-title">Title</FieldLabel>

                    <Input
                      {...field}
                      id="article-form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Title posts"
                      className="rounded-sm"
                      autoComplete="off"
                      onChange={(event) => {
                        field.onChange(event);

                        if (slugTimeout.current) {
                          clearTimeout(slugTimeout.current);
                        }

                        slugTimeout.current = setTimeout(() => {
                          setSlug(event.target.value);
                        }, 500);
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="article-form-slug">Slug</FieldLabel>

                    <Input
                      {...field}
                      id="article-form-slug"
                      readOnly
                      aria-invalid={fieldState.invalid}
                      className="rounded-sm"
                      placeholder="slug-posts"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name={"thumbnail"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>URL Thumbnail</FieldLabel>

                  <Input
                    {...field}
                    type="url"
                    placeholder="https://example.com/"
                    className="rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
             <Controller
              name={"poster"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>URL Poster</FieldLabel>

                  <Input
                    {...field}
                    type="url"
                    placeholder="https://example.com/"
                    className="rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            </div>
            <Controller
              name="metaDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="article-form-description">
                    Meta Description
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="article-form-description"
                    placeholder="Description posts"
                    rows={5}
                    className="resize-y rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    A short description for search engines.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <FieldLabel>Streaming URLs</FieldLabel>
                  <FieldDescription>
                    Add one or more streaming sources.
                  </FieldDescription>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      type: "hls",
                      url: "",
                      drmId: "",
                      drmKey: "",
                    })
                  }
                >
                  <PlusIcon />
                  Add URL
                </Button>
              </div>

              <div className="space-y-3 mt-3">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Stream {index + 1}
                      </span>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon />
                          <span className="sr-only">Remove stream</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Controller
                        name={`streams.${index}.name`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Name</FieldLabel>

                            <Input
                              {...field}
                              placeholder="Main Stream"
                              className="rounded-sm"
                              aria-invalid={fieldState.invalid}
                            />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`streams.${index}.type`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Type</FieldLabel>

                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={"rounded-sm"}
                                aria-invalid={fieldState.invalid}
                              >
                                <SelectValue placeholder="Pilih type" />
                              </SelectTrigger>

                              <SelectContent className={"rounded-sm"}>
                                <SelectItem
                                  value="hls"
                                  className={"rounded-sm"}
                                >
                                  HLS
                                </SelectItem>
                                <SelectItem
                                  value="dash"
                                  className={"rounded-sm"}
                                >
                                  DASH
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name={`streams.${index}.url`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>URL</FieldLabel>

                          <Input
                            {...field}
                            type="url"
                            placeholder="https://example.com/stream.m3u8"
                            className="rounded-sm"
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`streams.${index}.drmId`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>DRM ID</FieldLabel>

                          <Input
                            {...field}
                            type="text"
                            placeholder="..........."
                            className="rounded-sm"
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`streams.${index}.drmKey`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>DRM KEY</FieldLabel>

                          <Input
                            {...field}
                            type="text"
                            placeholder="..........."
                            className="rounded-sm"
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                ))}
              </div>
            </Field>
            <Controller
              name="categories"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Categories</FieldLabel>

                  <Input
                    {...field}
                    placeholder="MotoGP, Live Streaming, Catalunya"
                    className="rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    Separate categories with commas.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="article-form-content">
                    Content
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="article-form-content"
                    placeholder="Article content..."
                    rows={15}
                    className="resize-y rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </Modal>
    </div>
  );
};

export default FormPosts;
