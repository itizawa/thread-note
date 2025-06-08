# タグ機能テスト仕様

## 概要
スレッドにタグを設定できる機能を追加しました。

## 実装された機能

### 1. データベース
- `Tag` テーブル: タグの情報を格納
- `ThreadTag` テーブル: スレッドとタグの関連を格納

### 2. API (tRPC)
- `tag.getTagsByThreadId`: スレッドのタグを取得
- `tag.searchTags`: タグを検索
- `tag.createTag`: 新しいタグを作成
- `tag.addTagToThread`: スレッドにタグを追加
- `tag.removeTagFromThread`: スレッドからタグを削除
- `tag.getThreadsByTag`: タグで絞り込んだスレッドを取得

### 3. UI コンポーネント
- `TagInput`: タグ入力コンポーネント（オートコンプリート付き）
- `TagChip`: タグ表示用チップコンポーネント

### 4. 機能
- スレッド作成時にタグを設定
- スレッド詳細でタグの追加・削除
- タグによるスレッド検索・フィルタリング

## 手動テスト項目

### スレッド作成
1. 新しいスレッド作成画面でタグ入力フィールドが表示される
2. タグを入力してオートコンプリートが動作する
3. 新しいタグが作成できる
4. 既存のタグが選択できる
5. タグ付きスレッドが正常に作成される

### スレッド詳細
1. スレッドに設定されたタグが表示される
2. 「タグを追加」ボタンでタグ追加モードになる
3. タグを追加できる
4. タグを削除できる（×ボタン）

### タグ検索
1. ダッシュボードでタグによるフィルタリングができる
2. 公開スレッドでタグ検索ができる

## 技術仕様

### データベーススキーマ
```sql
-- Tag テーブル
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ThreadTag テーブル
CREATE TABLE thread_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(thread_id, tag_id)
);
```

### API エンドポイント
- `POST /api/trpc/tag.createTag`
- `GET /api/trpc/tag.getTagsByThreadId`
- `GET /api/trpc/tag.searchTags`
- `POST /api/trpc/tag.addTagToThread`
- `DELETE /api/trpc/tag.removeTagFromThread`
- `GET /api/trpc/tag.getThreadsByTag`