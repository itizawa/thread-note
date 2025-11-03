// ローディング表示用のスケルトン
export function ThreadListSkeleton() {
  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex justify-between items-center gap-4">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
