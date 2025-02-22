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
  successText,
}: {
  action: () => Promise<T>;
  errorText?: string;
  successText?: string;
}): Promise<Response<T>> {
  try {
    const result = await action();

    if (successText) toast.success(successText);

    return { data: result, isOk: true };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    toast.error(errorText || "エラーが発生しました");
    return { isOk: false };
  }
}
