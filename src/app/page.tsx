import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getData } from "./actions/test";

export default async function Home() {
  const users = await getData();
  console.log(users);

  return (
    <div className="min-h-screen">
      <main>
        <section className="bg-orange-400 px-4 py-16 text-white">
          <div className="mx-auto container text-center">
            <h1 className="mx-auto max-w-2xl text-2xl font-medium">
              Thread Note は<br />
              アイデアや情報をスレッド形式で手軽にメモすることができるサービスです。
            </h1>
            {/* <p className="text-lg">まずは使い心地を確かめてみてください。</p>
            <div className="space-y-4">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Playground
              </Button>
            </div> */}
          </div>
        </section>
        {users.map((user) => (
          <div key={user.id}>
            <p>{user.name}</p>
          </div>
        ))}

        <section className="mx-auto container py-6 px-2">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="スレッドを検索"
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">最近のスレッド</h2>
              <div className="space-y-4">
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
                <ThreadCard
                  title="「Expoの使い方」のメモ"
                  author="@hoge"
                  date="2025/01/11に作成"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ThreadCard({
  title,
  author,
  date,
}: {
  title: string;
  author: string;
  date: string;
}) {
  return (
    <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
      <div className="space-y-2">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
