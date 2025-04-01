import { getCurrentUser } from "@/app/actions/userActions";
import { CreateNewThreadForm } from "@/features/newThread/CreateNewThreadForm";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - 新規作成",
});

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="flex h-full">
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex flex-col space-y-4 max-w-[700px] mx-auto">
          <Link
            href={urls.dashboard}
            className="flex items-center space-x-1 text-gray-700 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">スレッド一覧に戻る</span>
          </Link>
          <CreateNewThreadForm />
        </div>
      </main>

      {/* <aside className="hidden w-80 shrink-0 overflow-auto p-4 lg:block bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">タイトル</h3>
            <p className="font-medium">スレッドの投稿後自動で生成されます</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">タグ</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                #features
              </Button>
              <Button variant="secondary" size="sm">
                #hello
              </Button>
              <Button variant="secondary" size="sm">
                #todo
              </Button>
            </div>
          </div>
        </div>
      </aside> */}
    </div>
  );
}
