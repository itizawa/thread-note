"use client";

import { urls } from "@/shared/consts/urls";
import { Skeleton } from "@/shared/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ThreadInformation } from "../ThreadInformation";

export function ExportThread({ threadId }: { threadId: string }) {
  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Link
              href={urls.dashboardThreadDetails(threadId)}
              className="flex space-x-1 items-center text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">記事編集に戻る</span>
            </Link>
            <Skeleton className="w-full h-9" />
          </div>
        }
      >
        <ThreadInformation threadId={threadId} />
      </Suspense>
    </div>
  );
}
