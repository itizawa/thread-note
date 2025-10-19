"use client";

import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { Tooltip } from "@/shared/components/Tooltip";
import {
  CheckBox,
  FormatBold,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Image as ImageIcon,
  Tag,
} from "@mui/icons-material";

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
      <Box display="flex" alignItems="center" gap={"4px"}>
        <Tooltip content="見出し">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() => {
              onClickIcon({ insertText: "# ", removeIfExist: false });
            }}
            isCircle={false}
          >
            <Tag />
          </IconButton>
        </Tooltip>
        <Tooltip content="強調">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "****", removeIfExist: true })
            }
            isCircle={false}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>
        <Tooltip content="チェックボックス">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "- [ ] ", removeIfExist: true })
            }
          >
            <CheckBox />
          </IconButton>
        </Tooltip>
        <Tooltip content="箇条書きリスト">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "- ", removeIfExist: true })
            }
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>
        <Tooltip content="番号付きリスト">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "1. ", removeIfExist: true })
            }
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>
        <Tooltip content="引用">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={() =>
              onClickIcon({ insertText: "> ", removeIfExist: true })
            }
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>
        <Tooltip content="画像をアップロード">
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()} // フォーカスが外れるのを防ぐ
            onClick={onClickImageUpload}
          >
            <ImageIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" alignItems="center" gap={"8px"}>
        {bottomButtons.onCancel && (
          <Button
            variant="outlined"
            className="flex-1"
            onClick={bottomButtons.onCancel}
            sx={{ minWidth: "fit-content" }}
          >
            キャンセル
          </Button>
        )}
        <Button
          onClick={bottomButtons.onSubmit}
          disabled={formState.isDisabled}
          loading={formState.isPending}
          fullWidth
        >
          {bottomButtons.submitText}
        </Button>
      </Box>
    </div>
  );
};
