-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'EM_ANDAMENTO';
