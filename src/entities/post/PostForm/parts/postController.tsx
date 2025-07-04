"use client";

import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/Tooltip";
import {
  Bold,
  CheckSquare,
  Hash,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

type Props = {
  onClickIcon: (options: {
    insertText: string;
    removeIfExist: boolean;
  }) => void;
  onClickImageUpload: () => void;
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
  onClickImageUpload,
}: Props) => {
  return (
    <div
      className={
        "md:flex items-center space-y-4 md:space-y-0 md:space-x-4 justify-between"
      }
    >
      <div className="flex items-center space-x-2">
        <Tooltip content="見出し">
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
        </Tooltip>
        <Tooltip content="強調">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "****", removeIfExist: true })
            }
          >
            <Bold className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="チェックボックス">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "- [ ] ", removeIfExist: true })
            }
          >
            <CheckSquare className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="箇条書きリスト">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "- ", removeIfExist: true })
            }
          >
            <List className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="番号付きリスト">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "1. ", removeIfExist: true })
            }
          >
            <ListOrdered className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="引用">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "> ", removeIfExist: true })
            }
          >
            <Quote className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content="画像をアップロード">
          <Button
            variant="outline"
            className="shadow-none"
            size="icon"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={onClickImageUpload}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-2">
        {bottomButtons.onCancel && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={bottomButtons.onCancel}
          >
            キャンセル
          </Button>
        )}
        <Button
          className="flex-1"
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
