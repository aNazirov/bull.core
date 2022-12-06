-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Banner_userId_idx" ON "Banner" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "Chain_userId_idx" ON "Chain" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "Context_userId_idx" ON "Context" USING HASH ("userId");
