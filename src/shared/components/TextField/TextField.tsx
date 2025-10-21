/* eslint-disable no-restricted-imports */
import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps,
} from "@mui/material";
import { ref } from "process";
import * as React from "react";

type InputProps = TextFieldProps & {
  forceFocus?: boolean;
  startIcon?: React.ReactNode;
};

/**
 * MUIのTextFieldコンポーネントをラップしたカスタムInputコンポーネント
 *
 * @example
 * ```tsx
 * <Input
 *   label="メールアドレス"
 *   type="email"
 *   placeholder="example@example.com"
 * />
 *
 * <Input
 *   label="パスワード"
 *   type="password"
 *   error
 *   helperText="パスワードが正しくありません"
 * />
 *
 * <Input
 *   label="ユーザー名"
 *   forceFocus
 *   size="small"
 * />
 * ```
 */
export const TextField = ({
  forceFocus,
  variant = "outlined",
  size = "small",
  sx,
  startIcon,
  ...props
}: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <MuiTextField
      variant={variant}
      size={size}
      inputRef={ref || inputRef}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start" sx={{ fontSize: "20px" }}>
              {startIcon}
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        "& .MuiInputBase-root": {
          fontSize: size === "small" ? "14px" : "16px",
        },
        ".MuiInputBase-input": {
          paddingY: "8px",
          paddingRight: "14px",
          height: "24px",
        },
        "& .MuiInputLabel-root": {
          fontSize: size === "small" ? "14px" : "16px",
        },
        "& .MuiFormHelperText-root": {
          fontSize: "12px",
        },
        ...sx,
      }}
      autoFocus={forceFocus}
      {...props}
    />
  );
};
