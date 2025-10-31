import { Avator } from "@/shared/components/Avator";
import { Typography } from "@/shared/components/Typography";
import { trpc } from "@/trpc/server";
import { use } from "react";

export const WorkSpaceList = () => {
  const workSpaces = use(trpc.workSpace.listWorkSpaces());

  return (
    <>
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
    </>
  );
};
