"use client";

import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import {
  ArchiveOutlined,
  CopyAllOutlined,
  SaveAlt,
  SaveAltOutlined,
  ShareOutlined,
} from "@mui/icons-material/";
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function MuiDemoPage() {
  const [text, setText] = useState("");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          MUI コンポーネントデモ
        </Typography>

        <Alert>デモページです。</Alert>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Buttonコンポーネント
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              loading プロパティを追加した拡張版
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary">
                  通常
                </Button>
                <Button variant="outlined" color="secondary">
                  アウトライン
                </Button>
                <Button variant="text" color="error">
                  テキスト
                </Button>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" startIcon={<SaveAlt />}>
                  保存
                </Button>
                <Button variant="outlined" startIcon={<CopyAllOutlined />}>
                  コピー
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareOutlined />}
                  color="success"
                >
                  共有
                </Button>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" loading>
                  読み込み中...
                </Button>
                <Button variant="outlined" loading color="secondary">
                  処理中
                </Button>
                <Button variant="contained" disabled>
                  無効
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" size="small">
                  Small
                </Button>
                <Button variant="contained" size="medium">
                  Medium
                </Button>
                <Button variant="contained" size="large">
                  Large
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveAltOutlined />}
                >
                  Small
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<SaveAltOutlined />}
                >
                  Medium
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveAltOutlined />}
                >
                  Large
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              アイコンボタンの例（MUI標準）
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<CopyAllOutlined />}>
                コピー
              </Button>
              <Button variant="outlined" startIcon={<CopyAllOutlined />}>
                共有
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArchiveOutlined />}
                color="error"
              >
                アーカイブ
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              テキストフィールドの例
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="標準"
                variant="outlined"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <TextField
                label="複数行"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                placeholder="ここに入力してください..."
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              タイポグラフィの例
            </Typography>
            <Stack spacing={1}>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              <Typography variant="body1">
                Body 1: これは本文のテキストです。Lorem ipsum dolor sit amet.
              </Typography>
              <Typography variant="body2">
                Body 2: これは小さめの本文テキストです。
              </Typography>
              <Typography variant="caption" display="block">
                Caption: キャプションテキスト
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              カードアクションの例
            </Typography>
            <Typography variant="body2" color="text.secondary">
              このカードにはアクションボタンがあります
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">詳細を見る</Button>
            <Button size="small" variant="contained">
              実行
            </Button>
          </CardActions>
        </Card>

        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">
            プライマリカラー (#ffb86a) を使用したボックス
          </Typography>
          <Typography variant="body2">
            テーマのプライマリカラーが正しく適用されています
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
