import { signIn } from "@/auth";
import { Button } from "@/shared/components/Button";
import { urls } from "@/shared/consts/urls";
import { trpc } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { HeroSectionLayout } from "./HeroSection.layout";

export const HeroSection = () => {
  const currentUser = use(trpc.user.getCurrentUser());

  return (
    <HeroSectionLayout>
      {currentUser ? (
        <Link href={urls.dashboard}>
          <Button size="large" variant="contained">
            ダッシュボードへ
          </Button>
        </Link>
      ) : (
        <div className="mx-auto container text-center space-y-2">
          <p className="text-lg">
            <Link href={urls.terms} className="text-sky-700">
              利用規約
            </Link>
            に同意して始める
          </p>
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
    </HeroSectionLayout>
  );
};
