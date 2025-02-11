import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function UserIcon({
  user,
  className,
}: {
  user: User | null;
  className?: string;
}) {
  return (
    <Avatar className={`h-8 w-8 ${className ?? ""}`}>
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback>
        <Skeleton className="w-8 h-8 rounded-full" />
      </AvatarFallback>
    </Avatar>
  );
}
