import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
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
        </main>
      </div>
    </HydrateClient>
  );
}
