"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .optional(),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must be at most 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      displayName: "",
    },
  });

  useEffect(() => {
    async function getProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      form.reset({
        email: user.email ?? "",
        phone: user.phone ?? "",
        displayName: user.user_metadata?.display_name ?? "",
      });
    }

    getProfile();
  }, [form]);

  async function onSubmit(values: FormValues) {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        phone: values.phone || undefined,
        data: {
          display_name: values.displayName,
        },
      });

      if (error) {
        form.setError("displayName", {
          message: error.message,
        });
        return;
      }

      toast.add({
        type: "success",
        description: "Profile updated successfully.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-email">
            Email
          </FieldLabel>

          <Input
            id="profile-email"
            {...form.register("email")}
            type="email"
            className="rounded-sm"
            readOnly
            disabled
          />

          <FieldDescription>
            Your account email cannot be changed from your profile.
          </FieldDescription>
        </Field>

        <Field
          data-invalid={
            form.formState.errors.displayName
              ? true
              : undefined
          }
        >
          <FieldLabel htmlFor="profile-display-name">
            Display Name
          </FieldLabel>

          <Input
            id="profile-display-name"
            {...form.register("displayName")}
            placeholder="Admin"
            className="rounded-sm"
            autoComplete="name"
          />

          <FieldDescription>
            The name displayed on your admin panel.
          </FieldDescription>

          {form.formState.errors.displayName && (
            <FieldError>
              {form.formState.errors.displayName.message}
            </FieldError>
          )}
        </Field>

        <Field
          data-invalid={
            form.formState.errors.phone
              ? true
              : undefined
          }
        >
          <FieldLabel htmlFor="profile-phone">
            Phone
          </FieldLabel>

          <Input
            id="profile-phone"
            {...form.register("phone")}
            type="tel"
            className="rounded-sm"
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
          />

          <FieldDescription>
            Your account phone number.
          </FieldDescription>

          {form.formState.errors.phone && (
            <FieldError>
              {form.formState.errors.phone.message}
            </FieldError>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}