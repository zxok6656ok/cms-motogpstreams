"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createClient();
  const router = useRouter();

  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof loginSchema>
  ) => {
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/panel");
    router.refresh();
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="rounded-sm"
                  disabled={form.formState.isSubmitting}
                />

                {form.formState.errors.email && (
                  <FieldDescription className="text-destructive">
                    {form.formState.errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  {...form.register("password")}
                  id="password"
                  type="password"
                  className="rounded-sm"
                  disabled={form.formState.isSubmitting}
                />

                {form.formState.errors.password && (
                  <FieldDescription className="text-destructive">
                    {form.formState.errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {error && (
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              )}

              <Field>
                <Button
                  type="submit"
                  className="rounded-sm"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Logging in..."
                    : "Login"}
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}