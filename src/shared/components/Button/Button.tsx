/* eslint-disable no-restricted-imports */
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { ref } from "process";

export type ButtonProps = MuiButtonProps;

/**
 * MUIのButtonコンポーネントをラップしたカスタムButtonコンポーネント
 *
 * @example
 * ```tsx
 * <Button variant="contained" color="primary">
 *   クリック
 * </Button>
 *
 * <Button variant="outlined" loading>
 *   送信中...
 * </Button>
 *
 * <Button variant="text" startIcon={<SaveIcon />}>
 *   保存
 * </Button>
 * ```
 */
export const Button = ({
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  children,
  startIcon,
  sx,
  ...props
}: ButtonProps) => {
  return (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled ?? loading}
      startIcon={loading ? undefined : startIcon}
      loading={loading}
      loadingPosition="start"
      sx={{
        fontWeight: "bold",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
