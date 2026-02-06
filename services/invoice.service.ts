// services/invoice.service.ts
import PDFDocument from "pdfkit";
import { SHOP_DETAILS } from "@/lib/config";
import { CatalogItem } from "@/types/catelog";
import { ValidatedInvoiceItem } from "@/types";
import path from "path";

export class InvoiceService {
  /**
   * Attach prices from catalog (AI never decides rate)
   */
  validateItems(
    aiItems: { name: string; qty: number }[],
    catalog: CatalogItem[],
  ): ValidatedInvoiceItem[] {
    return aiItems.map((item) => {
      const product = catalog.find(
        (p) => p.name.toLowerCase() === item.name.toLowerCase(),
      );

      if (!product) {
        throw new Error(`Unknown product from AI: ${item.name}`);
      }

      const amount = product.price * item.qty;

      return {
        desc: product.name,
        qty: item.qty,
        rate: product.price,
        amount,
      };
    });
  }

  /**
   * Pure calculation
   */
  calculate(items: ValidatedInvoiceItem[]) {
    const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
    const taxAmount = subtotal * 0.05;
    const grandTotal = subtotal + taxAmount;

    return {
      items,
      subtotal,
      taxAmount,
      grandTotal,
      invoiceNum: `INV-${Date.now()}`,
      dateStr: new Date().toLocaleDateString("en-IN"),
    };
  }

  /**
   * Generate PDF as BUFFER (no filesystem)
   */
  async generatePDF(
    customerName: string,
    calculations: ReturnType<InvoiceService["calculate"]>,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        const buffers: Uint8Array[] = [];
        doc.on("data", (b) => buffers.push(b));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // -- FONTS --
        const regularFont = path.join(
          process.cwd(),
          "public/fonts/NotoSans-Regular.ttf",
        );
        const boldFont = path.join(
          process.cwd(),
          "public/fonts/NotoSans-Bold.ttf",
        );

        doc.registerFont("Noto", regularFont);
        doc.registerFont("NotoBold", boldFont);

        // -- HEADER --
        doc
          .font("NotoBold")
          .fontSize(24)
          .text(SHOP_DETAILS.name, { align: "left" });
        doc
          .font("Noto")
          .fontSize(10)
          .text(SHOP_DETAILS.address, { align: "left" });
        doc
          .font("Noto")
          .fontSize(10)
          .text(`GSTIN: ${SHOP_DETAILS.gstin}`, { align: "left" });

        doc.moveUp(3);
        doc
          .font("NotoBold")
          .fontSize(20)
          .fillColor("#444444")
          .text("INVOICE", { align: "right" });
        doc
          .fillColor("#000000")
          .font("Noto")
          .fontSize(10)
          .text(`# ${calculations.invoiceNum}`, { align: "right" });
        doc.text(`Date: ${calculations.dateStr}`, { align: "right" });

        doc.moveDown(2);

        // -- BILL TO --
        doc.rect(50, 130, 200, 60).fill("#f5f5f5");
        doc.fill("#000000");
        doc.font("NotoBold").fontSize(10).text("BILL TO:", 60, 140);
        doc.font("Noto").fontSize(12).text(customerName, 60, 155);
        doc.fontSize(10).text("Customer via WhatsApp", 60, 175);

        // -- TABLE HEADER --
        const tableTop = 220;
        doc.rect(50, tableTop, 500, 25).fill("#eeeeee");
        doc.fill("#000000");
        doc.font("NotoBold").fontSize(10);
        doc.text("ITEM DESCRIPTION", 60, tableTop + 8);
        doc.text("QTY", 330, tableTop + 8);
        doc.text("RATE", 410, tableTop + 8);
        doc.text("AMOUNT", 490, tableTop + 8);

        // -- TABLE ROWS --
        let y = tableTop + 35;
        doc.font("Noto").fontSize(10);

        calculations.items.forEach((item, i) => {
          if (i % 2 === 0) {
            doc.rect(50, y - 5, 500, 20).fill("#fcfcfc");
            doc.fill("#000000");
          }

          doc.text(item.desc, 60, y);
          doc.text(item.qty.toString(), 330, y);
          doc.text(`₹${item.rate.toLocaleString("en-IN")}`, 410, y);
          doc.text(`₹${item.amount.toLocaleString("en-IN")}`, 490, y);

          y += 25;
        });

        // -- TOTALS --
        const summaryX = 350;
        const valX = 490;

        doc.moveTo(50, y).lineTo(550, y).strokeColor("#cccccc").stroke();
        y += 15;

        doc.font("Noto");
        doc.text("Subtotal:", summaryX, y);
        doc.text(`₹${calculations.subtotal.toFixed(2)}`, valX, y);
        y += 15;

        doc.text("Tax (GST 5%):", summaryX, y);
        doc.text(`₹${calculations.taxAmount.toFixed(2)}`, valX, y);
        y += 20;

        doc.rect(summaryX - 10, y - 5, 200, 25).fill("#444444");
        doc.fill("#FFFFFF");
        doc.font("NotoBold").fontSize(12);
        doc.text("Grand Total:", summaryX, y + 5);
        doc.text(`₹${calculations.grandTotal.toFixed(2)}`, valX, y + 5);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const invoiceService = new InvoiceService();
