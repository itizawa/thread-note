import { format } from "date-fns";

// Template definitions
export const TEMPLATES = {
  DAILY_REPORT: {
    label: "日報",
    title: () => {
      const today = new Date();
      return `${format(today, "yyyy/MM/dd")}の日報`;
    },
    body: `## 今日やったこと
-
-

## 明日やること
-
- `,
  },
  BLOG: {
    label: "ブログ",
    title: () => "ブログタイトル",
    body: `## テーマ
（今日書きたいこと）

## きっかけ
（このテーマを思い出した理由）

## エピソード
（具体的な出来事、描写を入れて）

## 感情の変化・気づき
（その時どう思った？そこから何を得た？）

## まとめ
（今の自分から見たらどう感じるか）

## タイトル案
（仮でもOK）`,
  },
  REQUIREMENTS: {
    label: "要件定義",
    title: () => "要件定義",
    body: `## タイトル
[機能名] 簡潔な説明

## 概要
チケットの目的を簡潔に説明します。何を実装・改善するのか、なぜそれが必要なのかを記載します。

## 実装詳細
技術的な実装方法や考慮事項を記載します。

**実装予定内容:**
- 検索APIエンドポイント ("GET /api/memos/search?q=keyword") の追加
- Memoテーブルにfull-textインデックスを作成
- フロントエンドで検索入力フォームを追加

## テスト項目
- [ ] 単一キーワード検索のテスト
- [ ] 複数キーワード検索のテスト
- [ ] 検索結果が空の場合のテスト
- [ ] 特殊文字を含むキーワードのテスト
`,
  },
} as const;
