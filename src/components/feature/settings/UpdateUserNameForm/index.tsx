"use client";

import { updateUserName } from "@/app/actions/userActions";
import { UserIcon } from "@/components/model/user/UserIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/lib/useServerAction";
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
      action: () => updateUserName({ name }),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <UserIcon userImage={currentUser.image} size="md" />
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
        <Button type="submit" disabled={isPending || name === currentUser.name}>
          {isPending ? "更新中..." : "更新"}
        </Button>
      </div>
    </form>
  );
}
