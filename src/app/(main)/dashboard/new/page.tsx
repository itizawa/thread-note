import { CreateNewThreadForm } from "@/features/newThread/CreateNewThreadForm";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { LinkToBack } from "@/shared/ui/LinkToBack";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - 新規作成",
});

export default async function Page() {
  return (
    <div className="flex h-full">
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex flex-col space-y-4 max-w-[700px] mx-auto">
          <LinkToBack href={urls.dashboard} text="スレッド一覧に戻る" />
          <CreateNewThreadForm />
        </div>
      </main>
    </div>
  );
}
