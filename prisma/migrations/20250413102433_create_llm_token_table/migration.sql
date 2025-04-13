-- CreateTable
CREATE TABLE "LLMTokenUsage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LLMTokenUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LLMTokenUsage_user_id_created_at_idx" ON "LLMTokenUsage"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "LLMTokenUsage" ADD CONSTRAINT "LLMTokenUsage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
