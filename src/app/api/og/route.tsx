import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Thread Note";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          padding: "0px 100px",
          backgroundColor: "#efefef",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* 背景デザイン */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <polygon points="0,0 0,200 400,0" fill="orange" />
          <polygon points="0,230 0,630 200,630" fill="lightgreen" />
          <polygon points="1200,0 1200,400 900,0" fill="lightblue" />
          <polygon points="1200,430 1200,630 800,630" fill="pink" />
        </svg>
        {/* 記事タイトル */}
        <div
          style={{
            position: "relative",
            fontSize: "50px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
