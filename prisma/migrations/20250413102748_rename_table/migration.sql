/*
  Warnings:

  - You are about to drop the `LLMTokenUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LLMTokenUsage" DROP CONSTRAINT "LLMTokenUsage_user_id_fkey";

-- DropTable
DROP TABLE "LLMTokenUsage";

-- CreateTable
CREATE TABLE "llm_token_usages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_token_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "llm_token_usages_user_id_created_at_idx" ON "llm_token_usages"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "llm_token_usages" ADD CONSTRAINT "llm_token_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
