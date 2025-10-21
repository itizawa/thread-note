import { ReactNode } from "react";
import { Box } from "../../Box";
import { Button } from "../../Button";

export type WithSubButtonsProps = {
  type: "withSubButton";
  cancel: {
    text: string | ReactNode;
    color: "primary" | "secondary" | "error";
    onClick: () => void;
    disabled?: boolean;
  };
  confirm: {
    text: string | ReactNode;
    color: "primary" | "secondary" | "error";
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  sub: {
    text: string | ReactNode;
    color: "primary" | "secondary" | "error";
    onClick: () => void;
  };
};
export const WithSubButtons = ({
  cancel,
  confirm,
  sub,
}: WithSubButtonsProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        onClick={sub.onClick}
        color={sub.color}
        variant="outlined"
        size="large"
      >
        {sub.text}
      </Button>
      <Box sx={{ display: "flex", justifyContent: "right", gap: "16px" }}>
        <Button
          onClick={cancel.onClick}
          color={cancel.color}
          variant="outlined"
          size="large"
          sx={{ width: "240px" }}
          disabled={cancel.disabled}
        >
          {cancel.text}
        </Button>
        <Button
          onClick={confirm.onClick}
          color={confirm.color}
          variant="contained"
          size="large"
          sx={{ width: "240px" }}
          disabled={confirm.disabled}
          loading={confirm.loading}
        >
          {confirm.text}
        </Button>
      </Box>
    </Box>
  );
};
