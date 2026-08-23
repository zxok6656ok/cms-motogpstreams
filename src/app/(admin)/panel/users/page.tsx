import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Table from "./components/table";

export const metadata: Metadata = {
  title: "Users",
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type PageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = Math.max(Number(params.pageSize) || 10, 1);
  const search = params.search?.trim() || "";

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  let users = data.users;

  if (search) {
    users = users.filter((user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const total = users.length;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedUsers = users.slice(start, end);

  const pageCount = Math.ceil(total / pageSize);
  return (
    <Table
        data={paginatedUsers}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        search={search}
      />
  );
};

export default page;
