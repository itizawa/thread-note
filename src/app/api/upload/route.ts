import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { User } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024; // 100MB
// ファイルサイズの制限 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UserWithPlan = {
  planSubscription: {
    plan: {
      name: string;
      id: string;
    };
  } | null;
} & User;

export async function POST(request: NextRequest) {
  try {
    // セッションを取得して認証チェック
    const session = await auth();

    const currentUser: UserWithPlan | null = session?.user
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

    // フォームデータからファイルを取得
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const validateResult = await validate(currentUser, file);
    if (validateResult instanceof NextResponse) {
      return validateResult;
    }

    // ファイル名を生成（ユニークにするためにタイムスタンプを追加）
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Vercel Blob Storageにアップロード
    const blob = await put(fileName, file, {
      access: "public", // 公開アクセス
    });

    // ファイル情報をデータベースに保存
    await prisma.file.create({
      data: {
        userId: currentUser.id,
        path: blob.url,
        name: blob.pathname,
        size: file.size,
      },
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

const validate = async (currentUser: UserWithPlan, file: File) => {
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

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ファイルサイズは10MB以下にしてください" },
      { status: 400 }
    );
  }

  // 管理者プランの場合は制限なし
  if (
    currentUser?.planSubscription?.plan.name === "admin" ||
    currentUser?.planSubscription?.plan.name === "premium"
  ) {
    return null;
  }

  const usedStorage = await prisma.file.aggregate({
    where: { userId: currentUser.id },
    _sum: { size: true },
  });

  const currentUsage = usedStorage._sum.size ?? 0;

  // 上限を超えていないか確認
  if (currentUsage + file.size > MAX_STORAGE_LIMIT) {
    return NextResponse.json(
      {
        error: "これ以上画像をアップロードできません。",
        code: "STORAGE_LIMIT_EXCEEDED",
      },
      { status: 400 }
    );
  }

  return null;
};
