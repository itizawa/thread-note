import { Footer } from "@/features/layout/Footer";
import { Navigation } from "@/features/layout/Navigation";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export async function generateMetadata() {
  return generateMetadataObject({ title: "Thread Note - 利用規約" });
}

export default async function Page() {
  const { t } = useTranslation("common");

  return (
    <>
      <Navigation />
      <main className="w-full h-[calc(100vh-56px)] bg-gray-100 overflow-y-auto border-r md:px-6 px-2 md:pt-6 pt-4 pb-4 h-full">
        <div className="w-full max-w-[700px] mx-auto rounded-lg border p-4 bg-white space-y-4">
          <div className="w-[100%] md:p-[24px] p-[16px] flex flex-col">
            <p className="text-2xl">{t("terms.title")}</p>
            <h3 className="mt-[24px] mb-[16px]">{t("terms.sections.introduction.title")}</h3>
            <p>{t("terms.sections.introduction.content")}</p>
            <h3 className="mt-[24px] mb-[16px]">{t("terms.sections.content.title")}</h3>
            <p>{t("terms.sections.content.content")}</p>
            <h3 className="mt-[24px] mb-[16px]">{t("terms.sections.usage.title")}</h3>
            <p>{t("terms.sections.usage.content")}</p>
            <h3 className="mt-[24px] mb-[16px]">{t("terms.sections.termination.title")}</h3>
            <p>{t("terms.sections.termination.content")}</p>
            <h3 className="mt-[24px] mb-[16px]">{t("terms.sections.generalConditions.title")}</h3>
            <p>
              {t("terms.sections.generalConditions.content")}
              <Link href={urls.terms} className="text-sky-700">
                {t("terms.title")}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
