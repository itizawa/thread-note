-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('WIP', 'CLOSED');

-- AlterTable
ALTER TABLE "threads" ADD COLUMN "status" "ThreadStatus" DEFAULT 'WIP';

-- Update existing records to set status based on is_closed
UPDATE "threads" SET "status" = CASE WHEN "is_closed" = true THEN 'CLOSED'::"ThreadStatus" ELSE 'WIP'::"ThreadStatus" END;

-- DropColumn
ALTER TABLE "threads" DROP COLUMN "is_closed";