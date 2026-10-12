"use client";
import { ImportIcon, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { getColumns } from "./columns";
import { useState } from "react";
import FormPosts from "./form";
import View from "./view";
import Delete from "./delete";
import type { Prisma } from "@/generated/prisma/client";
import { deleteAllArticle, deleteArticle } from "../action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { RowSelectionState } from "@tanstack/react-table";
import ImportJson from "./importjson";

export type Article = Prisma.ArticleGetPayload<{
  include: {
    categories: true;
    genres: true;
    iframe: true;
    download: {
      include: { links: true };
    };
  };
}>;

type TableProps = {
  data: Article[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  search: string;
};

export type ExistingStream = {
  id: string;
  title: string;
  src: string;
  isActive: boolean;
};

export default function Table({
  data,
  page,
  pageSize,
  pageCount,
  total,
  search,
}: TableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalView, setOpenModalView] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [type, setType] = useState<"add" | "edit">("add");
  const [typeDelete, setTypeDelete] = useState<"single" | "many">("single");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    try {
      const { message } = await deleteArticle(postId);

      setOpenModalDelete(false);
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

  const handleDeleteMany = async (ids: string[]) => {
    try {
      const { message } = await deleteAllArticle(ids);
      setOpenModalDelete(false);
      setArticle(null);

      setSelectedIds([]);
      setRowSelection({});
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

  const columns = getColumns({
    setType: setType,
    onEdit: setOpen,
    onView: setOpenModalView,
    onDelete: setOpenModalDelete,
    setArticle: setArticle,
    setTypeDelete,
    setSelectedIds,
    setRowSelection,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start sm:items-center flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>

          <p className="text-sm text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={() => {
              setOpenModalDelete(true);
              setTypeDelete("many");
            }}
            className="w-full rounded-sm sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Posts
            {selectedIds.length > 0 && ` (${selectedIds.length})`}
          </Button>

          <Button
            onClick={() => {
              setArticle(null);
              setType("add");
              setOpen(true);
            }}
            className="w-full rounded-sm sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Posts
          </Button>
          <Button
            onClick={() => {
              setOpenModalImport(true);
            }}
            className="w-full rounded-sm sm:w-auto"
          >
            <ImportIcon className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
        </div>
      </div>

      <DataTable<Article>
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        searchKey={search}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        searchPlaceholder="Search posts..."
      />
      <FormPosts
        open={open}
        setOpen={setOpen}
        article={article}
        type={type}
        iframe={article?.iframe ?? []}
      />
      <View open={openModalView} setOpen={setOpenModalView} article={article} />
      <ImportJson open={openModalImport} setOpen={setOpenModalImport} />
      <Delete
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={article?.title}
        id={article?.id}
        onDelete={handleDelete}
        type={typeDelete}
        onDeleteMany={handleDeleteMany}
        ids={selectedIds}
        setRowSelection={setRowSelection}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
}
