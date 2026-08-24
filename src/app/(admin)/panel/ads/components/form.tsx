"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/modal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { toast } from "@/components/ui/toast";
import { adWidgetSave } from "../action";
import { AdWidget } from "../page";

export const adWidgetSchema = z.object({
  name: z.string().min(1, "Name is required."),

  htmlCode: z.string().optional(),

  scriptCode: z.string().optional(),

  position: z.enum([
    "head",
    "body",
    "article",
    "sidebar",
    "floating",
    "footer",
  ]),

  order: z.number().int(),

  isActive: z.boolean(),

  height: z.number().int().min(0),

  maxWidth: z.string().min(1, "Max width is required."),

  mobileOnly: z.boolean(),

  showClose: z.boolean(),
});

export type AdWidgetFormValues = z.infer<typeof adWidgetSchema>;

type FormAdsWidgetsProps = {
  setOpen: (open: boolean) => void;
  type: "edit" | "add";
  open: boolean;
  ads: AdWidget | null;
};

const defaultValues: AdWidgetFormValues = {
  name: "",
  htmlCode: "",
  scriptCode: "",
  position: "body",
  order: 0,
  isActive: true,
  height: 90,
  maxWidth: "md",
  mobileOnly: true,
  showClose: true,
};

const FormAdsWidgets = ({ open, setOpen, ads, type }: FormAdsWidgetsProps) => {
  const router = useRouter();

  const form = useForm<AdWidgetFormValues>({
    resolver: zodResolver(adWidgetSchema),
    defaultValues,
  });

  useEffect(() => {
    if (type === "add") {
      form.reset(defaultValues);
      return;
    }

    if (type === "edit" && ads) {
      console.log("edt");

      form.reset({
        name: ads.name ?? "",
        htmlCode: ads.htmlCode ?? "",
        scriptCode: ads.scriptCode ?? "",
        position: ads.position ?? "body",
        order: ads.order ?? 0,
        isActive: ads.isActive ?? true,
        height: ads.height ?? 90,
        maxWidth: ads.maxWidth ?? "md",
        mobileOnly: ads.mobileOnly ?? true,
        showClose: ads.showClose ?? true,
      });
    }
  }, [type, ads, form]);

  async function onSubmit(values: AdWidgetFormValues) {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("htmlCode", values.htmlCode ?? "");
      formData.append("scriptCode", values.scriptCode ?? "");

      formData.append("position", values.position);
      formData.append("order", String(values.order));
      formData.append("height", String(values.height));

      formData.append("maxWidth", values.maxWidth);

      formData.append("isActive", String(values.isActive));
      formData.append("mobileOnly", String(values.mobileOnly));
      formData.append("showClose", String(values.showClose));

      const { message, success } = await adWidgetSave(formData, ads?.id);

      if (!success) {
        throw new Error(message);
      }

      setOpen(false);
      form.reset(defaultValues);
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
  }
  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      form.reset(defaultValues);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      className="w-full sm:w-2xl max-w-2xl rounded-sm"
      title={type === "add" ? "Add Advertisement" : "Edit Advertisement"}
      description={
        type === "add"
          ? "Create a new advertisement widget."
          : "Update advertisement widget settings."
      }
      footer={
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button
            type="submit"
            form="ad-widget-form"
            className="order-1 sm:order-3"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Advertisement"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="order-3 sm:order-1"
          >
            Close
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (type === "add") {
                form.reset(defaultValues);
              } else if (ads) {
                form.reset({
                  name: ads.name ?? "",
                  htmlCode: ads.htmlCode ?? "",
                  scriptCode: ads.scriptCode ?? "",
                  position: ads.position ?? "body",
                  order: ads.order ?? 0,
                  isActive: ads.isActive ?? true,
                  height: ads.height ?? 90,
                  maxWidth: ads.maxWidth ?? "md",
                  mobileOnly: ads.mobileOnly ?? true,
                  showClose: ads.showClose ?? true,
                });
              }
            }}
            className="order-2 sm:order-2"
          >
            Reset
          </Button>
        </div>
      }
    >
      <form
        id="ad-widget-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[60vh] overflow-y-auto overflow-x-hidden"
      >
        <FieldGroup>
          {/* Advertisement Information */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Advertisement Content</h2>

              <p className="text-sm text-muted-foreground">
                Configure the advertisement code and basic information.
              </p>
            </div>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ad-widget-name">Name</FieldLabel>

                  <Input
                    {...field}
                    id="ad-widget-name"
                    placeholder="Advertisement"
                    className="rounded-sm"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    Name used to identify this advertisement.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="htmlCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ad-widget-html">HTML Code</FieldLabel>

                  <Textarea
                    {...field}
                    id="ad-widget-html"
                    placeholder="<div>Advertisement</div>"
                    rows={7}
                    className="rounded-sm font-mono text-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    HTML code displayed as the advertisement.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="scriptCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ad-widget-script">
                    Script Code
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="ad-widget-script"
                    placeholder="<script>...</script>"
                    rows={7}
                    className="rounded-sm font-mono text-sm"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    JavaScript or third-party advertisement script.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Advertisement Settings */}
          <div className="space-y-4 pt-4">
            <div>
              <h2 className="text-lg font-semibold">Advertisement Settings</h2>

              <p className="text-sm text-muted-foreground">
                Configure the position, size, and display order.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Position</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="rounded-sm"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="head">Head</SelectItem>
                        <SelectItem value="body">Body</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="floating">Floating</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="maxWidth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Max Width</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="rounded-sm"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select max width" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="order"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ad-widget-order">Order</FieldLabel>

                    <Input
                      {...field}
                      id="ad-widget-order"
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="rounded-sm"
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldDescription>
                      Display order for advertisements at the same position.
                    </FieldDescription>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="height"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ad-widget-height">Height</FieldLabel>

                    <Input
                      {...field}
                      id="ad-widget-height"
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="rounded-sm"
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldDescription>
                      Advertisement height in pixels.
                    </FieldDescription>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4 pt-4">
            <div>
              <h2 className="text-lg font-semibold">Display Options</h2>

              <p className="text-sm text-muted-foreground">
                Configure how the advertisement is displayed.
              </p>
            </div>

            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel>Active</FieldLabel>

                    <FieldDescription>
                      Enable or disable this advertisement.
                    </FieldDescription>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="mobileOnly"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel>Mobile Only</FieldLabel>

                    <FieldDescription>
                      Only display this advertisement on mobile devices.
                    </FieldDescription>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="showClose"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel>Show Close Button</FieldLabel>

                    <FieldDescription>
                      Allow visitors to close the advertisement.
                    </FieldDescription>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default FormAdsWidgets;
