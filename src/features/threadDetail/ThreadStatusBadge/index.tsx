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
        return "bg-purple-800 text-white";
      default:
        return "";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
}
