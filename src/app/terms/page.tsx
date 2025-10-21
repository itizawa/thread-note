import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import Link from "next/link";

export async function generateMetadata() {
  return generateMetadataObject({ title: "Thread Note - 利用規約" });
}

export default async function Page() {
  return (
    <>
      <Navigation />
      <main className="w-full bg-gray-100 overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 h-full">
        <div className="w-full max-w-[700px] mx-auto rounded-lg border p-4 bg-white space-y-4">
          <div className="w-[100%] md:p-[24px] p-[16px] flex flex-col">
            <p className="text-2xl">利用規約</p>
            <h3 className="mt-[24px] mb-[16px]">第1条(はじめに)</h3>
            <p>
              「Thread Note」運営チーム が提供する「Thread
              Note」は、ユーザーに心から満足していただけるサービスを目指しています。
              <br />
              以下の利用規約(以下「本規約」といいます。)にご同意の上での利用をお願いします。
              <br />
              本規約は、運営チームとユーザー間の本サービスの利用条件を定めるものです。運営チームは、予告なく本規約を改定する権利を有します。改定された規約は本サービスに掲載することで発効します。
            </p>
            <h3 className="mt-[24px] mb-[16px]">
              第2条(本サービス上のコンテンツ)
            </h3>
            <p>
              ユーザーは、法令や規則を遵守するとともに、自身の提供するコンテンツに全責任を負います。他者に対して差し支えない内容のみを投稿してください。
              <br />
              本サービスを通じて取得または公開されるコンテンツに対する利用や依存は、ユーザーの責任とします。運営チームはコンテンツの完全性、真実性、正確性、または信頼性については一切の保証をしません。
              <br />
              ユーザーは、不適切なコンテンツに接するリスクを理解し、承知したものとします。運営チームは利用規約違反のコンテンツを削除する権利を保有します。
            </p>
            <h3 className="mt-[24px] mb-[16px]">第3条(本サービスの利用)</h3>
            <p>
              本サービスは、運営チームの判断により変更されることがあります。
              <br />
              また、サービスの一時停止や終了、利用制限の設定も予告なく行われる場合があります。
            </p>
            <h3 className="mt-[24px] mb-[16px]">第4条(本規約の終了)</h3>
            <p>
              運営チームは、本規約違反やその他の理由で、ユーザーのアカウントを一時停止または削除する権利を保有します。
            </p>
            <h3 className="mt-[24px] mb-[16px]">第5条(一般条件)</h3>
            <p>
              本規約は随時改定されることがあり、最新版は
              <Link href={urls.terms} className="text-sky-700">
                利用規約
              </Link>
              にて確認できます。
              <br />
              改定後の本規約は、ユーザーがサービスを継続して利用することで同意したものとみなされます。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
