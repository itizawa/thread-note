"use client";

import {
  changeToArchive,
  changeToUnArchive,
  updatePostBody,
} from "@/app/actions/postActions";
import { PostForm } from "@/entities/post/PostForm";
import { UserIcon } from "@/entities/user/UserIcon";
import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button/Button";
import { IconButton } from "@/shared/components/IconButton";
import { Stack } from "@/shared/components/Stack";
import { Tooltip } from "@/shared/components/Tooltip";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { useClipBoardCopy } from "@/shared/hooks/useClipBoardCopy";
import { isMacOs, isWindowsOs } from "@/shared/lib/getOs";
import { useServerAction } from "@/shared/lib/useServerAction";
import { MarkdownViewer } from "@/shared/ui/MarkdownViewer/index";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { ReplyOutlined } from "@mui/icons-material";
import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useState } from "react";
import { toast } from "sonner";
import urlJoin from "url-join";
import { ManagePostDropDown } from "./ManagePostDropDown";

type Post = NonNullable<
  inferRouterOutputs<AppRouter>["thread"]["getThreadWithPosts"]["threadWithPosts"]
>["posts"][number];

interface Props {
  post: Post | Post["children"][number];
  isPublicThread: boolean;
}

export function PostPaper({ post, isPublicThread }: Props) {
  const isParentPost = "children" in post;
  const { isPending, enqueueServerAction } = useServerAction();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = post;
  const [body, setBody] = React.useState(post.body);
  const isDisabled = isPending || body.length === 0;
  const utils = trpc.useUtils();
  const { copy } = useClipBoardCopy();
  const router = useRouter();
  const handleSubmit = () => {
    enqueueServerAction({
      action: () => updatePostBody({ id: post.id, body }),
      error: {
        text: "更新に失敗しました",
      },
      success: {
        onSuccess: () => {
          setIsEditing(false);
          utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
        },
      },
    });
  };

  const handleContentChange = (value: string) => setBody(value);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (isDisabled) return;

    if (isMacOs() && e.key === "Enter" && e.metaKey) {
      handleSubmit();
    }
    if (isWindowsOs() && e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleClickUnArchiveButton = async () => {
    startTransition(async () => {
      await changeToUnArchive({ id: post.id });
      utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
      toast.success("削除を取り消しました");
    });
  };

  const handleClickArchiveButton = async () => {
    startTransition(async () => {
      await changeToArchive({ id: post.id });
      utils.thread.getThreadWithPosts.invalidate({ id: post.threadId });
      toast.success("削除しました", {
        action: (
          <Button
            size="small"
            sx={{ ml: "auto" }}
            variant="outlined"
            color="error"
            onClick={handleClickUnArchiveButton}
          >
            取り消す
          </Button>
        ),
      });
    });
  };

  const handleClickPostCreatedAt = () => {
    copy(
      urlJoin(
        window.location.origin,
        urls.threadDetails(post.threadId, post.id)
      ),
      "共有URLをコピーしました"
    );
  };

  const handleClickReplyButton = () => {
    router.push(urls.dashboardThreadDetails(post.threadId, post.id));
  };

  return (
    <Box
      sx={{
        p: "8px 16px",
        ":hover": {
          backgroundColor: "grey.200",
          "& .icon-button-group": { opacity: 1 },
        },
        "& .icon-button-group": { opacity: { xs: 1, md: 0 } },
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Box display="flex" alignItems="start" gap="8px">
        <Link href={urls.userDetails(user.id)} className="hover:opacity-60">
          <UserIcon userImage={user?.image} size={9} />
        </Link>
        <Stack flex={1} minWidth={0}>
          {isEditing ? (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px",
                p: "16px",
                bgcolor: "background.paper",
              }}
            >
              <PostForm
                textarea={{
                  value: body,
                  onChange: handleContentChange,
                  onKeyPress: handleKeyPress,
                  forceFocus: false,
                }}
                formState={{
                  isDisabled,
                  isPending,
                }}
                bottomButtons={{
                  submitText: "更新",
                  onCancel: () => {
                    setBody(post.body); // 初期化
                    setIsEditing(false);
                  },
                  onSubmit: handleSubmit,
                }}
              />
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                gap="8px"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap="8px">
                  <Box display="flex" alignItems="center" gap="8px">
                    <Link
                      href={urls.userDetails(user.id)}
                      className="hover:opacity-60"
                    >
                      <Typography variant="body2" bold>
                        {user.name}
                      </Typography>
                    </Link>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(post.createdAt), "yyyy/MM/dd HH:mm")}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  className="icon-button-group"
                >
                  {!isEditing && isParentPost && (
                    <Tooltip content="返信">
                      <IconButton
                        size="small"
                        onClick={handleClickReplyButton}
                        disabled={isPending}
                      >
                        <ReplyOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!isEditing && !post.isArchived && (
                    <ManagePostDropDown
                      isPending={isPending}
                      onClickEditButton={() => setIsEditing(true)}
                      onClickShareButton={
                        isPublicThread ? handleClickPostCreatedAt : undefined
                      }
                      onClickArchiveButton={handleClickArchiveButton}
                    />
                  )}
                </Box>
              </Box>

              <Stack
                rowGap="8px"
                sx={{ wordBreak: "break-word", width: "100%" }}
              >
                <MarkdownViewer body={post.body} />
              </Stack>
              {isParentPost && !isEditing && post.children.length > 0 && (
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  sx={{ width: "fit-content" }}
                  onClick={() =>
                    router.push(
                      urls.dashboardThreadDetails(post.threadId, post.id)
                    )
                  }
                >
                  {post.children.length}件の返信があります
                </Button>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
