"use client";

import { Button } from "@/components/ui/button";
import { Hash, List } from "lucide-react";

type Props = {
  onClickIcon: (options: {
    insertText: string;
    removeIfExist: boolean;
  }) => void;
  formState: {
    isDisabled: boolean;
    isPending: boolean;
  };
  bottomButtons: {
    onCancel?: () => void;
    submitText: string;
    onSubmit: () => void;
  };
};

export const PostController = ({
  bottomButtons,
  formState,
  onClickIcon,
}: Props) => {
  return (
    <div className={"flex items-center justify-between"}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="shadow-none"
          size="icon"
          onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
          onClick={() => {
            onClickIcon({ insertText: "# ", removeIfExist: false });
          }}
        >
          <Hash className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="shadow-none"
          size="icon"
          onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
          onClick={() => onClickIcon({ insertText: "- ", removeIfExist: true })}
        >
          <List className="h-5 w-5" />
        </Button>
        {/*<Button variant="ghost" size="icon">
            <Link2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button> */}
      </div>
      <div className="flex items-center space-x-2">
        {bottomButtons.onCancel && (
          <Button variant="ghost" onClick={bottomButtons.onCancel}>
            キャンセル
          </Button>
        )}
        <Button
          onClick={bottomButtons.onSubmit}
          disabled={formState.isDisabled}
          loading={formState.isPending}
        >
          {bottomButtons.submitText}
        </Button>
      </div>
    </div>
  );
};
