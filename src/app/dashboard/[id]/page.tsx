import { CreateNewPostForm } from "@/components/feature/threadDetail/CreateNewPostForm";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/server";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { threadWithPosts } = await trpc.thread.getThreadWithPosts({
    id,
  });

  if (!threadWithPosts) {
    return notFound();
  }

  return (
    <div className="flex h-full">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex flex-col space-y-4 max-w-[500px] mx-auto">
          {threadWithPosts.posts.map((v) => {
            return <p key={v.id}>{v.body}</p>;
          })}

          <CreateNewPostForm threadId={threadWithPosts.id} />
        </div>
      </main>

      <aside className="hidden w-80 shrink-0 overflow-auto p-4 md:block bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">タイトル</h3>
            <p className="font-medium">メモの投稿後自動で生成されます</p>
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
      </aside>
    </div>
  );
}
