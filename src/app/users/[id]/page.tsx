import { Footer } from "@/components/feature/layout/Footer";
import { Navigation } from "@/components/feature/layout/Navigation";
import { UserInformation } from "@/components/feature/userPage/UserInformation";
import { generateMetadataObject } from "@/lib/generateMetadataObject";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata, NextSegmentPage } from "next";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: NextSegmentPage<{
  params: { id: string };
}>["arguments"]): Promise<Metadata> => {
  const { id: userId } = await params;

  const user = await trpc.user.getUser({
    id: userId,
  });

  if (!user) {
    return generateMetadataObject({
      title: "User Not Found",
      description: "The requested user does not exist.",
      images: ["/api/og?title=NotFound"],
    });
  }

  const title = `${user.name}のスレッド一覧ページ`;
  return generateMetadataObject({
    title: title,
    images: [`/api/og?title=${encodeURIComponent(title)}`],
  });
};
const Page: NextSegmentPage<{
  params: { id: string };
}> = async ({ params }) => {
  const { id: userId } = await params;

  const user = await trpc.user.getUser({
    id: userId,
  });

  if (!user) notFound();

  return (
    <HydrateClient>
      <Navigation />
      <div className="relative bg-gray-100">
        <main className="w-full min-h-screen overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4">
          <div className="w-full max-w-[700px] mx-auto space-y-4">
            <UserInformation user={user} />
          </div>
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
};

export default Page;
