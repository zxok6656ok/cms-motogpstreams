"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";

import { getColumns } from "./columns";
import type { User } from "@supabase/supabase-js";

export type AuthUser = User;

type TableProps = {
  data: AuthUser[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  search: string;
};

export default function Table({
  data,
  page,
  pageSize,
  pageCount,
  total,
  search,
}: TableProps) {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalView, setOpenModalView] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);

  const columns = getColumns({
    onEdit: setOpenModalEdit,
    onView: setOpenModalView,
    onDelete: setOpenModalDelete,
    setUser,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Users
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage authenticated users.
        </p>
      </div>

      <DataTable<AuthUser>
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        searchKey={search}
        searchPlaceholder="Search users..."
      />

      {/* Modal edit */}
      {/* Modal view */}
      {/* Modal delete */}
    </div>
  );
}