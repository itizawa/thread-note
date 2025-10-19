import { Theme } from "@emotion/react";
import {
  Typography as MuiTypography,
  SxProps,
  TypographyProps,
} from "@mui/material";
import React, { ComponentProps, forwardRef } from "react";

export type CustomVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body1"
  | "body2"
  | "button"
  | "caption"
  | "overline";

type Props = {
  variant?: CustomVariant;
  color?: ComponentProps<typeof MuiTypography>["color"];
  children?: React.ReactNode;
  whiteSpace?: "normal" | "nowrap" | "pre-wrap";
  bold?: boolean;
  sx?: SxProps<Theme>;
  component?: TypographyProps["component"];
};

const _Typography = (
  {
    bold,
    sx,
    children,
    whiteSpace,
    color = "textPrimary",
    variant = "body2",
    ...rest
  }: Props,
  ref: React.ForwardedRef<HTMLSpanElement>
) => {
  return (
    <MuiTypography
      {...rest}
      color={color}
      variant={variant}
      ref={ref}
      sx={{
        ...(bold && { fontWeight: "bold" }),
        whiteSpace,
        ...sx,
      }}
    >
      {children}
    </MuiTypography>
  );
};

export const Typography = forwardRef<HTMLSpanElement, Props>(_Typography);
