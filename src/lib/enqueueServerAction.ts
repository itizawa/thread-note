"use client";

import { toast } from "sonner";

type Response<T> =
  | {
      data: T;
      isOk: true;
    }
  | {
      isOk: false;
    };

export async function enqueueServerAction<T>({
  action,
  errorText,
}: {
  action: () => Promise<T>;
  errorText?: string;
}): Promise<Response<T>> {
  try {
    const result = await action();

    return { data: result, isOk: true };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    toast.error(errorText || "エラーが発生しました");
    return { isOk: false };
  }
}
