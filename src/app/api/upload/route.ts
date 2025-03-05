import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // セッションを取得して認証チェック
    const session = await auth();

    const currentUser = session?.user
      ? await prisma.user.findUnique({
          where: { id: session.user.id },
          include: {
            planSubscription: {
              select: {
                plan: true,
              },
            },
          },
        })
      : null;
    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    if (currentUser.planSubscription?.plan.name !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    // フォームデータからファイルを取得
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが見つかりません" },
        { status: 400 }
      );
    }

    // ファイルタイプをチェック
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "画像ファイルまたは動画ファイルのみアップロードできます" },
        { status: 400 }
      );
    }

    // ファイル名を生成（ユニークにするためにタイムスタンプを追加）
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Vercel Blob Storageにアップロード
    const blob = await put(fileName, file, {
      access: "public", // 公開アクセス
    });

    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: blob.pathname,
    });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
