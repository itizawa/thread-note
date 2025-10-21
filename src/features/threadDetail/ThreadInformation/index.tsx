"use client";

import { PublicStatusSheet } from "@/features/threadDetail/PublicStatusSheet";
import { ThreadStatusBadge } from "@/features/threadDetail/ThreadStatusBadge";
import { ThreadTitleEditModal } from "@/features/threadDetail/ThreadTitleEditModal";
import { Box } from "@/shared/components/Box";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { Tooltip } from "@/shared/components/Tooltip";
import { Typography } from "@/shared/components/Typography";
import { trpc } from "@/trpc/client";
import { EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import { ManageThreadDropDown } from "./ManageThreadDropDown";

export function ThreadInformation({
  threadId,
  includeIsArchived,
  toggleIncludeIsArchived,
}: {
  threadId: string;
  includeIsArchived: boolean;
  toggleIncludeIsArchived: () => void;
}) {
  const [threadInfo] = trpc.thread.getThreadInfo.useSuspenseQuery({
    id: threadId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!threadInfo) {
    return (
      <Stack rowGap="16px">
        <p>ポストが存在しません</p>
      </Stack>
    );
  }

  return (
    <>
      <Stack rowGap="8px">
        <div className="flex items-center justify-between">
          <Typography variant="body1" bold>
            {threadInfo.title || "タイトルなし"}
          </Typography>
          <Tooltip content="編集">
            <IconButton size="small" onClick={() => setIsModalOpen(true)}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </div>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
        >
          <Box display="flex" alignItems="center" gap="8px">
            <PublicStatusSheet
              threadTitle={threadInfo.title}
              threadId={threadId}
              isPublic={threadInfo.isPublic}
              ogpTitle={threadInfo.ogpTitle}
              ogpDescription={threadInfo.ogpDescription}
              ogpImagePath={threadInfo.ogpImagePath}
            />
            <ThreadStatusBadge status={threadInfo.status || "WIP"} />
          </Box>
          <ManageThreadDropDown
            threadId={threadId}
            threadTitle={threadInfo.title}
            includeIsArchived={includeIsArchived}
            onClickToggleDisplayArchiveButton={toggleIncludeIsArchived}
            status={threadInfo.status || "WIP"}
          />
        </Box>
      </Stack>

      <ThreadTitleEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        threadId={threadId}
        currentTitle={threadInfo.title || ""}
      />
    </>
  );
}
