import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const HeroSectionLayout = ({ children }: Props) => {
  return (
    <Stack rowGap="16px" mx="auto" textAlign="center">
      <Typography variant="h3" bold>
        手軽に情報を残す
        <br />
        スレッド形式のメモサービス
      </Typography>
      {children}
    </Stack>
  );
};
