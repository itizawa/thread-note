import { getCurrentUser } from "@/app/actions/userActions";
import { UpdateUserNameForm } from "@/components/feature/settings/UpdateUserNameForm";
import { urls } from "@/consts/urls";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - 設定",
});

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  return (
    <div className="flex h-full">
      <main className="flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex flex-col space-y-4 max-w-[700px] mx-auto">
          <h1 className="text-2xl font-bold mb-6">設定</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">プロフィール設定</h2>
            <UpdateUserNameForm currentUser={currentUser} />
          </div>
        </div>
      </main>
    </div>
  );
}
