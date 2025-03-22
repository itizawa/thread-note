import { signIn } from "@/auth";
import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Button } from "@/shared/ui/button";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "./actions/userActions";
import { useTranslation } from "next-i18next";

export const metadata: Metadata = generateMetadataObject();

export default async function Home() {
  const { t } = useTranslation("common");
  const currentUser = await getCurrentUser();

  return (
    <HydrateClient>
      <Navigation />
      <main>
        <section className="px-4 py-16 text-gray-600 space-y-4">
          <div className="mx-auto container text-center space-y-4">
            <h1 className="mx-auto max-w-2xl text-2xl font-bold">
              {t("home.title")}
              <br />
              {t("home.subtitle")}
            </h1>
            {currentUser ? (
              <div className="mx-auto container text-center space-y-2">
                <Link href={urls.dashboard}>
                  <Button size="lg" variant="default" className="font-bold">
                    {t("home.dashboardButton")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mx-auto container text-center space-y-2">
                <p className="text-lg">
                  <Link href={urls.terms} className="text-sky-700">
                    {t("home.termsAgreement")}
                  </Link>
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
              {t("home.features.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("home.features.description")}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  {t("home.features.threadedInfo.title")}
                </h3>
                <p className="text-gray-600 mt-2">
                  {t("home.features.threadedInfo.description")}
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  {t("home.features.simpleUI.title")}
                </h3>
                <p className="text-gray-600 mt-2">
                  {t("home.features.simpleUI.description")}
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  {t("home.features.flexibleSharing.title")}
                </h3>
                <p className="text-gray-600 mt-2">
                  {t("home.features.flexibleSharing.description")}
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
