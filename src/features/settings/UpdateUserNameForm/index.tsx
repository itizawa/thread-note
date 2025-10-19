"use client";

import { updateUserSettings } from "@/app/actions/userActions";
import { UserIcon } from "@/entities/user/UserIcon";
import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { WithLabel } from "@/shared/components/WithLabel";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Tooltip } from "@/shared/ui/Tooltip";
import { UploadImageWrapper } from "@/shared/ui/UploadImageWrapper";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { trpc } from "@/trpc/client";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateUserNameFormProps {
  currentUser: User;
}

export function UpdateUserNameForm({ currentUser }: UpdateUserNameFormProps) {
  const utils = trpc.useUtils();
  const [name, setName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.description || "");
  const { isPending, enqueueServerAction } = useServerAction();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("名前を入力してください");
      return;
    }

    if (description.length > 240) {
      toast.error("自己紹介は240文字以内で入力してください");
      return;
    }

    enqueueServerAction({
      action: () => updateUserSettings({ name, description }),
      error: {
        text: "プロフィールの更新に失敗しました",
      },
      success: {
        onSuccess: () => utils.user.getCurrentUser.invalidate(),
        text: "プロフィールを更新しました",
      },
    });
  };

  return (
    <Stack
      rowGap="24px"
      p={{ xs: 2, md: 6 }}
      className="bg-white rounded-lg shadow-sm"
    >
      <Typography variant="h3" bold>
        基本設定
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          gap: "24px",
          alignItems: { xs: "center", md: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <UploadImageWrapper
          onSuccess={(data) => {
            toast.success("プロフィール画像をアップロードしました");
            // ユーザー画像を更新
            enqueueServerAction({
              action: () => updateUserSettings({ image: data.url }),
              error: {
                text: "プロフィール画像の更新に失敗しました",
              },
              success: {
                onSuccess: () => utils.user.getCurrentUser.invalidate(),
                text: "プロフィール画像を更新しました",
              },
            });
          }}
        >
          {({ startSelect, isUploading }) => (
            <Tooltip content="プロフィール画像を変更">
              <div className="relative h-20 w-20">
                <UserIcon
                  userImage={currentUser.image}
                  size={20}
                  onClick={startSelect}
                  className={`${
                    isUploading ? "opacity-50" : ""
                  } hover:opacity-80 transition-opacity`}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-20 w-20 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
            </Tooltip>
          )}
        </UploadImageWrapper>
        <Stack rowGap="24px" flex={1} width="100%">
          <WithLabel label="名前">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力してください"
            />
          </WithLabel>
          <WithLabel label="自己紹介">
            <Textarea
              rows={5}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="自己紹介を入力してください"
            />
          </WithLabel>
          <Box display="flex" justifyContent="center">
            <Button
              onClick={handleSubmit}
              loading={isPending}
              disabled={
                name === currentUser.name &&
                description === currentUser.description
              }
            >
              更新
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
