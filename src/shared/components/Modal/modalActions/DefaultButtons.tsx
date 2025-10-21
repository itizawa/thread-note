import { ReactNode } from "react";

import { Button } from "../../Button";
import { Stack } from "../../Stack";

export type DefaultButtonsProps = {
  type: "default";
  cancel: {
    text: string | ReactNode;
    color: "primary" | "secondary" | "error" | "gray";
    onClick: () => void;
    disabled?: boolean;
  };
  submit: {
    text: string | ReactNode;
    color: "primary" | "secondary" | "error" | "gray";
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  align: "left" | "center" | "right";
};

export const DefaultButtons = ({
  cancel,
  submit,
  align = "right",
}: DefaultButtonsProps) => {
  return (
    <Stack
      sx={{
        flexDirection: { xs: "column-reverse", sm: "row" },
        display: "flex",
        justifyContent: align,
        gap: "16px",
      }}
    >
      <Button
        onClick={cancel.onClick}
        color={cancel.color}
        variant="outlined"
        size="large"
        fullWidth
        disabled={cancel.disabled}
      >
        {cancel.text}
      </Button>
      <Button
        onClick={submit.onClick}
        color={submit.color}
        variant="contained"
        size="large"
        fullWidth
        disabled={submit.disabled}
        loading={submit.loading}
      >
        {submit.text}
      </Button>
    </Stack>
  );
};
