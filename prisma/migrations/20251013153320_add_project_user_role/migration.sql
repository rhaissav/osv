-- CreateEnum
CREATE TYPE "ProjectUserRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "UserProjects" ADD COLUMN     "role" "ProjectUserRole" NOT NULL DEFAULT 'MEMBER';
