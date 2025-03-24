import { Skeleton } from "@/shared/ui/skeleton";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Props = {
  size?: number;
  userImage?: User["image"];
  className?: string;
  onClick?: () => void;
};

export function UserIcon({ userImage, className, size = 8, onClick }: Props) {
  return (
    <Avatar
      className={`w-${size} h-${size}  ${className ?? ""} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <AvatarImage
        src={userImage ?? undefined}
        className="rounded-full border border-gray-200"
      />
      <AvatarFallback>
        <Skeleton className={`w-${size} h-${size} rounded-full`} />
      </AvatarFallback>
    </Avatar>
  );
}
