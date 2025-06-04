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
} as const;