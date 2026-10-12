"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
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
import { useEffect, useRef, useState } from "react";
import { Article } from "./columns";
import { saveArticle } from "../action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { ExistingStream } from "./table";
import { Switch } from "@/components/ui/switch";
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must be at most 150 characters."),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  status: z.enum(["publish", "draft"]),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
  uploadBy: z
    .string()
    .min(1, "Upload By must be at least 1 characters.")
    .max(10, "Upload By must be at most 10 characters."),
  metaDescription: z
    .string()
    .max(160, "Meta description must be at most 160 characters.")
    .optional(),
  categories: z.string(),
  genres: z.string(),
  iframe: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      src: z.string(),
      isActive: z.boolean(),
    }),
  ),
  download: z.array(
    z.object({
      id: z.string().optional(),
      quality: z.string(),
      links: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          url: z.string(),
          isActive: z.boolean(),
        }),
      ),
      isActive: z.boolean(),
    }),
  ),
  content: z
    .string()
    .max(50000, "Article is too long, maximum 50,000 characters")
    .optional(),
});
type FormPostsProps = {
  setOpen: (open: boolean) => void;
  type: "edit" | "add";
  open: boolean;
  article: Article | null;
  iframe: ExistingStream[];
  downloads?: {
    id: string;
    quality: string;
    isActive?: boolean;
    links: { id: string; name: string; url: string; isActive?: boolean }[];
  }[];
};
const FormPosts = ({
  open,
  setOpen,
  article,
  type,
  iframe,
  downloads,
}: FormPostsProps) => {
  const [selectedStreamId, setSelectedStreamId] = useState("");
  const [selectedDownloadId, setSelectedDownloadId] = useState("");
  const slugTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const [uploadBy, setUploadBy] = useState<string>("ZZZ");
  const defaultValues = {
    title: "",
    thumbnail: "",
    slug: "",
    metaDescription: "",
    status: "publish" as const,
    uploadBy: uploadBy,
    categories: "",
    genres: "",
    iframe: [],
    download: [],
    content: "",
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "iframe",
  });

  const {
    fields: downloadFields,
    append: appendDownload,
    remove: removeDownload,
  } = useFieldArray({
    control: form.control,
    name: "download",
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
      formData.append("uploadBy", data.uploadBy);
      formData.append("thumbnail", data.thumbnail);
      formData.append("slug", data.slug);
      formData.append("metaDescription", data.metaDescription ?? "");
      formData.append("categories", data.categories);
      formData.append("genres", data.genres);
      formData.append("status", data.status);
      formData.append("content", data.content ?? "");
      formData.append("iframe", JSON.stringify(data.iframe));
      formData.append("download", JSON.stringify(data.download));
      const { message } = await saveArticle(
        formData,
        type === "add" ? null : article?.id,
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
    if (!open) {
      form.reset(defaultValues);
      return;
    }
    if (type === "add") {
      form.reset(defaultValues);
      return;
    }
    if (type === "edit" && article) {
      form.reset({
        title: article.title ?? "",
        slug: article.slug ?? "",
        thumbnail: article.thumbnail ?? "",
        status: article.status ?? "publish",
        uploadBy: article.uploadBy ?? uploadBy,
        metaDescription: article.metaDescription ?? "",
        categories:
          article.categories?.map((category) => category.name).join(", ") ?? "",
        genres: article.genres?.map((genre) => genre.name).join(", ") ?? "",
        iframe:
          article.iframe?.map((stream) => ({
            id: stream.id,
            title: stream.title,
            src: stream.src,
            isActive: stream.isActive ?? false,
          })) ?? [],
        download:
          article.download?.map((item) => ({
            id: item.id,
            quality: item.quality,
            links:
              item.links?.map((link) => ({
                id: link.id,
                name: link.name,
                url: link.url,
                isActive: link.isActive ?? false,
              })) ?? [],
            isActive: item.isActive ?? false,
          })) ?? [],
        content: article.content ?? "",
      });
    }
  }, [open, type, article]);
  useEffect(() => {
    async function getProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.display_name ?? "ZZZ";
        setUploadBy(name);
        if (type === "add") {
          form.setValue("uploadBy", name);
        }
      }
    }
    getProfile();
  }, [form, type]);
  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        className="w-[calc(100vw-1rem)] max-w-2xl rounded-sm sm:w-full"
        title={type === "edit" ? "Edit Post" : "Add Post"}
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
          className="max-h-[60vh] overflow-y-scroll"
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="thumbnail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>URL Thumbnail</FieldLabel>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https\://example.com/"
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
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="space-y-1">
                        <FieldLabel htmlFor="article-status">
                          Status Artikel
                        </FieldLabel>
                        <p className="text-sm text-muted-foreground">
                          {field.value === "publish" ? "Publish" : "Draft"}
                        </p>
                      </div>
                      <Switch
                        id="article-status"
                        checked={field.value === "publish"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "publish" : "draft")
                        }
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="uploadBy"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="article-form-upload-by">
                      Upload By
                    </FieldLabel>
                    <Input
                      {...field}
                      id="article-form-upload-by"
                      aria-invalid={fieldState.invalid}
                      className="rounded-sm"
                      placeholder="X"
                      autoComplete="off"
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
                    Pilih stream yang sudah ada atau buat stream baru.
                  </FieldDescription>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Select
                  value={selectedStreamId}
                  onValueChange={(value) => {
                    const stream = iframe.find((item) => item.id === value);
                    if (!stream) return;
                    const alreadyExists = form
                      .getValues("iframe")
                      .some((item) => item.id === stream.id);
                    if (alreadyExists) {
                      toast.add({
                        type: "error",
                        description: "Stream sudah ditambahkan.",
                      });
                      setSelectedStreamId("");
                      return;
                    }
                    append({
                      id: stream.id,
                      title: stream.title,
                      src: stream.src,
                      isActive: stream.isActive ?? false,
                    });
                    setSelectedStreamId("");
                  }}
                >
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="Pilih stream dari database" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {iframe.map((stream) => (
                      <SelectItem
                        key={stream.id}
                        value={stream.id}
                        className="rounded-sm"
                      >
                        {stream.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      id: undefined,
                      title: "",
                      src: "",
                      isActive: false,
                    })
                  }
                >
                  <PlusIcon />
                  New
                </Button>
              </div>
              <div className="mt-3 space-y-3">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">
                          Stream {index + 1}
                        </span>
                        {item.id && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            Existing
                          </span>
                        )}
                      </div>
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
                    </div>
                    <Controller
                      name={`iframe.${index}.title`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Title</FieldLabel>
                          <Input
                            {...field}
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
                      name={`iframe.${index}.src`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>URL</FieldLabel>
                          <Input
                            {...field}
                            type="url"
                            className="rounded-sm"
                            placeholder="https\://example.com/stream.m3u8"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`iframe.${index}.isActive`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                            <div className="space-y-1">
                              <FieldLabel htmlFor={`iframe-${index}-status`}>
                                Status
                              </FieldLabel>
                              <p className="text-sm text-muted-foreground">
                                {field.value ? "Active" : "Non Active"}
                              </p>
                            </div>
                            <Switch
                              id={`iframe-${index}-status`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-invalid={fieldState.invalid}
                            />
                          </div>
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

            <Field>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <FieldLabel>Download URLs</FieldLabel>
                  <FieldDescription>
                    Pilih download dari database atau buat download baru.
                  </FieldDescription>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Select
                  value={selectedDownloadId}
                  onValueChange={(value) => {
                    const item = (downloads ?? []).find(
                      (download) => download.id === value,
                    );
                    if (!item) return;

                    const alreadyExists = form
                      .getValues("download")
                      .some((download) => download.id === item.id);

                    if (alreadyExists) {
                      toast.add({
                        type: "error",
                        description: "Download sudah ditambahkan.",
                      });
                      setSelectedDownloadId("");
                      return;
                    }

                    appendDownload({
                      id: item.id,
                      quality: item.quality,
                      links:
                        item.links?.map((link) => ({
                          id: link.id,
                          name: link.name,
                          url: link.url,
                          isActive: link.isActive ?? true,
                        })) ?? [],
                      isActive: item.isActive ?? true,
                    });
                    setSelectedDownloadId("");
                  }}
                >
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="Pilih download dari database" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {(downloads ?? []).map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="rounded-sm"
                      >
                        {item.quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendDownload({
                      id: undefined,
                      quality: "",
                      links: [],
                      isActive: true,
                    })
                  }
                >
                  <PlusIcon />
                  New
                </Button>
              </div>

              <div className="mt-3 space-y-3">
                {downloadFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">
                          Download {index + 1}
                        </span>
                        {item.id && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            Existing
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeDownload(index)}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Remove download</span>
                      </Button>
                    </div>

                    <Controller
                      name={`download.${index}.quality`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Quality</FieldLabel>
                          <Input
                            {...field}
                            className="rounded-sm"
                            placeholder="1080p, 720p, 480p"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`download.${index}.isActive`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                            <div className="space-y-1">
                              <FieldLabel>Download Status</FieldLabel>
                              <p className="text-sm text-muted-foreground">
                                {field.value ? "Active" : "Non Active"}
                              </p>
                            </div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-invalid={fieldState.invalid}
                            />
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <DownloadLinksEditor form={form} downloadIndex={index} />
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
                    placeholder="Jav, Jav Cosplay, Local Pride"
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
              name="genres"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Genres</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Blackmail,Rape, Milf, Loli"
                    className="rounded-sm"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Separate genres with commas.
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
                    id="article-form-description"
                    placeholder="Content"
                    rows={5}
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

type DownloadFormValues = z.infer<typeof formSchema>;

function DownloadLinksEditor({
  form,
  downloadIndex,
}: {
  form: ReturnType<typeof useForm<DownloadFormValues>>;
  downloadIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `download.${downloadIndex}.links`,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <FieldLabel>Links</FieldLabel>
          <FieldDescription>
            Tambahkan satu atau beberapa link untuk kualitas ini.
          </FieldDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: undefined,
              name: "",
              url: "",
              isActive: true,
            })
          }
        >
          <PlusIcon />
          Add Link
        </Button>
      </div>

      {fields.map((link, linkIndex) => (
        <div key={link.id} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Link {linkIndex + 1}</span>
            {link.id && (
              <span className="text-xs text-muted-foreground">Existing</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => remove(linkIndex)}
            >
              <Trash2Icon />
              <span className="sr-only">Remove link</span>
            </Button>
          </div>

          <Controller
            name={`download.${downloadIndex}.links.${linkIndex}.name`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Link Name</FieldLabel>
                <Input
                  {...field}
                  className="rounded-sm"
                  placeholder="Google Drive, MediaFire"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`download.${downloadIndex}.links.${linkIndex}.url`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>URL</FieldLabel>
                <Input
                  {...field}
                  type="url"
                  className="rounded-sm"
                  placeholder="https://example.com/file"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`download.${downloadIndex}.links.${linkIndex}.isActive`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="space-y-1">
                    <FieldLabel>Link Status</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Active" : "Non Active"}
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default FormPosts;
