"use client";

import { urls } from "@/shared/consts/urls";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Skeleton } from "@/shared/ui/skeleton";
import { Suspense } from "react";
import { ThreadInformation } from "../ThreadInformation";

export function ExportThread({ threadId }: { threadId: string }) {
  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div className="space-y-4">
            <LinkToBack
              href={urls.dashboardThreadDetails(threadId)}
              text="編集に戻る"
            />
            <Skeleton className="w-full h-9" />
          </div>
        }
      >
        <ThreadInformation threadId={threadId} />
      </Suspense>
    </div>
  );
}
