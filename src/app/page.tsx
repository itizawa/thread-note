import { signIn } from "@/auth";
import { Footer } from "@/components/feature/layout/Footer";
import { Navigation } from "@/components/feature/layout/Navigation";
import { Button } from "@/components/ui/button";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "./actions/userActions";

export const metadata: Metadata = generateMetadataObject();

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <HydrateClient>
      <Navigation />
      <main>
        <section className="px-4 py-16 text-gray-600 space-y-4">
          <div className="mx-auto container text-center space-y-4">
            <h1 className="mx-auto max-w-2xl text-2xl font-bold">
              手軽に情報を残す
              <br />
              スレッド形式のメモサービス
            </h1>
            {currentUser ? (
              <div className="mx-auto container text-center space-y-2">
                <Link href={urls.dashboard}>
                  <Button size="lg" variant="default" className="font-bold">
                    ダッシュボードへ
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mx-auto container text-center space-y-2">
                <p className="text-lg">
                  <Link href={urls.terms} className="text-sky-700">
                    利用規約
                  </Link>
                  に同意して始める
                </p>{" "}
                <div className="space-y-4">
                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                  >
                    <button className="mx-auto">
                      <Image
                        src="/google-login.png"
                        alt="Google"
                        width={180}
                        height={200}
                        className="mr-2"
                      />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="mx-auto justify-center flex">
            <Image
              src="/lp/pc.png"
              alt="Description of image"
              width={1000}
              height={300}
              className="shadow-lg md:block hidden"
            />
            <Image
              src="/lp/sp.png"
              alt="Description of image"
              width={700}
              height={300}
              className="md:hidden block"
            />
          </div>
        </section>
        <section className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Thread Note の特徴
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              基本機能は全て無料で使用できます
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  スレッド形式で情報整理
                </h3>
                <p className="text-gray-600 mt-2">
                  関連する情報をスレッドでまとめ
                  <br />
                  すばやくアクセスできます。
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  シンプルで直感的なUI
                </h3>
                <p className="text-gray-600 mt-2">
                  誰でも簡単に使えるデザインで
                  <br />
                  スムーズな操作が可能です。
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  柔軟な共有機能
                </h3>
                <p className="text-gray-600 mt-2">
                  スレッドを簡単に共有し
                  <br />
                  世界中にシェアできます。
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </HydrateClient>
  );
}
