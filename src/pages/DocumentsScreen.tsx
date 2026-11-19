import { useState } from "react";
import { Download, Eye, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useTenant } from "@/src/context/TenantContext";
import { formatDateShort } from "@/src/lib/utils";
import { TenantDocument } from "@/src/types";

export function DocumentsScreen() {
  const { documents } = useTenant();
  const [previewDoc, setPreviewDoc] = useState<TenantDocument | null>(null);

  const handleDownload = (doc: TenantDocument) => {
    const content = `PG FINDER DIGITAL DOCUMENT RECORD\nTitle: ${doc.name}\nPG: ${doc.pgName}\nDate: ${doc.date}\nStatus: ${doc.status}\nDetails: ${doc.description}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.replace(/[^a-z0-9]+/gi, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.name}`);
  };

  return (
    <div className="pb-16">
      <PageHeader title="My Documents" subtitle="Verified IDs, agreements & receipts" />

      <div className="mx-auto mt-5 max-w-4xl space-y-5 px-4 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-sm text-[#065F46]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#047857]" />
          <p>
            Your identity proofs and PG agreements are kept private to your account and are never visible on public listings.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {documents.map((doc) => (
            <article
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                    <FileText className="h-5 w-5" />
                  </span>
                  <StatusBadge
                    label={doc.status}
                    tone={
                      doc.status === "Verified" || doc.status === "Issued"
                        ? "success"
                        : "neutral"
                    }
                  />
                </div>

                <h2 className="mt-3 font-display text-base font-bold text-[#111827]">
                  {doc.name}
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  {doc.pgName} · {formatDateShort(doc.date)} · {doc.fileSize}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-[#F1F5F9] pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPreviewDoc(doc)}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog
        open={Boolean(previewDoc)}
        onOpenChange={(o) => !o && setPreviewDoc(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
            <DialogDescription>
              {previewDoc?.pgName} · {previewDoc ? formatDateShort(previewDoc.date) : ""}
            </DialogDescription>
          </DialogHeader>
          {previewDoc && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#047857]">
                  {previewDoc.category} Document Preview (Demo)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#374151]">
                  {previewDoc.description}
                </p>
              </div>
              <Button className="w-full" onClick={() => handleDownload(previewDoc)}>
                <Download className="h-4 w-4" />
                Download Copy
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
