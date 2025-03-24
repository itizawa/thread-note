"use client";

import { updateUserSettings } from "@/app/actions/userActions";
import { UserIcon } from "@/entities/user/UserIcon";
import { useServerAction } from "@/shared/lib/useServerAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Tooltip } from "@/shared/ui/Tooltip";
import { UploadImageWrapper } from "@/shared/ui/UploadImageWrapper";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">基本設定</h2>
      <form
        onSubmit={handleSubmit}
        className="flex md:flex-row flex-col gap-6 items-center md:items-start content-center"
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
        <div className="space-y-4 w-full">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                名前
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力してください"
              />
            </div>
          </div>
          <div className="flex-1">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              自己紹介
            </label>
            <Textarea
              rows={5}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="自己紹介を入力してください"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full md:w-auto"
              loading={isPending}
              disabled={
                name === currentUser.name &&
                description === currentUser.description
              }
            >
              更新
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
