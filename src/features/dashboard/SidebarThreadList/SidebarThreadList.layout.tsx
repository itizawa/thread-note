import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import type { ReactNode } from "react";

type SidebarThreadListLayoutProps = {
  children: ReactNode;
};

export const SidebarThreadListLayout = ({
  children,
}: SidebarThreadListLayoutProps) => {
  return (
    <Stack flex={1} minHeight="0" sx={{ overflowY: "auto" }}>
      <Stack p="8px">
        <Typography variant="body2" bold>
          スレッド一覧
        </Typography>
      </Stack>
      <Stack flex={1} minHeight="0" sx={{ overflowY: "auto" }}>
        {children}
      </Stack>
    </Stack>
  );
};
