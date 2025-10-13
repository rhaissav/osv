/*
  Warnings:

  - You are about to drop the column `author_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_author_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "author_id";
