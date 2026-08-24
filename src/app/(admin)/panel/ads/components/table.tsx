"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { toast } from "@/components/ui/toast";

import { getColumns } from "./columns";
import FormAdsWidgets from "./form";

import type { AdWidget } from "../page";
import { deleteAdWidget, deleteAllAdWidget } from "../action";
import Delete from "./delete";
import View from "./view";
import { RowSelectionState } from "@tanstack/react-table";

type TableProps = {
  data: AdWidget[];
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
  const [adWidget, setAdWidget] = useState<AdWidget | null>(null);
  const [type, setType] = useState<"add" | "edit">("add");
  const [typeDelete, setTypeDelete] = useState<"single" | "many">("single");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const { message } = await deleteAdWidget(id);

      setOpenModalDelete(false);
      setAdWidget(null);

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
    setType,

    onEdit: setOpen,
    onView: setOpenModalView,
    onDelete: setOpenModalDelete,
    setAdWidget,
    setTypeDelete,
    setSelectedIds,
    setRowSelection,
  });

  const handleDeleteMany = async (ids: string[]) => {
    try {
      const { message } = await deleteAllAdWidget(ids);
      setOpenModalDelete(false);
      setAdWidget(null);

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
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start sm:items-center flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ads Widgets</h1>

          <p className="text-sm text-muted-foreground">
            Manage advertisement widgets.
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
            Delete All Widget
            {selectedIds.length > 0 && ` (${selectedIds.length})`}
          </Button>

          <Button
            onClick={() => {
              setAdWidget(null);
              setType("add");
              setOpen(true);
            }}
            className="w-full rounded-sm sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>

      <DataTable<AdWidget>
        data={data}
        columns={columns}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        searchKey={search}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        searchPlaceholder="Search ads widgets..."
      />

      <FormAdsWidgets
        open={open}
        setOpen={setOpen}
        ads={adWidget}
        type={type}
      />

      <View open={openModalView} setOpen={setOpenModalView} ads={adWidget} />

      <Delete
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        name={adWidget?.name}
        id={adWidget?.id}
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
