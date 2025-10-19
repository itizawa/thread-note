import { getCurrentUser } from "@/app/actions/userActions";
import { signIn, signOut } from "@/auth";
import { UserIcon } from "@/entities/user/UserIcon";
import { Button } from "@/shared/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import Link from "next/link";

export async function NavigationUserIcon() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit" color="primary" variant="outlined" size="small">
          ログイン
        </Button>
      </form>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserIcon userImage={currentUser.image} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">ダッシュボード</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            "use server";
            await signOut();
          }}
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
