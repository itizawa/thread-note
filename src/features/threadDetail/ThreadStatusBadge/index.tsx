"use client";

import { ThreadStatus } from "@prisma/client";

interface ThreadStatusBadgeProps {
  status: ThreadStatus;
  className?: string;
  size?: "sm" | "md";
}

const statusColorMap = {
  WIP: "bg-green-700 text-white",
  CLOSED: "bg-purple-800 text-white",
} satisfies Record<ThreadStatus, string>;

const sizeMap = {
  sm: "px-3 py-0.5 text-xs",
  md: "px-4 py-1 text-sm",
};

export function ThreadStatusBadge({
  status,
  size = "md",
}: ThreadStatusBadgeProps) {
  return (
    <span
      className={`font-bold ${sizeMap[size]} rounded-full ${statusColorMap[status]}`}
    >
      {status}
    </span>
  );
}
