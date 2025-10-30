import { Typography } from "@/shared/components/Typography";
import { trpc } from "@/trpc/server";
import { use } from "react";

export const ThreadCountSection = () => {
  const threadCount = use(trpc.thread.countThreads());

  return (
    <Typography variant="body1" bold color="textSecondary">
      累計 {threadCount} 個のスレッドが作成されました!
    </Typography>
  );
};
