import { getCurrentUser } from "@/app/actions/userActions";
import { FileManagement } from "@/features/settings/FileManagement";
import { UpdateUserNameForm } from "@/features/settings/UpdateUserNameForm";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { File, Settings } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useTranslation } from "next-i18next";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - 設定",
});

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { t } = useTranslation("common");
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
                {t("settings.profileSettings")}
              </TabsTrigger>
              <TabsTrigger value="files" className="font-bold">
                <File className="h-4 w-4 mr-1" />
                {t("settings.fileManagement")}
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
