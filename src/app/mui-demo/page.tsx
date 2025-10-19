"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Archive, Copy, Share2 } from "lucide-react";
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
              ボタンの例
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                Primary
              </Button>
              <Button variant="contained" color="secondary">
                Secondary
              </Button>
              <Button variant="contained" color="error">
                Error
              </Button>
              <Button variant="contained" color="success">
                Success
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              アイコンボタンの例
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<Copy />}>
                コピー
              </Button>
              <Button variant="outlined" startIcon={<Share2 />}>
                共有
              </Button>
              <Button variant="outlined" startIcon={<Archive />} color="error">
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
