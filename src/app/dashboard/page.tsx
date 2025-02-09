import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FlameIcon as Fire,
  Hash,
  Link2,
  ListTodo,
  MoreVertical,
  Paperclip,
  RefreshCw,
  Search,
  ThumbsUp,
} from "lucide-react";
import type React from "react"; // Import React

export default function Page() {
  return (
    <div className="flex-1 flex h-screen">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto border-x">
        <div className="space-y-4 p-4">
          {/* メモ入力フォーム */}
          <div className="space-y-4 rounded-lg border p-4">
            <textarea
              placeholder="Any thoughts..."
              className="w-full resize-none border-0 bg-transparent text-lg outline-none"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Hash className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ListTodo className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Link2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="private">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">プライベート</SelectItem>
                    <SelectItem value="public">パブリック</SelectItem>
                  </SelectContent>
                </Select>
                <Button>保存</Button>
              </div>
            </div>
          </div>

          {/* メモリスト */}
          <div className="space-y-4">
            <MemoCard
              content="Hello world. This is my first memo! #hello"
              timestamp="10時間前"
              referenced={1}
            />
            <MemoCard
              content="Wow, it can be referenced too! REALLY GREAT!!! #features"
              timestamp="10時間前"
              referenceTo="Hello world. This is my first memo! #hello"
              reactions={{
                thumbsUp: 1,
                heart: 1,
                fire: 1,
              }}
            />
            <MemoCard
              content={
                <div className="space-y-2">
                  <p>And here are my tasks. #todo</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task1" checked />
                      <label htmlFor="task1" className="line-through">
                        deploy memos for myself;
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task2" />
                      <label htmlFor="task2">share to my friends;</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="task3" />
                      <label htmlFor="task3">sounds good to me!</label>
                    </div>
                  </div>
                </div>
              }
              timestamp="10時間前"
            />
          </div>
        </div>
      </main>

      {/* 右サイドバー */}
      <aside className="hidden w-80 shrink-0 overflow-auto p-4 lg:block">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input type="search" placeholder="メモを検索" className="pl-10" />
          </div>

          <div className="rounded-lg border p-4">
            <Calendar mode="single" className="w-full" />
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
      </aside>
    </div>
  );
}

function MemoCard({
  content,
  timestamp,
  referenced,
  referenceTo,
  reactions,
}: {
  content: React.ReactNode;
  timestamp: string;
  referenced?: number;
  referenceTo?: string;
  reactions?: {
    thumbsUp?: number;
    heart?: number;
    fire?: number;
  };
}) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">{timestamp}</div>
          <div className="space-y-2">
            {content}
            {referenced && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Referenced by ({referenced})</span>
              </div>
            )}
            {referenceTo && (
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-sm text-gray-500">{referenceTo}</div>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      {reactions && (
        <div className="flex items-center space-x-2">
          {reactions.thumbsUp && (
            <Button variant="secondary" size="sm" className="space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{reactions.thumbsUp}</span>
            </Button>
          )}
          {reactions.heart && (
            <Button variant="secondary" size="sm" className="space-x-1">
              <span className="text-red-500">♥</span>
              <span>{reactions.heart}</span>
            </Button>
          )}
          {reactions.fire && (
            <Button variant="secondary" size="sm" className="space-x-1">
              <Fire className="h-4 w-4" />
              <span>{reactions.fire}</span>
            </Button>
          )}
          <Button variant="secondary" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
