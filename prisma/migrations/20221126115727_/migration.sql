/*
  Warnings:

  - Added the required column `active` to the `ChainType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChainType" ADD COLUMN     "active" BOOLEAN NOT NULL;
