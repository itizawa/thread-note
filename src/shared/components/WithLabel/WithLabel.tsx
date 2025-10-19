"use client";

import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { ReactNode } from "react";

type LinkToBackProps = {
  children: ReactNode;
  label: ReactNode;
};

export function WithLabel({ children, label }: LinkToBackProps) {
  return (
    <Stack rowGap="8px">
      <Typography variant="body2">{label}</Typography>
      {children}
    </Stack>
  );
}
