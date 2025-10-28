/* eslint-disable no-restricted-imports */
import {
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
} from "@mui/material";

export const Skeleton = ({ sx, ...props }: MuiSkeletonProps) => {
  return <MuiSkeleton {...props} sx={{ ...sx }} />;
};
