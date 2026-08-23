import { createClient } from "@/lib/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/form";

export const metadata: Metadata = {
  title: "LIVEMOTOGP",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/panel/dashboard");
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-2 md:p-5">
      <div className="w-full max-w-sm md:max-w-2xl">
        <LoginForm />
      </div>
    </div>
  );
}
