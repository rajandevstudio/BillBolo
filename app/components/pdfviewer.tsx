import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SHOP_DETAILS } from "@/lib/config";
import { Invoice } from "@/types";
import path from "path";

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ---- CALCULATE (same as service) ----
  const validatedItems = invoice.items.map((item) => ({
    desc: item.desc,
    qty: item.qty,
    rate: item.rate,
    amount: item.qty * item.rate,
  }));

  const subtotal = validatedItems.reduce((s, i) => s + i.amount, 0);
  const taxAmount = subtotal * 0.05;
  const grandTotal = subtotal + taxAmount;

  const invoiceNum = invoice.invoiceNumber;
  const dateStr = new Date(invoice.createdAt).toLocaleDateString("en-IN");


  // ---------------- HEADER ----------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(SHOP_DETAILS.name, 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(SHOP_DETAILS.address, 14, 26);
  doc.text(`GSTIN: ${SHOP_DETAILS.gstin}`, 14, 32);

  doc.setFontSize(20);
  doc.setTextColor(68);
  doc.text("INVOICE", pageWidth - 14, 20, { align: "right" });

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`# ${invoiceNum}`, pageWidth - 14, 26, { align: "right" });
  doc.text(`Date: ${dateStr}`, pageWidth - 14, 32, { align: "right" });

  // ---------------- BILL TO ----------------
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 45, 90, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 18, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(invoice.customerName, 18, 60);
  doc.setFontSize(10);
  doc.text("Customer via WhatsApp", 18, 68);

  // ---------------- TABLE ----------------
  autoTable(doc, {
    startY: 85,
    head: [["ITEM DESCRIPTION", "QTY", "RATE", "AMOUNT"]],
    body: validatedItems.map((item) => [
      item.desc,
      item.qty,
      `Rs. ${item.rate.toLocaleString("en-IN")}`,
      `Rs. ${item.amount.toLocaleString("en-IN")}`,
    ]),
    headStyles: {
      fillColor: [238, 238, 238],
      textColor: 0,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252],
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      1: { halign: "left" },
      2: { halign: "left" },
      3: { halign: "left" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // ---------------- TOTALS ----------------
  const summaryX = pageWidth - 70;
  const valX = pageWidth - 14;

  doc.line(14, finalY, pageWidth - 14, finalY);

  let y = finalY + 10;

  doc.text("Subtotal:", summaryX, y);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, valX, y, { align: "right" });
  y += 8;

  doc.text("Tax (GST 5%):", summaryX, y);
  doc.text(`Rs. ${taxAmount.toFixed(2)}`, valX, y, { align: "right" });
  y += 12;

  doc.setFillColor(68, 68, 68);
  doc.rect(summaryX - 4, y - 6, 60, 12, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", summaryX, y);
  doc.text(`Rs. ${grandTotal.toFixed(2)}`, valX, y, { align: "right" });

  doc.setTextColor(0);

  return doc;
}
