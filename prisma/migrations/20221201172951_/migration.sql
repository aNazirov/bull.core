/*
  Warnings:

  - Changed the type of `size` on the `BannerType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BannerSize" AS ENUM ('size_1600x200', 'size_728x90', 'size_1200x150', 'size_160x600', 'size_150x150');

-- AlterTable
ALTER TABLE "BannerType" DROP COLUMN "size",
ADD COLUMN     "size" "BannerSize" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "m_operation_id" TEXT,
ADD COLUMN     "m_operation_pay_date" TIMESTAMP(3),
ADD COLUMN     "m_operation_ps" TEXT;
