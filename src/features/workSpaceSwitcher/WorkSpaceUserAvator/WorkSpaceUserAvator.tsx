import { Avator } from "@/shared/components/Avator";
import { trpc } from "@/trpc/server";
import { use } from "react";

export const WorkSpaceUserAvator = () => {
  const currentUser = use(trpc.user.getCurrentUser());

  if (!currentUser?.image) return null;

  return (
    <Avator
      src={currentUser.image}
      variant="rounded"
      sx={{ bgcolor: "Background", width: 36, height: 36 }}
    />
  );
};
