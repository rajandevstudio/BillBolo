/*
  Warnings:

  - You are about to alter the column `items` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "items" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Invoice" ("createdAt", "customerName", "customerPhone", "id", "invoiceNumber", "items", "status", "totalAmount", "userId") SELECT "createdAt", "customerName", "customerPhone", "id", "invoiceNumber", "items", "status", "totalAmount", "userId" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
