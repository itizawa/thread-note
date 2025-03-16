"use client";

import { updateUserSettings } from "@/app/actions/userActions";
import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/lib/useServerAction";
import { UploadImageWrapper } from "@/shared/components/UploadImageWrapper";
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
  const { isPending, enqueueServerAction } = useServerAction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("名前を入力してください");
      return;
    }

    enqueueServerAction({
      action: () => updateUserSettings({ name }),
      error: {
        text: "名前の更新に失敗しました",
      },
      success: {
        onSuccess: () => utils.user.getCurrentUser.invalidate(),
        text: "名前を更新しました",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">プロフィール設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
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
              <div className="relative h-8 w-8">
                <UserIcon
                  userImage={currentUser.image}
                  size="md"
                  onClick={startSelect}
                  className={`${
                    isUploading ? "opacity-50" : ""
                  } hover:opacity-80 transition-opacity`}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
            )}
          </UploadImageWrapper>
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
              className="max-w-md"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={isPending}
            disabled={name === currentUser.name}
          >
            更新
          </Button>
        </div>
      </form>
    </div>
  );
}
