/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `plan_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "plan_subscriptions_user_id_key" ON "plan_subscriptions"("user_id");
