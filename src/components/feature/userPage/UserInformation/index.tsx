import { UserIcon } from "@/components/model/user/UserIcon";

type Props = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
  };
};
export const UserInformation = ({ user }: Props) => {
  return (
    <div className="flex items-center space-x-4">
      <UserIcon size="lg" userImage={user.image} />
      <h1>{user.name}</h1>
    </div>
  );
};
