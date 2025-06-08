"use client";

import { ThreadStatus } from "@prisma/client";

interface ThreadStatusBadgeProps {
  status: ThreadStatus;
}

const statusColorMap = {
  WIP: "bg-green-700 text-white",
  CLOSED: "bg-purple-800 text-white",
} satisfies Record<ThreadStatus, string>;

export function ThreadStatusBadge({ status }: ThreadStatusBadgeProps) {
  return (
    <span
      className={`text-xs font-bold px-4 py-1 rounded-full ${statusColorMap[status]}`}
    >
      {status}
    </span>
  );
}
