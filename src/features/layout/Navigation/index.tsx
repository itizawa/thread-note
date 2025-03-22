import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { NavigationUserIcon } from "./parts/NavigationUserIcon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const Navigation = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    router.push(router.asPath, undefined, { locale: lng });
  };

  return (
    <header className="sticky z-50 top-0 bg-white shadow-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Link href={"/"}>
            <h1 className="text-lg font-medium">Thread Note (β)</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => changeLanguage("en")}>EN</button>
          <button onClick={() => changeLanguage("ja")}>JA</button>
        </div>
        <Suspense fallback={<Skeleton className="w-8 h-8 rounded-full" />}>
          <NavigationUserIcon />
        </Suspense>
      </div>
    </header>
  );
};
