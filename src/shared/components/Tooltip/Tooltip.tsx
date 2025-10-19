"use client";

/* eslint-disable no-restricted-imports */
import { Tooltip as MuiTooltip, type TooltipProps } from "@mui/material";
import * as React from "react";

import { getIsMobile } from "@/shared/lib/useIsMobile";

export function Tooltip({
  children,
  content,
  ...props
}: {
  children: React.ReactElement;
  content: React.ReactNode;
} & Omit<TooltipProps, "title" | "children">) {
  // スマホならTooltipを表示しない
  if (getIsMobile()) return children;

  return (
    <MuiTooltip
      title={content}
      arrow
      enterDelay={200}
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "black",
            color: "white",
            p: "4px 8px",
            minWidth: "68px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "0.75rem",
            borderRadius: "4px",
          },
        },
        arrow: { sx: { color: "black" } },
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}
