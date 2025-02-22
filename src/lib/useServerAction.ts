"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type Args<T> = {
  action: () => Promise<T>;
  error: {
    text?: string;
    onError?: () => void;
  };
  success: {
    text?: string;
    onSuccess?: (data: T) => void;
  };
};

type Response<T> =
  | {
      data: T;
      isOk: true;
    }
  | {
      isOk: false;
    };

export const useServerAction = () => {
  const [isPending, startTransition] = useTransition();

  const _enqueueServerAction = async <T>({
    action,
    error,
    success,
  }: Args<T>): Promise<Response<T>> => {
    try {
      const result = await action();

      if (success.text) {
        toast.success(success.text);
      }

      if (success.onSuccess) {
        success.onSuccess(result);
      }

      return { data: result, isOk: true };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      toast.error(error.text || "エラーが発生しました");

      if (error.onError) {
        error.onError();
      }

      return { isOk: false };
    }
  };

  const enqueueServerAction = <T>(args: Args<T>) => {
    startTransition(() => {
      _enqueueServerAction(args);
    });
  };

  return { isPending, enqueueServerAction };
};
