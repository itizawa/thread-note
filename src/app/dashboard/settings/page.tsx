import { getCurrentUser } from "@/app/actions/userActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { urls } from "@/consts/urls";
import { FileManagement } from "@/feature/settings/FileManagement";
import { UpdateUserNameForm } from "@/feature/settings/UpdateUserNameForm";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { File, Settings } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - 設定",
});

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(urls.top);

  const tabFormParams = searchParams ? (await searchParams).tab : "profile";
  const tab = typeof tabFormParams === "string" ? tabFormParams : "profile";

  return (
    <div className="flex h-full">
      <main className="flex flex-1 overflow-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
        <div className="flex-1 flex flex-col space-y-4 max-w-[700px] mx-auto">
          <Tabs
            defaultValue={tab}
            className="flex flex-col h-full overflow-y-auto"
          >
            <TabsList className="flex justify-start">
              <TabsTrigger value="profile" className="font-bold">
                <Settings className="h-4 w-4 mr-1" />
                プロフィール設定
              </TabsTrigger>
              <TabsTrigger value="files" className="font-bold">
                <File className="h-4 w-4 mr-1" />
                ファイル管理
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <UpdateUserNameForm currentUser={currentUser} />
            </TabsContent>
            <TabsContent value="files" className="overflow-y-auto flex-1">
              <FileManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
