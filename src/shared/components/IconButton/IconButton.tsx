/* eslint-disable no-restricted-imports */
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from "@mui/material";

export type IconButtonProps = MuiIconButtonProps & {
  isCircle?: boolean;
};

export const IconButton = ({ sx, ...props }: IconButtonProps) => {
  return (
    <MuiIconButton
      sx={{
        ...(props.isCircle
          ? {
              borderRadius: "50%",
              ".MuiTouchRipple-root": { borderRadius: "50%" },
            }
          : {
              borderRadius: "4px",
              ".MuiTouchRipple-root": { borderRadius: "4px" },
            }),
        ...(props.size === "small" && {
          padding: "6px",
        }),
        ...sx,
      }}
      {...props}
    />
  );
};
