/*
  Warnings:

  - You are about to drop the `_UserProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserProjects" DROP CONSTRAINT "_UserProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserProjects" DROP CONSTRAINT "_UserProjects_B_fkey";

-- DropTable
DROP TABLE "public"."_UserProjects";

-- CreateTable
CREATE TABLE "UserProjects" (
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("user_id","project_id")
);

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("UniqueID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("UniqueID") ON DELETE RESTRICT ON UPDATE CASCADE;
