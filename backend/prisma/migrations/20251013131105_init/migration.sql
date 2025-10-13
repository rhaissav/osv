-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "UniqueID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UniqueID")
);

-- CreateTable
CREATE TABLE "Project" (
    "UniqueID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("UniqueID")
);

-- CreateTable
CREATE TABLE "_UserProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "_UserProjects"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("UniqueID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("UniqueID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("UniqueID") ON DELETE CASCADE ON UPDATE CASCADE;
