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
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteSetting } from "../page";
import { saveSiteSettings } from "../action";
import { toast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  siteName: z.string().min(1, "Site name is required."),

  title: z
    .string()
    .min(1, "Title is required.")
    .max(150, "Title must be at most 150 characters."),

  description: z.string().optional(),

  siteUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  googleAnalyticsId: z.string().optional(),
  googleSiteVerification: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  ogImage: z.string().optional(),

  metaTitle: z.string().max(150).optional(),

  metaDescription: z
    .string()
    .max(160, "Meta description must be at most 160 characters.")
    .optional(),

  playerNoticeTitle: z.string().optional(),

  playerNoticeDescription: z.string().optional(),

  telegramTitle: z.string().optional(),

  telegramDescription: z.string().optional(),
  socialLinks: z.array(
    z.object({
      name: z.string().min(1, "Name is required."),
      platform: z.enum([
        "telegram",
        "facebook",
        "instagram",
        "twitter",
        "youtube",
        "tiktok",
        "pinterest",
      ]),
      url: z.string().url("Invalid URL."),
    }),
  ),

  adLinks: z.array(
    z.object({
      name: z.string().min(1, "Name is required."),
      url: z.string().min(1, "URL is required."),
      order: z.number(),
      position: z.enum(["head", "body"]),
      isActive: z.boolean(),
    }),
  ),

  navbarItems: z.array(
    z.object({
      name: z.string().min(1, "Name is required."),
      url: z.string().min(1, "URL is required."),
      order: z.number(),
    }),
  ),

  footerItems: z.array(
    z.object({
      name: z.string().min(1, "Name is required."),
      url: z.string().min(1, "URL is required."),
      order: z.number(),
    }),
  ),
});

type SiteSettingFormValues = z.infer<typeof formSchema>;

type SiteSettingFormProps = {
  setting?: SiteSettingFormValues;
  site: SiteSetting | null;
};

const SiteSettingForm = ({ site }: SiteSettingFormProps) => {
  const form = useForm<SiteSettingFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      siteName: site?.siteName ?? "SITE NAME",
      title: site?.title ?? "",
      description: site?.description ?? "",
      siteUrl: site?.siteUrl ?? "",
      googleAnalyticsId: site?.googleAnalyticsId ?? "",
      googleSiteVerification: site?.googleSiteVerification ?? "",
      logo: site?.logo ?? "",
      favicon: site?.favicon ?? "",
      ogImage: site?.ogImage ?? "",

      metaTitle: site?.metaTitle ?? "",
      metaDescription: site?.metaDescription ?? "",
      playerNoticeTitle: site?.playerNoticeTitle ?? "",

      playerNoticeDescription: site?.playerNoticeDescription ?? "",

      telegramTitle: site?.telegramTitle ?? "",

      telegramDescription: site?.telegramDescription ?? "",
      socialLinks: site?.socialLinks ?? [
        {
          name: "",
          platform: "telegram",
          url: "",
        },
      ],

      navbarItems: site?.navbarItems ?? [
        {
          name: "Home",
          url: "/",
          order: 0,
        },
      ],

      footerItems: site?.footerItems ?? [
        {
          name: "",
          url: "",
          order: 0,
        },
      ],
      adLinks: site?.adLinks?.map((ad) => ({
        name: ad.name,
        url: ad.url,
        position: ad.position ?? "body",
        order: ad.order,
        isActive: ad.isActive,
      })) ?? [
        {
          name: "",
          url: "",
          position: "body",
          order: 0,
          isActive: true,
        },
      ],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const {
    fields: navbarFields,
    append: appendNavbar,
    remove: removeNavbar,
  } = useFieldArray({
    control: form.control,
    name: "navbarItems",
  });

  const {
    fields: adFields,
    append: appendAd,
    remove: removeAd,
  } = useFieldArray({
    control: form.control,
    name: "adLinks",
  });

  const {
    fields: footerFields,
    append: appendFooter,
    remove: removeFooter,
  } = useFieldArray({
    control: form.control,
    name: "footerItems",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      formData.append("siteName", data.siteName);
      formData.append("title", data.title);
      formData.append("description", data.description ?? "");
      formData.append("googleAnalyticsId", data.googleAnalyticsId ?? "");
      formData.append(
        "googleSiteVerification",
        data.googleSiteVerification ?? "",
      );
      formData.append("siteUrl", data.siteUrl ?? "");

      formData.append("logo", data.logo ?? "");
      formData.append("favicon", data.favicon ?? "");
      formData.append("ogImage", data.ogImage ?? "");

      formData.append("metaTitle", data.metaTitle ?? "");

      formData.append("metaDescription", data.metaDescription ?? "");

      formData.append("socialLinks", JSON.stringify(data.socialLinks));

      formData.append("navbarItems", JSON.stringify(data.navbarItems));

      formData.append("footerItems", JSON.stringify(data.footerItems));
      formData.append("adLinks", JSON.stringify(data.adLinks));
      formData.append("playerNoticeTitle", data.playerNoticeTitle ?? "");

      formData.append(
        "playerNoticeDescription",
        data.playerNoticeDescription ?? "",
      );

      formData.append("telegramTitle", data.telegramTitle ?? "");

      formData.append("telegramDescription", data.telegramDescription ?? "");
      const { message } = await saveSiteSettings(formData, site?.id);

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

  if (!site) return;
  return (
    <form
      id="site-setting-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-h-[70vh] overflow-y-auto"
    >
      <FieldGroup>
        <div>
          <h2 className="text-lg font-semibold">Site Information</h2>

          <p className="text-sm text-muted-foreground">
            Basic information about your website.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="siteName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Site Name</FieldLabel>

                <Input
                  {...field}
                  placeholder="SITE NAME"
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
            name="siteUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Site URL</FieldLabel>

                <Input
                  {...field}
                  type="url"
                  placeholder="https://SITE NAME.com"
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
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Site Title</FieldLabel>

              <Input
                {...field}
                placeholder="SITE NAME - "
                className="rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>

              <Textarea
                {...field}
                placeholder="Website description..."
                rows={4}
                className="resize-none rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              <FieldDescription>
                Short description of your website.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Assets</h2>

          <p className="text-sm text-muted-foreground">
            Logo, favicon and Open Graph image.
          </p>
        </div>

        <Controller
          name="logo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Logo URL</FieldLabel>

              <Input
                {...field}
                type="url"
                placeholder="https://..."
                className="rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="favicon"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Favicon URL</FieldLabel>

                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
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
            name="ogImage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>OG Image URL</FieldLabel>

                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
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

        <div className="pt-4">
          <h2 className="text-lg font-semibold">SEO</h2>

          <p className="text-sm text-muted-foreground">
            Search engine optimization settings.
          </p>
        </div>

        <Controller
          name="metaTitle"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Meta Title</FieldLabel>

              <Input
                {...field}
                placeholder="SITE NAME - "
                className="rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="metaDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Meta Description</FieldLabel>

              <Textarea
                {...field}
                placeholder="Description for search engines..."
                rows={4}
                className="resize-none rounded-sm"
                aria-invalid={fieldState.invalid}
              />

              <FieldDescription>
                {field.value?.length ?? 0}/160 characters
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Social Media</h2>

              <p className="text-sm text-muted-foreground">
                Add your social media links.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendSocial({
                  name: "",
                  platform: "telegram",
                  url: "",
                })
              }
            >
              <PlusIcon />
              Add Social
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {socialFields.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Social {index + 1}</span>

                {socialFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeSocial(index)}
                  >
                    <Trash2Icon />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Controller
                  name={`socialLinks.${index}.name`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>

                      <Input
                        {...field}
                        placeholder="SITE NAME"
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
                  name={`socialLinks.${index}.platform`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className={"rounded-sm"}
                    >
                      <FieldLabel>Platform</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className={"rounded-sm"}
                        >
                          <SelectValue
                            placeholder="Platform"
                            className={"rounded-sm"}
                          />
                        </SelectTrigger>

                        <SelectContent className={"rounded-sm"}>
                          <SelectItem value="telegram" className={"rounded-sm"}>
                            Telegram
                          </SelectItem>

                          <SelectItem value="facebook" className={"rounded-sm"}>
                            Facebook
                          </SelectItem>

                          <SelectItem
                            value="instagram"
                            className={"rounded-sm"}
                          >
                            Instagram
                          </SelectItem>

                          <SelectItem value="twitter" className={"rounded-sm"}>
                            Twitter / X
                          </SelectItem>

                          <SelectItem value="youtube" className={"rounded-sm"}>
                            YouTube
                          </SelectItem>

                          <SelectItem value="tiktok" className={"rounded-sm"}>
                            TikTok
                          </SelectItem>

                          <SelectItem
                            value="pinterest"
                            className={"rounded-sm"}
                          >
                            Pinterest
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name={`socialLinks.${index}.url`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>URL</FieldLabel>

                      <Input
                        {...field}
                        type="url"
                        placeholder="https://..."
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
            </div>
          ))}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Navbar</h2>

              <p className="text-sm text-muted-foreground">
                Navigation menu displayed in the navbar.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendNavbar({
                  name: "",
                  url: "",
                  order: navbarFields.length,
                })
              }
            >
              <PlusIcon />
              Add Menu
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {navbarFields.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex items-start sm:items-center flex-col sm:flex-row gap-3">
                <span className="w-6 text-sm text-muted-foreground">
                  {index + 1}
                </span>

                <Controller
                  name={`navbarItems.${index}.name`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>

                      <Input
                        {...field}
                        placeholder="Anime"
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
                  name={`navbarItems.${index}.url`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>URL</FieldLabel>

                      <Input
                        {...field}
                        placeholder="/anime"
                        className="rounded-sm"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6 text-destructive"
                  onClick={() => removeNavbar(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Footer</h2>

              <p className="text-sm text-muted-foreground">
                Links displayed in the footer.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendFooter({
                  name: "",
                  url: "",
                  order: footerFields.length,
                })
              }
            >
              <PlusIcon />
              Add Footer Link
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {footerFields.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex items-start sm:items-center flex-col sm:flex-row gap-3">
                <span className="w-6 text-sm text-muted-foreground">
                  {index + 1}
                </span>

                <Controller
                  name={`footerItems.${index}.name`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>

                      <Input
                        {...field}
                        placeholder="Privacy Policy"
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
                  name={`footerItems.${index}.url`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>URL</FieldLabel>

                      <Input
                        {...field}
                        placeholder="/privacy"
                        className="rounded-sm"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6 text-destructive"
                  onClick={() => removeFooter(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-semibold">Player Notice</h2>

          <p className="text-sm text-muted-foreground">
            Notice displayed below the video player.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="playerNoticeTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Notice Title</FieldLabel>

                <Input
                  {...field}
                  placeholder="Player Bermasalah?"
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
            name="telegramTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Telegram Title</FieldLabel>

                <Input
                  {...field}
                  placeholder="Gabung Telegram"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="playerNoticeDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Notice Description</FieldLabel>

                <Textarea
                  {...field}
                  placeholder="Jika video tidak dapat diputar atau mengalami error..."
                  rows={4}
                  className="resize-none rounded-sm"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="telegramDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Telegram Description</FieldLabel>

                <Textarea
                  {...field}
                  placeholder="Dapatkan informasi terbaru dan update link streaming..."
                  rows={4}
                  className="resize-none rounded-sm"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Advertisement</h2>

              <p className="text-sm text-muted-foreground">
                Add advertisement scripts for the head or body.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendAd({
                  name: "",
                  url: "",
                  position: "body",
                  order: adFields.length,
                  isActive: true,
                })
              }
            >
              <PlusIcon />
              Add Advertisement
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {adFields.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex items-start sm:items-center flex-col sm:flex-row gap-3">
                <span className="mb-2 w-6 text-sm text-muted-foreground">
                  {index + 1}
                </span>

                <Controller
                  name={`adLinks.${index}.name`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>

                      <Input
                        {...field}
                        placeholder="Advertisement"
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
                  name={`adLinks.${index}.position`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="w-32" data-invalid={fieldState.invalid}>
                      <FieldLabel>Position</FieldLabel>

                      <Select
                        value={field.value ?? "body"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-sm">
                          <SelectValue placeholder="Position" />
                        </SelectTrigger>

                        <SelectContent className="rounded-sm">
                          <SelectItem value="head">Head</SelectItem>

                          <SelectItem value="body">Body</SelectItem>
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name={`adLinks.${index}.url`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <FieldLabel>URL</FieldLabel>

                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example.com"
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
                  name={`adLinks.${index}.isActive`}
                  control={form.control}
                  render={({ field }) => (
                    <Field className="w-24">
                      <FieldLabel>Status</FieldLabel>

                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeAd(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Controller
            name={`googleAnalyticsId`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel>Code Google Analytics Id</FieldLabel>

                <Input
                  {...field}
                  placeholder="Analytics Id"
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
            name={`googleSiteVerification`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel>Code Google Site Verification</FieldLabel>

                <Input
                  {...field}
                  placeholder="Site Verification"
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

        <div className="pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default SiteSettingForm;
