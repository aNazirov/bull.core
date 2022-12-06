-- CreateEnum
CREATE TYPE "BannerComponent" AS ENUM ('header', 'sidebar', 'main', 'footer');

-- AlterTable
ALTER TABLE "BannerType" ADD COLUMN     "component" "BannerComponent";
