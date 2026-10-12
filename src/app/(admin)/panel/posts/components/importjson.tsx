"use client";

import { useState, useTransition } from "react";
import { importArticles } from "../action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";

type ImportResult = {
  total: number;
  success: number;
  failed: number;
  results: {
    title: string;
    success: boolean;
    message: string;
  }[];
};

type ImportJsonProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ImportJson({ open, setOpen }: ImportJsonProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [resetKey, setResetKey] = useState(0);

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError("");
    setResetKey((prev) => prev + 1);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select a JSON file first.");
      return;
    }

    setError("");
    setResult(null);

    startTransition(async () => {
      try {
        const text = await file.text();
        const json: unknown = JSON.parse(text);

        if (!Array.isArray(json)) {
          throw new Error("The JSON format must be an array of articles.");
        }

        const response = await importArticles(json);
        setResult(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to import JSON."
        );
      }
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Upload JSON File"
      className="w-[calc(100vw-1rem)] max-w-2xl rounded-sm sm:w-full"
    >
      <div
        key={resetKey}
        className="space-y-4 rounded-md border p-4"
      >
        <div>
          <h2 className="font-semibold">Import Articles from JSON</h2>
          <p className="text-sm text-muted-foreground">
            Upload a JSON file containing articles, iframes, and download links.
          </p>
        </div>

        <Input
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
            setResult(null);
          }}
        />

        <Button
          type="button"
          onClick={handleImport}
          disabled={!file || isPending}
        >
          {isPending ? "Importing..." : "Import JSON"}
        </Button>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {result && (
          <div className="space-y-2 text-sm">
            <p>
              Total: {result.total} | Successful: {result.success} | Failed:{" "}
              {result.failed}
            </p>

            <div className="max-h-72 space-y-2 overflow-y-auto">
              {result.results.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded border p-3"
                >
                  <p className="font-medium">{item.title}</p>

                  <p
                    className={
                      item.success ? "text-green-600" : "text-destructive"
                    }
                  >
                    {item.success ? "Success" : "Failed"}: {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}