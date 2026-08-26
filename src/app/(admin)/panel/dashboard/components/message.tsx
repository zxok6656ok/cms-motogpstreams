"use client";

import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

const Message = () => {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    async function getProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setUsername(user.user_metadata?.display_name ?? "");
    }

    getProfile();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <p className="text-sm text-muted-foreground">
        Welcome back,{" "}
        <span className="font-semibold text-foreground">{username}</span>!{" "}
        Here&apos;s an overview of your website.
      </p>
    </div>
  );
};

export default Message;
