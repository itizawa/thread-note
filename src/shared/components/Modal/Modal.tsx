import { CloseOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import { Dialog, SxProps, Theme } from "@mui/material";
import { ref } from "process";
import { ComponentProps } from "react";
import { Box } from "../Box";
import { IconButton } from "../IconButton";
import { Tooltip } from "../Tooltip";
import { Typography } from "../Typography";
import {
  DefaultButtons,
  DefaultButtonsProps,
} from "./modalActions/DefaultButtons";
import {
  WithSubButtons,
  WithSubButtonsProps,
} from "./modalActions/WithSubButtons";

type Props = {
  onClose: () => void;
  title: string;
  titleHelpText?: string;
  actions?: DefaultButtonsProps | WithSubButtonsProps;
  sx?: SxProps<Theme>;
  disableCloseButton?: boolean;
  fullHeight?: boolean;
} & ComponentProps<typeof Dialog>;

export const Modal = ({
  onClose,
  title,
  titleHelpText,
  children,
  actions,
  sx,
  disableCloseButton,
  fullHeight,
  ...props
}: Props) => {
  return (
    <Dialog
      ref={ref}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          padding: { xs: "24px", sm: "40px" },
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          height: fullHeight ? "100%" : "auto",
        },
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(10px)",
        },
        ...sx,
      }}
      {...props}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
      >
        <Box display="flex" alignItems="center" gap="8px">
          <Typography variant="h4" bold>
            {title}
          </Typography>
          {titleHelpText && (
            <Tooltip content={titleHelpText}>
              <HelpOutlineOutlined fontSize="small" />
            </Tooltip>
          )}
        </Box>
        {disableCloseButton ? (
          <div></div>
        ) : (
          <IconButton size="small" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        )}
      </Box>

      <Box sx={{ overflowY: "auto", height: "100%" }}>{children}</Box>

      {actions?.type === "default" && <DefaultButtons {...actions} />}
      {actions?.type === "withSubButton" && <WithSubButtons {...actions} />}
    </Dialog>
  );
};
