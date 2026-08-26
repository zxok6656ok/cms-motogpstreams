"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";

type DeleteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: "single" | "many";
  name?: string;
  id?: string;
  ids?: string[];
  onDelete: (id: string) => Promise<void>;
  onDeleteMany: (ids: string[]) => Promise<void>;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

const Delete = ({
  open,
  setOpen,
  name,
  id,
  type,
  ids = [],
  onDelete,
  onDeleteMany,
  setRowSelection,
  setSelectedIds,
}: DeleteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      if (type === "single") {
        if (!id) return;

        await onDelete(id);
      } else {
        if (ids.length === 0) return;

        await onDeleteMany(ids);
      }

      setOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDisabled = isDeleting || (type === "single" ? !id : ids.length === 0);

  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!isDeleting) {
          setOpen(value);
        }
      }}
      title={type === "single" ? "Delete Widget" : "Delete Widgets"}
      className="w-[calc(100vw-1rem)] max-w-2xl rounded-sm sm:w-full"
      footer={
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDisabled}
            className="order-1 sm:order-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedIds([]);
              setRowSelection({});
              setOpen(false);
            }}
            disabled={isDeleting}
            className="order-2 sm:order-1"
          >
            Close
          </Button>
        </div>
      }
    >
      {type === "single" ? (
        <div className="text-sm">
          This will permanently delete{" "}
          <span className="font-medium text-red-500">&quot;{name}&quot;</span>.
        </div>
      ) : (
        <div className="text-sm">
          This will permanently delete{" "}
          <span className="font-medium text-red-500">{ids.length} widgets</span>
          .
        </div>
      )}
    </Modal>
  );
};

export default Delete;
