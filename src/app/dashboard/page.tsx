import { ThreadList } from "@/components/feature/dashboard/ThreadList";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/userActions";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - ダッシュボード",
});
export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="h-full relative">
      {/* メインコンテンツ */}
      <main className="w-full overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 h-full">
        <div className="w-full max-w-[700px] mx-auto h-full">
          <ThreadList />
        </div>
      </main>

      {/* 右サイドバー */}
      {/* <aside className="hidden w-80 shrink-0 overflow-auto p-4 lg:block bg-white">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input type="search" placeholder="メモを検索" className="pl-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">統計</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2">
                <div className="text-sm text-gray-500">リンク</div>
                <div className="text-lg font-medium">0</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-sm text-gray-500">Todo</div>
                <div className="text-lg font-medium">0/1</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-sm text-gray-500">コード</div>
                <div className="text-lg font-medium">0</div>
              </div>
            </div>
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
