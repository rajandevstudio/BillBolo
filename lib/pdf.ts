
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { ExtractedInvoice } from './gemini'; // Reusing your AI interface
import { CalculatedInvoice } from './calculations'; // Reusing your calculation interface

/**
 * Generates a professional PDF invoice and returns the file path.
 */
export async function generateInvoicePDF(
  data: ExtractedInvoice, 
  calculationData: CalculatedInvoice
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const pdfPath = path.join(process.cwd(), 'invoice.pdf');
      const writeStream = fs.createWriteStream(pdfPath);

      doc.pipe(writeStream);

      // -- FONTS --
      // Using Noto Sans for Hindi support since you're in Rajasthan!
      const regularFont = path.join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf');
      const boldFont = path.join(process.cwd(), 'public/fonts/NotoSans-Bold.ttf');
      
      doc.registerFont('Noto', regularFont);
      doc.registerFont('NotoBold', boldFont);

      // -- HEADER --
      doc.font('NotoBold').fontSize(24).text(data.shop_name, { align: 'left' });
      doc.font('Noto').fontSize(10).text("Shahjahanpur, Alwar, Rajasthan - 301706", { align: 'left' });
      
      doc.moveUp(3);
      doc.font('NotoBold').fontSize(20).fillColor('#444444').text('INVOICE', { align: 'right' });
      doc.fillColor('#000000').font('Noto').fontSize(10).text(`# ${calculationData.invoiceNum}`, { align: 'right' });
      doc.text(`Date: ${calculationData.dateStr}`, { align: 'right' });

      doc.moveDown(2);

      // -- BILL TO --
      doc.rect(50, 130, 200, 60).fill('#f5f5f5');
      doc.fill('#000000');
      doc.font('NotoBold').fontSize(10).text('BILL TO:', 60, 140);
      doc.font('Noto').fontSize(12).text(data.customer_name, 60, 155);
      doc.fontSize(10).text('Customer via WhatsApp', 60, 175);

      // -- TABLE HEADER --
      const tableTop = 220;
      doc.rect(50, tableTop, 500, 25).fill('#eeeeee');
      doc.fill('#000000');
      doc.font('NotoBold').fontSize(10);
      doc.text('ITEM DESCRIPTION', 60, tableTop + 8);
      doc.text('QTY', 330, tableTop + 8);
      doc.text('RATE', 410, tableTop + 8);
      doc.text('AMOUNT', 490, tableTop + 8);

      // -- TABLE ROWS --
      let y = tableTop + 35;
      doc.font('Noto').fontSize(10);

      calculationData.items.forEach((item, i) => {
        // Zebra Striping
        if (i % 2 === 0) {
          doc.rect(50, y - 5, 500, 20).fill('#fcfcfc');
          doc.fill('#000000');
        }
        
        // Use 'description' as per our refined AI interface
        doc.text(item.description, 60, y);
        doc.text(item.qty.toString(), 330, y);
        doc.text(`₹${item.rate.toLocaleString('en-IN')}`, 410, y);
        doc.text(`₹${item.amount.toLocaleString('en-IN')}`, 490, y);
        y += 25;
      });

      // -- TOTALS --
      const summaryX = 350;
      const valX = 490;
      
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#cccccc').stroke();
      y += 15;

      doc.font('Noto');
      doc.text('Subtotal:', summaryX, y);
      doc.text(`₹${calculationData.subtotal.toFixed(2)}`, valX, y);
      y += 15;

      doc.text('Tax (GST 5%):', summaryX, y);
      doc.text(`₹${calculationData.taxAmount.toFixed(2)}`, valX, y);
      y += 20;

      // Final Grand Total Box
      doc.rect(summaryX - 10, y - 5, 200, 25).fill('#444444');
      doc.fill('#FFFFFF');
      doc.font('NotoBold').fontSize(12);
      doc.text('Grand Total:', summaryX, y + 5);
      doc.text(`₹${calculationData.grandTotal.toFixed(2)}`, valX, y + 5);

      doc.end();

      writeStream.on('finish', () => resolve(pdfPath));
      writeStream.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
}