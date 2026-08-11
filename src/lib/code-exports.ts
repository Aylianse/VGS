import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export type CodeExportMeta = {
  codes: string[];
  productName: string;
  customerName: string;
  generatedAt?: Date;
};

function exportFileName(meta: CodeExportMeta, extension: string) {
  const slug = meta.customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const date = (meta.generatedAt ?? new Date()).toISOString().slice(0, 10);
  return `vitaglow-codes-${slug || "batch"}-${date}.${extension}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCodesTxt(meta: CodeExportMeta) {
  const header = [
    `Product: ${meta.productName}`,
    `Customer / batch: ${meta.customerName}`,
    `Generated: ${(meta.generatedAt ?? new Date()).toLocaleString()}`,
    `Total codes: ${meta.codes.length}`,
    "",
  ].join("\n");

  const blob = new Blob([[header, meta.codes.join("\n")].join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  triggerDownload(blob, exportFileName(meta, "txt"));
}

export function downloadCodesExcel(meta: CodeExportMeta) {
  const generatedAt = (meta.generatedAt ?? new Date()).toLocaleString();
  const rows = meta.codes.map((code, index) => ({
    "#": index + 1,
    Code: code,
    Product: meta.productName,
    "Customer / batch": meta.customerName,
    Generated: generatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 6 }, { wch: 18 }, { wch: 28 }, { wch: 24 }, { wch: 22 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");
  XLSX.writeFile(workbook, exportFileName(meta, "xlsx"));
}

export function downloadCodesPdf(meta: CodeExportMeta) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const generatedAt = (meta.generatedAt ?? new Date()).toLocaleString();

  doc.setFontSize(16);
  doc.text("Vita Glow — Verification Codes", 40, 48);
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Product: ${meta.productName}`, 40, 68);
  doc.text(`Customer / batch: ${meta.customerName}`, 40, 82);
  doc.text(`Generated: ${generatedAt}`, 40, 96);
  doc.text(`Total: ${meta.codes.length} codes`, 40, 110);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 128,
    head: [["#", "Code"]],
    body: meta.codes.map((code, index) => [String(index + 1), code]),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [196, 92, 122] },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 140, fontStyle: "bold" },
    },
  });

  doc.save(exportFileName(meta, "pdf"));
}
