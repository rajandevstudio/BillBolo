'use client'

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { formatINR } from "./TableUtils";
import { Invoice } from "@/types";
import { generateInvoicePDF } from "../pdfviewer";



export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    if (openRow) {
      const inv = invoices.find((i) => i.id === openRow);
      if (inv && !inv.pdfUrl) {
        const doc = generateInvoicePDF(inv);
        url = doc.output("bloburl").toString();
        setGeneratedPdfUrl(url);
      } else {
        setGeneratedPdfUrl(null);
      }
    } else {
      setGeneratedPdfUrl(null);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [openRow, invoices]);

  const toggleRow = (id: string) => {
    setOpenRow(openRow === id ? null : id);
  };

  const handleDownload = (inv: Invoice) => {
    if (inv.pdfUrl) {
      const link = document.createElement("a");
      link.href = inv.pdfUrl;
      link.download = `invoice-${inv.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const doc = generateInvoicePDF(inv);
      doc.save(`invoice-${inv.invoiceNumber}.pdf`);
    }
  };

  return (
    <Card className="rounded-2xl shadow border overflow-hidden">
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4" />
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {invoices.map((inv) => (
                <React.Fragment key={inv.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleRow(inv.id)}>
                        {openRow === inv.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 font-mono">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">{inv.customerName}</td>
                    <td className="px-6 py-4">
                      {inv.createdAt.toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold">
                      {formatINR(inv.totalAmount || 0)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleRow(inv.id)}>
                          <FileText className="mr-2" size={16} />
                          {openRow === inv.id ? "Close" : "Preview"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)}>
                          <Download size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {openRow === inv.id && inv.items && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-10 py-6">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-4 text-gray-700">Items</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {inv.items.map((it, i) => (
                                  <div
                                    key={i}
                                    className="bg-white border rounded-xl p-4"
                                  >
                                    <div className="text-sm text-gray-500 mb-1">
                                      {it.desc}
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">
                                      QTY: {it.qty} | Rate: {formatINR(it.rate)}
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                      {formatINR(it.rate * it.qty)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="w-full lg:w-[400px]">
                              <h4 className="font-semibold mb-4 text-gray-700">Preview</h4>
                              <div className="bg-white border rounded-xl overflow-hidden h-[500px] shadow-sm">
                                {inv.pdfUrl || generatedPdfUrl ? (
                                  <iframe
                                    src={inv.pdfUrl || generatedPdfUrl!}
                                    className="w-full h-full"
                                    title="Invoice Preview"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400">
                                    Generating preview...
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="border rounded-2xl p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-mono text-sm">{inv.invoiceNumber}</div>
                  <div className="text-xs text-gray-500">
                    {inv.customerName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {formatINR(inv.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {inv.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    if (inv.pdfUrl) window.open(inv.pdfUrl, "_blank");
                    else {
                      const doc = generateInvoicePDF(inv);
                      window.open(doc.output("bloburl"), "_blank");
                    }
                  }}
                >
                  View PDF
                </Button>

                <Button className="flex-1" variant="secondary" onClick={() => handleDownload(inv)}>
                  Download
                </Button>
              </div>

              {inv.items && (
                <div className="mt-4 border-t pt-3 space-y-2">
                  {inv.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{it.desc}</span>
                      <span className="font-medium">
                        {formatINR(it.rate * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}