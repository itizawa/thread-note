/* eslint-disable no-restricted-imports */
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { ref } from "process";

// NOTE: 必要に応じてPickを追加する
export type ButtonProps = Pick<
  MuiButtonProps,
  | "color"
  | "variant"
  | "size"
  | "disabled"
  | "startIcon"
  | "children"
  | "loading"
>;

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
      {...props}
    >
      {children}
    </MuiButton>
  );
};
