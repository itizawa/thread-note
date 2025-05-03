import { getCurrentUser } from "@/app/actions/userActions";
import { FileManagement } from "@/features/settings/FileManagement";
import { TokenUsageManagement } from "@/features/settings/TokenUsageManagement";
import { UpdateUserNameForm } from "@/features/settings/UpdateUserNameForm";
import { SCROLL_CONTAINER_ID } from "@/shared/consts/domId";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
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
      <main
        className="flex flex-1 border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 overflow-y-auto"
        id={SCROLL_CONTAINER_ID}
      >
        <div className="flex-1 flex flex-col space-y-4 max-w-[700px] mx-auto">
          <Tabs defaultValue={tab} className="flex flex-col h-full">
            <TabsList className="flex justify-start">
              <TabsTrigger value="profile" className="font-bold">
                <Settings className="h-4 w-4 mr-1" />
                基本設定
              </TabsTrigger>
              <TabsTrigger value="files" className="font-bold">
                <File className="h-4 w-4 mr-1" />
                ファイル管理
              </TabsTrigger>
              {/* <TabsTrigger value="tokens" className="font-bold">
                <MessageSquare className="h-4 w-4 mr-1" />
                トークン使用量
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="profile">
              <UpdateUserNameForm currentUser={currentUser} />
            </TabsContent>
            <TabsContent value="files" className="flex-1">
              <FileManagement />
            </TabsContent>
            <TabsContent value="tokens" className="flex-1">
              <TokenUsageManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
