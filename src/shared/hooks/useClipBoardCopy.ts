import { toast } from "sonner";

export const useClipBoardCopy = () => {
  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URLをコピーしました");
  };

  return { copy };
};
