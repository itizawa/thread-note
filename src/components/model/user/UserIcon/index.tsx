import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Props = {
  size: "sm" | "md" | "lg";
  userImage?: User["image"];
  className?: string;
};

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function UserIcon({ userImage, className, size = "md" }: Props) {
  return (
    <Avatar className={`${sizeMap[size]} ${className ?? ""}`}>
      <AvatarImage src={userImage ?? undefined} />
      <AvatarFallback>
        <Skeleton className={`${sizeMap[size]} rounded-full`} />
      </AvatarFallback>
    </Avatar>
  );
}
