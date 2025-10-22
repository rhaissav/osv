/*
  Warnings:

  - A unique constraint covering the columns `[passwordRecoveryToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordRecoveryToken" TEXT,
ADD COLUMN     "passwordRecoveryTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordRecoveryToken_key" ON "User"("passwordRecoveryToken");
