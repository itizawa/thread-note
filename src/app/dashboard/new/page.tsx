import { CreateNewThreadForm } from "@/components/feature/newThread/CreateNewThreadForm";

export default function Page() {
  return (
    <div className="flex h-full">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex flex-col space-y-4 max-w-[700px] mx-auto">
          <CreateNewThreadForm />
        </div>
      </main>

      <aside className="hidden w-80 shrink-0 overflow-auto p-4 lg:block bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">タイトル</h3>
            <p className="font-medium">スレッドの投稿後自動で生成されます</p>
          </div>
          {/* <div className="space-y-2">
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
          </div> */}
        </div>
      </aside>
    </div>
  );
}
