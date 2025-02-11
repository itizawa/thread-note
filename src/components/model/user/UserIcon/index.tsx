import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function UserIcon({ user }: { user: User | null }) {
  return (
    <Avatar className="h-8 w-8 cursor-pointer">
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback>
        <Skeleton className="w-8 h-8 rounded-full" />
      </AvatarFallback>
    </Avatar>
  );
}
