"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { getColumns } from "./columns";
import { useState } from "react";
import FormPosts from "./form";
import View from "./view";
import Delete from "./delete";
import type { Prisma } from "@/generated/prisma/client";
import { deleteArticle } from "../action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export type Article = Prisma.ArticleGetPayload<{
  include: {
    categories: true;
    streams: true;
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
  const [article, setArticle] = useState<Article | null>(null);
  const [type, setType] = useState<"add" | "edit">("add");
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    try {
      await deleteArticle(postId);

      setOpenModalDelete(false);
      router.refresh();
      toast.add({
        type: "success",
        description: "The post was successfully deleted.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        description: "Failed to delete the post.",
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
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>

          <p className="text-sm text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>

        <Button
          onClick={() => {
            setOpen(true);
            setType("add");
          }}
          className={"rounded-sm"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <DataTable<Article>
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        searchKey={search}
        searchPlaceholder="Search posts..."
      />
      <FormPosts open={open} setOpen={setOpen} article={article} type={type} />
      <View open={openModalView} setOpen={setOpenModalView} article={article} />
      <Delete
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        title={article?.title}
        id={article?.id}
        onDelete={handleDelete}
      />
    </div>
  );
}
