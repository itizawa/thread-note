import { Avator } from "@/shared/components/Avator";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { trpc } from "@/trpc/server";
import { use } from "react";

export const WorkSpaceSidebar = () => {
  const workSpaces = use(trpc.workSpace.listWorkSpaces());
  const currentUser = use(trpc.user.getCurrentUser());

  return (
    <Stack
      bgcolor="primary.main"
      px="16px"
      pt="16px"
      rowGap="16px"
      height="100%"
    >
      {currentUser?.image && (
        <Avator
          src={currentUser.image}
          variant="rounded"
          sx={{ bgcolor: "Background", width: 36, height: 36 }}
        />
      )}
      {workSpaces.map((workSpace) => (
        <Avator
          key={workSpace.id}
          src={workSpace.image || undefined}
          alt={workSpace.name}
          variant="rounded"
          sx={{ bgcolor: "Background", width: 36, height: 36 }}
        >
          <Typography variant="body2" color="textPrimary">
            {workSpace.name[0]}
          </Typography>
        </Avator>
      ))}
    </Stack>
  );
};
