/*
  Warnings:

  - Made the column `status` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "status" SET NOT NULL;

-- CreateTable
CREATE TABLE "work_space" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_space_slug_key" ON "work_space"("slug");

-- AddForeignKey
ALTER TABLE "work_space" ADD CONSTRAINT "work_space_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
