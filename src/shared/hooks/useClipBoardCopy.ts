import { toast } from "sonner";

export const useClipBoardCopy = () => {
  const copy = (url: string, text: string = "URLをコピーしました") => {
    navigator.clipboard.writeText(url);
    toast.success(text);
  };

  return { copy };
};
