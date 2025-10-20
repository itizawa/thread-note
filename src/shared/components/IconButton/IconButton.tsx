/* eslint-disable no-restricted-imports */
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from "@mui/material";

export type IconButtonProps = MuiIconButtonProps & {
  isCircle?: boolean;
};

export const IconButton = ({
  sx,
  isCircle = false,
  ...props
}: IconButtonProps) => {
  return (
    <MuiIconButton
      sx={{
        ...(isCircle
          ? {
              borderRadius: "50%",
              ".MuiTouchRipple-root": { borderRadius: "50%" },
            }
          : {
              borderRadius: "4px",
              ".MuiTouchRipple-root": { borderRadius: "4px" },
            }),
        ...(props.size === "small" && {
          padding: "4px",
          ".MuiSvgIcon-root": { fontSize: "20px" },
        }),
        ...sx,
      }}
      {...props}
    />
  );
};
