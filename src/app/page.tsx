import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { Box } from "@/shared/components/Box";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { HeroSection, HeroSectionSkeleton } from "./_components/HeroSection";
import { ThreadCountSection } from "./_components/ThreadCountSection";
import { ThreadCountSectionSkeleton } from "./_components/ThreadCountSection/ThreadCountSection.skeleton";

export const metadata: Metadata = generateMetadataObject();

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <section className="px-4 py-16 text-gray-600 space-y-4">
          <Suspense fallback={<HeroSectionSkeleton />}>
            <HeroSection />
          </Suspense>
          <div className="mx-auto justify-center flex">
            <Image
              src="/lp/pc.png"
              alt="Description of image"
              width={1000}
              height={300}
              className="shadow-lg md:block hidden"
              priority
            />
            <Image
              src="/lp/sp.png"
              alt="Description of image"
              width={700}
              height={300}
              className="md:hidden block"
              priority
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
            <Box mb="16px">
              <Suspense fallback={<ThreadCountSectionSkeleton />}>
                <ThreadCountSection />
              </Suspense>
            </Box>
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
    </>
  );
}
