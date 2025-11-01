import { Stack } from "@/shared/components/Stack";
import { ReactNode } from "react";

type WorkSpaceSidebarLayoutProps = {
  userSection: ReactNode;
  workSpaceListSection: ReactNode;
};

export const WorkSpaceSidebarLayout = ({
  userSection,
  workSpaceListSection,
}: WorkSpaceSidebarLayoutProps) => {
  return (
    <Stack
      bgcolor="primary.main"
      px="16px"
      pt="16px"
      rowGap="16px"
      height="100%"
    >
      {userSection}
      {workSpaceListSection}
    </Stack>
  );
};