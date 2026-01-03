-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
