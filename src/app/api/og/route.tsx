import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Thread Note";
  const type = searchParams.get("type") || "default";

  if (type === "square") {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "1080px",
            height: "1080px",
            backgroundColor: "#1a202c",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            fontWeight: "bold",
          }}
        >
          {title}
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: "#1a202c",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
