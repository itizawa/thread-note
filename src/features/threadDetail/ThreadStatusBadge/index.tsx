"use client";

import { ThreadStatus } from "@prisma/client";

interface ThreadStatusBadgeProps {
  status: ThreadStatus;
}

export function ThreadStatusBadge({ status }: ThreadStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "WIP":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "WIP":
        return "進行中";
      case "CLOSED":
        return "終了";
      default:
        return "";
    }
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
}
