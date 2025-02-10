import { getCurrentUser } from "@/app/actions/test";
import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

export const Navigation = async () => {
  const currentUser = await getCurrentUser();
  return (
    <header className="sticky z-1200 top-0 border-b bg-white shadow-md">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
          <Link href={"/"}>
            <h1 className="text-lg font-medium">Thread Note</h1>
          </Link>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">検索</span>
            </Button>
            </div> */}
        {currentUser ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              ログアウト
            </Button>
          </form>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              ログイン
            </Button>
          </form>
        )}
      </div>
    </header>
  );
};
