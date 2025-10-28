/* eslint-disable no-restricted-imports */
import {
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
} from "@mui/material";

export const Skeleton = (props: MuiSkeletonProps) => {
  return <MuiSkeleton {...props} />;
};
